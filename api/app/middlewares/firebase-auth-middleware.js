const admin = require("../utils/firebaseConfig");

class FirebaseAuthMiddleware{
  async decodeToken(req, res, next){
    const authToken = req.headers.authorization;
    try{
      const token = authToken.split(" ")[1];
      const decodeValue = await admin.auth().verifyIdToken(token);
      if( decodeValue) {
        return next();
      }
      return res.status(500).json({
        status: "error",
        message: "Invalid token",
      });
    }
    catch(e) {
      return res.status(500).json({
        status: "error",
        message: "Internal Error",
      });
    }
    
  }
}

module.exports = new FirebaseAuthMiddleware();