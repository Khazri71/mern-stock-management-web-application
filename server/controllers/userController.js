
import UserModel from "../models/User.js";
import bcrypt, { hash } from "bcrypt";




const addUser = async (req , res) => {

    try{
        const {userName, userEmail, userPassword ,userAddress ,userRole} = req.body;

        const existUser = await UserModel.findOne({userEmail});
        if(existUser){
            return res.status(409).json({success:true , message: "Utilisateur déjà existe"});
        }


        const hashedPassword = await bcrypt.hash(userPassword, 10);

        const newUser =  new UserModel({
             userName,
             userEmail,
             userPassword : hashedPassword ,
             userAddress,
             userRole
        })

        await newUser.save();
        return res.status(200).json({success:true , message: "Utilisateur ajouté avec succès" , data : newUser});

    }catch(error){
        console.log("Erreur de serveur lors de l'ajout d'utilisateur" , error);
        return res.status(500).json({success : false , message : "Erreur de serveur"});
    }

}


const getUsers = async (req , res) => {
  try{
   const users = await UserModel.find();
   return res.status(200).json({success:true , data: users});

  }catch(error){
   console.log("Erreur de serveur lors de l'affichage des utilisateurs" , error);
   return res.status(500).json({success :false ,  message : "Erreur de serveur"});
  }
}



const deleteUser = async (req , res) => {
    try{
        const {id} = req.params ;
        const existUser = await UserModel.findById(id);
        if(!existUser){
            return res.status(404).json({success : true , message : "Utilisateur introuvable"});
        }
        await UserModel.findByIdAndDelete(id);
        return res.status(200).json({success:200 , message : "Utilisateur supprimé avec succès"});

    }catch(error){
        console.log("Erreur de serveur lors de la suppression" , error);
        return res.status(500).json({success: false , message : "Erreur de serveur"});

    }
}



const getUser = async (req , res) => {
    try{
     const userId = req.user.id;
     const userProfile = await UserModel.findById({_id : userId});

     return res.status(200).json({success : true , data : userProfile});
    }catch(error){
      console.error("Erreur de serveur lors de l'affichage d'un utilisateur" , error);
      return res.status(500).json({success : false , message: "Erreur de serveur"});
    }
}


const updateUser = async (req , res) => {
    try{
        const userId = req.user.id;
        const {name , email , address , password} = req.body;
        const updatedData = {userName : name , userEmail : email , userAddress : address };

        if(password && password.trim() !== ""){
            const hashedPassword = await bcrypt.hash(password , 10);
            updatedData.userPassword= hashedPassword;
        }
        const existUser = await UserModel.findOne({_id : userId});
        if(!existUser){
            return res.status(404).json({success:true , message:"Utilisateur introuvable"});
        }

        const updatedUser = await UserModel.findByIdAndUpdate(userId , updatedData ,  { new: true } ).select("-userPassword");
        return res.status(200).json({success : true , message : "Utilisateur modifier avec succès" , data : updatedUser})
    }catch(error){
        console.error("Erreur serveur lors de la modification d'utilisateur" , error);
        return res.status(500).json({success : false , message : "Erreur de serveur"})

    }
}

export {addUser , getUsers , deleteUser , getUser , updateUser}