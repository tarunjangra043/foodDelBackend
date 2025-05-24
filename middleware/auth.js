const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login Again",
      });
    }

    const token = authHeader.split(" ")[1];

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: tokenDecode.id };

    next();
  } catch (e) {
    console.error("JWT Verification Error:", e.message);

    if (e.name === "TokenExpiredError") {
      return res.status(403).json({
        success: false,
        message: "Token Expired. Please Login Again",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Invalid Token. Please Login Again",
      });
    }
  }
};

module.exports = { authMiddleware };
