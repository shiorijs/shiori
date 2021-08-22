const EventEmitter = require("events");
const Websocket = require("ws");

let Erlpack;

try {
  Erlpack = require("erlpack");
  /* eslint-disable no-empty */
} catch {}

const Constants = require("../../utils/Constants");

/**
 * Represents a discord shard.
 * @extends {EventEmitter}
 */
class Shard extends EventEmitter {
  constructor (manager, id) {
    super();

    /**
      * Id of this shard.
      * @type {Number}
      */
    this.id = id;
    /**
      * Session ID of the current shard connection
      * @type {String}
      */
    this.sessionId = null;
    /**
      * Interval in ms for reconnect time
      * @type {Number}
      */
    this.reconnectInterval = 3000;
    /**
      * Current attempts of reconnecting
      * @type {Number}
      */
    this.reconnectAttempts = 0;

    this.setDefaultProperties();
    /**
      * Hitomi Client
      * @private
      * @type {Client}
      * @name Shard#client
      */
    Object.defineProperty(this, "client", { value: manager.client, writable: false });
    /**
      * Gateway Manager
      * @private
      * @type {GatewayManager}
      * @name Shard#manager
      */
    Object.defineProperty(this, "manager", { value: manager, writable: false });
    /**
      * Websocket Connection
      * @private
      * @type {Websocket}
      * @name Shard#connection
      */
    Object.defineProperty(this, "connection", { value: null, writable: true });
  }

  /**
    * Sets the shard default properties. Usually used for reconnecting.
    * @returns {void}
    */
  setDefaultProperties () {
    this.sequence = -1;
    this.lastHeartbeatAcked = true;
    this.heartbeatInterval = null;
    this.status = "IDLE";
    this.lastHeartbeatReceived = 0;
    this.lastHeartbeatSent = 0;
  }

  /**
    * Creates a websocket connection for this shard
    * @returns {void}
    */
  connect () {
    /**
      * Status of the shard
      * @type {String}
      */
    this.status = "CONNECTING";
    this.connection = new Websocket(this.manager.websocketURL);

    this.connection.on("message", (message) => this.websocketMessageReceive(message));
    this.connection.on("open", () => this.websocketConnectionOpen());
    this.connection.on("error", (error) => this.websocketError(error));
    this.connection.on("close", (...args) => this.websocketCloseConnection(...args));

    this.connectTimeout = setTimeout(() => {
      if (this.connection.readyState === Websocket.CONNECTING) this.disconnect(true);
    }, this.client.options.connectionTimeout);
  }

  /**
    * Fired when websocket closes the connection
    * @param {Number} code The error code received
    * @param {String} reason Reason for the disconnect
    * @returns {void}
    */
  websocketCloseConnection (code, reason) {
    this.status = "CLOSED";

    this.client.emit("connectionClosed", code, reason, this.id);
    this.disconnect(true);
  }

  /**
    * Fired when occurs an error in the websocket connection.
    * @param {Error} error The error that occurred
    * @returns {void}
    */
  websocketError (error) {
    /**
      * Fired when an error occurs in a shard
      * @event Client#shardError
      * @prop {Error} error The error that occurred
      * @prop {Number} id The ID of the shard
      */
    this.client.emit("shardError", error, this.id);
  }

  /**
    * Fired when websocket receives a message
    * @param {Object} data received from the websocket
    * @returns {void}
    */
  websocketMessageReceive (data) {
    if (data instanceof ArrayBuffer) {
      if (Erlpack) data = Buffer.from(data);
    }

    if (Array.isArray(data)) data = Buffer.concat(data);

    data = Erlpack ? Erlpack.unpack(data) : JSON.parse(data.toString());

    this.packetReceive(data);
  }

  /**
    * Fired when the connection with websocket opens.
    * @returns {void}
    */
  websocketConnectionOpen () {
    this.status = "HANDSHAKING";

    /**
    * Fired when the shard establishes a connection
    * @event Client#connect
    * @prop {Number} id The ID of the shard
    */
    this.client.emit("connect", this.id);
    this.lastHeartbeatAcked = true;
  }

