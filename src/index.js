module.exports = (token, options) => {
  return (new require("./client/Client"))(token, options);
};

module.exports = {
  Collection: require("./utils/Collection"),
  GatewayManager: require("./client/gateway/GatewayManager"),
  Client: require("./client/Client"),
  Constants: require("./utils/Constants"),

  // Structures
  Guild: require("./structures/Guild"),
  Message: require("./structures/Message")
};
