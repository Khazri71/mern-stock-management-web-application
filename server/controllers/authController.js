import DBConnect from "../config/dbConn.js";
import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"




const login = async  (req , res) => {
    try{
        const {userEmail , userPassword} = req.body;
        DBConnect
        const user = await UserModel.findOne({userEmail})
        if(!user){
            return res.status(404).json({success: false , message: "Compte n'existe pas"})
        }

        const ispass = await bcrypt.compare(userPassword , user.userPassword);
        if(!ispass){
            return res.status(401).json({success: false , message : "Mot de passe incorrecte"})
        }

        const token = jwt.sign({id: user._id , role: user.userRole}, process.env.JWT_SECRET , {expiresIn: "2d"} )
        return res.status(200).json({success: true , message: "Connexion réussie avec succès", token , user: {id: user._id , userName:user.userName, userEmail:user.userEmail, userRole: user.userRole}});


    }catch(err){
         return res.status(500).json({success: false , message: "Erreur interne du serveur" })
    }

}


export {login}