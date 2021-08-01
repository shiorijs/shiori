const EventEmitter = require("events");
const Websocket = require("ws");
const Erlpack = require("erlpack");

const Constants = require("../../utils/Constants")

module.exports = class Shard extends EventEmitter {
  constructor (manager, id) {
    super();

    this.id = id;

    this.sequence = -1;
    this.sessionId = null;
    this.lastHeartbeatAcked = true;
    this.heartbeatInterval = null;
    this.reconnectInterval = 3000;
    this.reconnectAttempts = 0;

    this.status = "IDLE";

    Object.defineProperty(this, 'manager', { value: manager, writable: false });
    Object.defineProperty(this, 'connection', { value: null, writable: true });
  }

  async connect() {
    this.connection = new Websocket(this.manager.websocketURL, { perMessageDeflate: false })

    this.status = "CONNECTED";

    this.connection.on("message", (data) => this.websocketMessageReceive(data));
    this.connection.on("open", () => this.websocketConnectionOpen());
    this.connection.on("error", (error) => websocketError(error));
    this.connection.on("close", (...args) => this.websocketCloseConnection(...args));
  }

  async websocketCloseConnection(code, reason) {
    this.status = "CLOSED";

    this.emit("connectionClosed", code, reason, this.id);
    this.disconnect();
  }

  async websocketError(error) {
    /**
    * Fired when an error occurs in a shard
    * @event Client#shardError
    * @prop {Error} error The error that occurred
    * @prop {Number} id The ID of the shard
    */
    this.manager.client.emit("shardError", error, this.id);
  }

  async websocketMessageReceive(data) {
    data = Erlpack.unpack(data);

    this.packetReceive(data);
  }

  async websocketConnectionOpen() {
    this.status = "OPEN";

    /**
    * Fired when the shard establishes a connection
    * @event Shard#connect
    * @prop {Number} id The ID of the shard
    */
    this.emit("connect", this.id);
    this.lastHeartbeatAck = true;
  }

  async packetReceive(packet) {
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
      case Constants.OP_CODES.EVENT: {
        return this.manager.handlePacket(packet);
      }
      case Constants.OP_CODES.HEARTBEAT: {
        return this.sendHeartbeat();
      }
      case Constants.OP_CODES.HEARTBEAT_ACK: {
        this.lastHeartbeatAck = true;
        this.lastHeartbeatReceived = Date.now();

        break;
      }
      case Constants.OP_CODES.HELLO: {
        if (packet.d?.heartbeat_interval) {
          if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);

          this.heartbeatInterval = setInterval(() => this.sendHeartbeat(), packet.d.heartbeat_interval);
        }

        if (this.sessionId) {
          this.sendWebsocketMessage({
            op: Constants.OP_CODES.RESUME,
            d: {
              token: this.manager.client.token,
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
      case Constants.OP_CODES.INVALID_SESSION: {
        this.sessionId = null;
        this.sequence = 0;

        if (packet.d) return this.identify();

        break;
      }
    }
  }

  async identify() {
    const { client } = this.manager;

    const d = {
      token: client.token,
      intents: client.options.intents,
      shard: [this.id, client.options.shardCount],
      v: 9,
      properties: {
        os: process.platform,
        browser: "hitomi",
        device: "hitomi"
      }
    };

    return this.sendWebsocketMessage({ op: Constants.OP_CODES.IDENTIFY, d });
  }

  sendHeartbeat() {
    this.lastHeartbeatAcked = false;

    this.sendWebsocketMessage({ op: Constants.OP_CODES.HEARTBEAT, d: this.sequence });
  }

  sendWebsocketMessage(data) {
    if (this.status !== "CLOSED") this.connection.send(Erlpack.pack(data), (error) => {
      this.manager.client.emit("shardError", error, this.id);
    });
  }

  disconnect(options = {}, error) {
    if (!this.connection) return;

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);

      this.heartbeatInterval = null;
    }

    try {
      this.connection.terminate();
    } catch (error) {
      this.manager.client.emit("shardError", error, this.id);
      this.manager.client.emit("shardError", error, this.id);
    }

    this.connection = null;

    /**
    * Fired when the shard disconnects
    * @event Shard#disconnect
    * @prop {Error?} error The error that occurred
    */
    this.emit("disconnect", error);

    if (this.sessionId) this.sessionId = null;
    if (this.manager.client.options.autoReconnect) {
      if (this.reconnectAttempts) {
        return this.emit("disconnect", "Too many attempts");
      }

      setTimeout(() => {
        this.manager.createShardConnection();
      }, this.reconnectInterval)

      this.reconnectInterval = this.reconnectInterval + 3000;
    }
  }
}
