const EventEmitter = require("../../utils/EventEmitter");
const WebSocket = require("ws");

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
      * @type {number}
      */
    this.id = id;

    /**
      * Session ID of the current shard connection
      * @type {string}
      */
    this.sessionId = null;

    /**
      * Interval in ms for reconnect time
      * @type {number}
      */
    this.reconnectInterval = 3000;

    /**
      * Current attempts of reconnecting
      * @type {number}
      */
    this.reconnectAttempts = 0;

    /**
      * The current sequence of this shard
      * @type {number}
      */
    this.sequence = -1;

    this.setDefaultProperties();
    /**
      * Shiori Client
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
      * @type {WebSocket}
      * @name Shard#connection
      */
    Object.defineProperty(this, "connection", { value: null, writable: true });
  }

  /**
    * Sets the shard default properties. Usually used for reconnecting.
    * @returns {void}
    */
  setDefaultProperties () {
    this.lastHeartbeatAcked = true;
    this.heartbeatInterval = null;
    /**
      * Status of the shard
      * @type {string}
      */
    this.status = "IDLE";
    this.lastHeartbeatReceived = 0;
    this.lastHeartbeatSent = 0;
    this._totalGuilds = 0;
    this._guildsLoaded = 0;
    this._guildQueueTimeout = undefined;
  }

  /**
    * Creates a websocket connection for this shard
    * @returns {void}
    */
  connect () {
    this.connection = new WebSocket(this.manager.websocketURL);

    this.connection.onmessage = this.#websocketMessageReceive.bind(this);
    this.connection.onopen = this.#websocketConnectionOpen.bind(this);
    this.connection.onerror = this.#websocketError.bind(this);
    this.connection.onclose = this.#websocketCloseConnection.bind(this);

    this.connectTimeout = setTimeout(() => {
      if (this.connection.readyState === WebSocket.CONNECTING) this.disconnect(true);
    }, this.client.options.connectionTimeout);
  }

  /**
    * Fired when websocket closes the connection
    * @param {number} code The error code received
    * @param {string} reason Reason for the disconnect
    * @returns {void}
    */
  #websocketCloseConnection ({ code } = {}) {
    if (code === 1000) return;

    const GatewayError = Constants.GatewayErrors;

    switch (code) {
      case GatewayError.UNKNOWN: {
        this.client.emit("shardError", "Websocket Connection closed with an unknown reason. Reconnecting...", this.id);
        this.disconnect(true);
        break;
      }
      case GatewayError.AUTHENTICATION_FAILED: {
        throw new Error("Authentication failed. A invalid token was provided.");
      }
      case GatewayError.DISALLOWED_INTENT: {
        throw new Error("A disallowed intent was provided, you may have specified an intent that you do not have access to.");
      }
      case GatewayError.INVALID_INTENT: {
        throw new Error(`A invalid intent was provided. Provided intents: ${this.client.options.intents}`);
      }
      case GatewayError.TIMED_OUT: {
        this.client.emit("shardError", "Discord asked for us to reconnect. At your service discord!", this.id);
        this.disconnect(true);
        break;
      }
      case GatewayError.INVALID_SEQUENCE: {
        this.client.emit("shardError", "Discord invalidated our last sequence. Reconnecting...", this.id);
        this.disconnect(true);
        break;
      }
      default: {
        this.client.emit("shardError", `Unknown Gateway Error: ${code} Closing connection...`, this.id);
        break;
      }
    }
  }

  isReady () {
    if (this._remainingGuilds === undefined) return;
    if (this._guildQueueTimeout !== undefined) clearTimeout(this._guildQueueTimeout);

    const emitReady = () => {
      this._remainingGuilds = undefined;
      this._guildQueueTimeout = undefined;

      this.client.emit("ready");
    };

    if (this._remainingGuilds === 0) emitReady();
    else {
      this._guildQueueTimeout = setTimeout(emitReady, 15000);
    }
  }

  /**
    * Fired when occurs an error in the websocket connection.
    * @param {object} event The error that occurred
    * @returns {void}
    */
  #websocketError (event) {
    const error = new Error({
      message: event.message,
      error: event.error,
      type: event.type,
      target: event.target
    });

    /**
      * Fired when an error occurs in a shard
      * @event Client#shardError
      * @prop {Error} error The error that occurred
      * @prop {number} id The ID of the shard
      */
    this.client.emit("shardError", error, this.id);
  }

  /**
    * Fired when websocket receives a message
    * @param {object} data received from the websocket
    * @returns {void}
    */
  #websocketMessageReceive (event) {
    let data = event.data;

    if (data instanceof ArrayBuffer) {
      if (Erlpack) data = Buffer.from(data);
    }

    if (Array.isArray(data)) data = Buffer.concat(data);

    data = Erlpack ? Erlpack.unpack(data) : JSON.parse(data);

    this.packetReceive(data);
  }

  /**
    * Fired when the connection with websocket opens.
    * @returns {void}
    */
  #websocketConnectionOpen () {
    /**
    * Fired when the shard establishes a connection
    * @event Client#connect
    * @prop {number} id The ID of the shard
    */
    this.client.emit("connect", this.id);
    this.lastHeartbeatAcked = true;
  }

  /**
    * Fired when a packet is received
    * @param {object} packet The packet received
    * @returns {Function}
    */
  packetReceive (packet) {
    if (packet.s) this.sequence = packet.s;

    switch (packet.t) {
      case "READY": {
        this.sessionId = packet.d.session_id;
        this.emit("ready");

        const percent = (((this.id + 1) / this.client.options.shardCount) * 100).toFixed(1);
        this.client.debug(`Shard ${this.id} connected! (${percent}%)`, `SHARD: ${this.id}`);

        this.lastHeartbeatAcked = true;
        this.#sendHeartbeat();
        break;
      }
    }

    switch (packet.op) {
      case Constants.OP_CODES.EVENT: return this.manager.handlePacket(packet, this);
      case Constants.OP_CODES.HEARTBEAT: return this.#sendHeartbeat();
      case Constants.OP_CODES.HEARTBEAT_ACK: {
        this.lastHeartbeatAcked = true;
        this.lastHeartbeatReceived = Date.now();
        this.latency = this.lastHeartbeatReceived - this.lastHeartbeatSent;

        break;
      }
      case Constants.OP_CODES.HELLO: {
        if (packet.d?.heartbeat_interval) {
          if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);

          this.heartbeatInterval = setInterval(() => {
            this.#sendHeartbeat();
          }, packet.d.heartbeat_interval);
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
          this.#identify();
          this.#sendHeartbeat();
        }
        break;
      }
      case Constants.OP_CODES.RECONNECT: {
        this.client.emit("Reconnecting due to server request", `SHARD:${this.id}`);
        this.disconnect(true);
        break;
      }
      case Constants.OP_CODES.INVALID_SESSION: {
        this.sessionId = null;
        this.sequence = 0;

        if (packet.d) return this.#identify();

        break;
      }
    }
  }

  /**
    * Identify the connection.
    * Required for discord to recognize who is connecting
    * @returns {void}
    */
  #identify () {
    const shardCount = this.client.options.shardCount;

    const d = {
      token: this.client.token,
      intents: this.client.options.intents,
      shard: [this.id, shardCount],
      properties: {
        $os: process.platform,
        $browser: "shiori",
        $device: "shiori"
      }
    };

    return this.sendWebsocketMessage({ op: Constants.OP_CODES.IDENTIFY, d });
  }

  /**
    * Send a heartbeat to discord. Required to keep a connection
    * @returns {void}
    */
  #sendHeartbeat () {
    if (this.status === "RESUMING") return;

    if (!this.lastHeartbeatAcked) {
      this.client.debug("Discord didn't acknowledge last heartbeat, trying to reconnect.", `SHARD: ${this.id} - HEARTBEAT`);

      return this.disconnect(true);
    }

    this.lastHeartbeatAcked = false;
    this.lastHeartbeatSent = Date.now();

    if (this.lastHeartbeatReceived) {
      this.client.debug([
        `Sending a heartbeat, enjoy it discord!`,
        `Last latency: ${this.lastHeartbeatSent - this.lastHeartbeatReceived}ms`
      ], `SHARD: ${this.id} - HEARTBEAT`);
    }

    this.sendWebsocketMessage({ op: Constants.OP_CODES.HEARTBEAT, d: this.sequence });
  }

  /**
    * Sends a message to the websocket
    * @param {object} data Message to send
    * @param {number} data.op Gateway OP code
    * @param {object} data.d Data to send
    * @returns {void}
    */
  sendWebsocketMessage (data) {
    const pack = Erlpack ? Erlpack.pack : JSON.stringify;

    if (this.connection.readyState == WebSocket.OPEN)
      this.connection.send(pack(data), (error) => {
        if (error) this.client.emit("shardError", error, this.id);
      });
  }

  /**
    * Disconnect the shard
    * @param {boolean} [reconnect] Whether to reconnect after disconnecting
    * @returns {void}
    */
  disconnect (reconnect = false) {
    if (!this.connection) return;
    if (this.connection.readyState === WebSocket.CLOSED) return;

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);

      this.heartbeatInterval = null;
    }

    try {
      this.connection.close(1000, "reconnect");
    } catch (error) {
      return this.client.emit("shardError", error, this.id);
    }

    if (reconnect === false) this.setDefaultProperties();

    /**
      * Fired when this shard disconnects
      * @event Shard#disconnect
      * @prop {string} reason The reason why this shard disconnected
      */
    this.emit("disconnect", "ASKED");

    if (this.reconnectAttempts >= 5) {
      return this.emit("disconnect", "ATTEMPTS_ULTRAPASSED");
    }

    if (reconnect === true) {
      setTimeout(() => this.connect(), this.reconnectInterval);

      this.reconnectInterval = this.reconnectInterval + 3000;
      this.reconnectAttempts++;
    }
  }
}

module.exports = Shard;
