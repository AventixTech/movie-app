// const jwt = require("jsonwebtoken");

// function auth(req, res, next) {
//   const authHeader = req.headers["authorization"] || req.headers["Authorization"];
//    console.log("Auth header from request:", authHeader); 
//   if (!authHeader) {
//     return res.status(401).json({ error: "No token, authorization denied" });
//   }

//   const token = authHeader.replace("Bearer ", "");
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Token is not valid" });
//   }
// }

// module.exports = auth;const jwt = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("AUTH HEADER 👉", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED TOKEN 👉", decoded);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      isAdmin: decoded.isAdmin,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = auth;
