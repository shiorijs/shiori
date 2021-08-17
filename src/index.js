module.exports = {
  GatewayManager: require("./client/gateway/GatewayManager"),
  Client: require("./client/Client"),

  // Structures
  Guild: require("./structures/Guild"),
  Message: require("./structures/Message"),
  Bucket: require("./rest/Bucket"),

  // Utilities
  Collection: require("./utils/Collection"),
  AsyncQueue: require("./utils/AsyncQueue"),
  Constants: require("./utils/Constants")
};
