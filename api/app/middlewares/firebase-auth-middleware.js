const admin = require("../utils/firebaseConfig");

class FirebaseAuthMiddleware{
  async decodeToken(req, res, next){
    const authToken = req.headers.authorization;
    try{
      const token = authToken.split(" ")[1];
      await admin.auth().verifyIdToken(token)
        .then(response => {
          return next();
        })
        .catch(error => {
          return res.status(401).json({
            status: "error",
            message: "Invalid token",
          }); 
        })
      
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