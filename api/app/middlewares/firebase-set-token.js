const admin = require("../utils/firebaseConfig");

const firebaseSetToken = async(req, res, next) =>{
  const authToken = req.headers.authorization;
  let finalToken = ''
  try{
    const token = authToken.split(" ")[1];
    const decodeValue = await admin.auth().verifyIdToken(token);
    if( decodeValue) {
      /* console.log("decodeValue.uid", decodeValue.uid) */
      finalToken = token;
    }
  } catch(e) {
    /* console.log("no token available") */
  }
  req.userToken = finalToken;
  next();
}

module.exports = firebaseSetToken;
