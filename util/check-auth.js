const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { SECRETKEY } = require("../config");

module.exports = (context) => {
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    // Bearer
    const token = authHeader.split("Bearer ")[1];

    if (token) {
      try {
        const user = jwt.verify(token, SECRETKEY);
        return user;
      } catch (error) {
        throw new AuthenticationError("Invalid/Expired token");
      }
    }
    throw new Error("Auth token must be formatted correctly");
  }
  throw new Error("Authentication header must be provided");
};
