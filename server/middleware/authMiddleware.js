// import jwt, { decode } from "jsonwebtoken";
// import UserModel from "../models/User.js";

// const authMiddleware = async (req , res ,next) => {
//     try{
 
//     const token = req.headers.authorization.split(" ")[1];
//     if(!token){
//         return res.status(401).json({success : false , message : "Token non fourni"});
//     }

//     const decoded = jwt.verify(token , process.env.JWT_SECRET);
//     if(!decoded){
//         return res.status(401).json({success : false , message : "Token invalide"});
//     }

//     const user = await UserModel.findById({_id : decoded.id});
//     if(!user){
//         return res.status(401).json({success : false , message : "Utilisateur introuvable"});
//     }
    
//     req.user = user;
//     next(); // passer à la route suivante


//     }catch(error){
//         console.error("Erreur dans authMiddleware" , error);
//         return res.status(401).json({succes : false , message : "Erreur interne dans middleware"});

//     }
// }

// export default authMiddleware;

import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({success: false, message: "Token non fourni"});
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({success: false, message: "Token manquant"});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({success: false, message: "Token invalide"});
    }

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({success: false, message: "Utilisateur introuvable"});
    }

    req.user = user;
    next(); // passer à la route suivante

  } catch (error) {
    console.error("Erreur dans authMiddleware:", error.message);
    return res.status(500).json({success: false, message: "Erreur interne dans middleware"});
  }
};

export default authMiddleware;