  /**
    * Fired when a packet is received
    * @param {Object} packet The packet received
    * @returns {Function}
    */
  packetReceive (packet) {
    if (packet.s) this.sequence = packet.s;

    switch (packet.t) {
      case "READY": {
        this.sessionId = packet.d.session_id;

        this.status = "READY";

        this.lastHeartbeatAcked = true;
        this.sendHeartbeat();
        break;
      }
    }

    switch (packet.op) {
      case Constants.OP_CODES.EVENT: return this.manager.handlePacket(packet, this);
      case Constants.OP_CODES.HEARTBEAT: return this.sendHeartbeat();
      case Constants.OP_CODES.HEARTBEAT_ACK: {
        this.lastHeartbeatAcked = true;
        this.lastHeartbeatReceived = Date.now();

        break;
      }
      case Constants.OP_CODES.HELLO: {
        if (packet.d?.heartbeat_interval) {
          if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);

          this.heartbeatInterval = setInterval(() => this.sendHeartbeat(), packet.d.heartbeat_interval);
        }

        if (this.connectTimeout) clearTimeout(this.connectTimeout);
        this.connectTimeout = null;

        if (this.sessionId) {
          this.status = "RESUMING";

          this.sendWebsocketMessage({
            op: Constants.OP_CODES.RESUME,
            d: {
              token: this.client.token,
              session_id: this.sessionId,
              seq: this.sequence
            }
          });
        } else {
          this.identify();
          this.sendHeartbeat();
        }
        break;
      }
      case Constants.OP_CODES.RECONNECT: {
        this.client.emit("debug", "Reconnecting due to server request", this.id);
        this.disconnect(true);
        break;
      }
      case Constants.OP_CODES.INVALID_SESSION: {
        this.sessionId = null;
        this.sequence = 0;

        if (packet.d) return this.identify();

        break;
      }
    }
  }

  /**
    * Identify the connection.
    * Required for discord to recognize who is connecting
    * @returns {Object}
    */
  identify () {
    const { client } = this.manager;

    const d = {
      token: client.token,
      intents: client.options.intents,
      shard: [this.id, client.options.shardCount],
      v: client.options.ws.version,
      properties: {
        os: process.platform,
        browser: "hitomi",
        device: "hitomi"
      }
    };

    return this.sendWebsocketMessage({ op: Constants.OP_CODES.IDENTIFY, d });
  }

  /**
    * Send a heartbeat to discord. Required to keep a connection
    * @returns {void}
    */
  sendHeartbeat () {
    if (this.status === "RESUMING") return;

    if (!this.lastHeartbeatAcked) {
      this.client.emit("debug", "Discord didn't acknowledge last heartbeat, trying to reconnect.");

      return this.disconnect(true);
    }

    this.lastHeartbeatAcked = false;
    this.lastHeartbeatSent = Date.now();

    this.sendWebsocketMessage({ op: Constants.OP_CODES.HEARTBEAT, d: this.sequence });
  }

  /**
    * Sends a message to the websocket
    * @param {Object} data Message to send
    * @param {Number} data.op Gateway OP code
    * @param {Object} data.d Data to send
    * @returns {void}
    */
  sendWebsocketMessage (data) {
    const pack = Erlpack ? Erlpack.pack : JSON.stringify;

    if (this.connection.readyState == Websocket.OPEN)
      this.connection.send(pack(data), (error) => {
        if (error) this.client.emit("shardError", error, this.id);
      });
  }

  /**
    * Disconnect the shard
    * @param {Boolean} [reconnect] Whether to reconnect after disconnecting
    * @returns {void}
    */
  disconnect (reconnect = false) {
    if (!this.connection) return;
    if (this.connection.readyState === Websocket.CLOSED) return;

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);

      this.heartbeatInterval = null;
    }

    try {
      this.connection.removeEventListener("close", this.websocketCloseConnection);

      if (reconnect && this.sessionId) {
        if (this.connection.readyState === Websocket.OPEN) {
          this.connection.close(4901, "Reconnecting...");
        }
      } else this.connection.close(1000, "Normal");
    } catch (error) {
      return this.client.emit("shardError", error, this.id);
    }

    this.connection = null;
    this.setDefaultProperties();

    /**
    * Fired when the shard disconnects
    * @event Shard#disconnect
    * @prop {String} reason The reason why the shard disconnected
    */

    this.client.emit("disconnect", "ASKED");

    if (this.reconnectAttempts >= 5) {
      this.client.emit("disconnect", "ATTEMPTS_ULTRAPASSED");
      return null;
    }

    if (reconnect && this.client.options.autoReconnect) {
      if (this.sessionId) this.connect();
      else {
        setTimeout(() => this.connect(), this.reconnectInterval);

        this.reconnectInterval = this.reconnectInterval + 3000;
        this.reconnectAttempts++;
      }
    }
  }
}

module.exports = Shard;
