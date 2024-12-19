const jwt = require("jsonwebtoken");
// verify token
function verifyToken(req, res, next) {
  const authToken = req.headers.authorization;
  if (authToken) {
    const token = authToken.split(" ")[1];
    try {
      const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedPayload;
      next();
    } catch (error) {
      return res.status(401).json({ message: "invalid token, access denied" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "no token provided, access denied" });
  }
}// تاكد من التوكين و انه أدمن
function verifyTokenandAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
        next();
    } else {
      return res.status(403).json({ message: "the user not admin" });

    }
  });
}
// تاكد من التوكين و أنه صاحب البرووفايل
function verifyTokenandonlyUser(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id == req.params.id) {
        next();
    } else {
      return res.status(403).json({ message: "the not id" });

    }
  });
}
function verifyTokenandAdminorolyuser(req,res,next){
  verifyToken(req,res,()=>{
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({message:"not allownd , only user or admin"})
    }
  })
}
// تاكد من انه دكتور  او أدمن 
function verifyTokenandAdminorolyDoctor(req,res,next){
  verifyToken(req,res,()=>{
    if (req.user.isDoctor || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({message:"not allownd , only Doctor or admin"})
    }
  })
}
module.exports = { verifyToken, verifyTokenandAdminorolyuser,  verifyTokenandAdmin , verifyTokenandonlyUser , verifyTokenandAdminorolyDoctor };
