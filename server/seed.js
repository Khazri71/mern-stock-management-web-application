import DBConnect from "./config/dbConn.js";
import UserModel from "./models/User.js";
import bcrypt from "bcrypt"
import dotenv from "dotenv";
dotenv.config();




const register = async () => {
   try{
     DBConnect();
    const hashPassword = await bcrypt.hash("admin" , 10);
    const newUser = new UserModel({
        userName: "admin",
        userEmail: "admin@gmail.com",
        userPassword: hashPassword,
        userAddress: "Tunis, Manouba",
        userRole : "admin"
    })
    await newUser.save();
        console.log("Admin créé avec succés");
   }catch(err){
        console.log(err)
   }
}


register();