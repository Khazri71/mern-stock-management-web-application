
import CategoryModel from "../models/Category.js";
import ProductModel from "../models/Product.js";


const addCategory = async (req , res) => {
   
    const {categoryName , categoryDescription} = req.body;

    try{

       const existCategory  = await CategoryModel.findOne({categoryName});
       if(existCategory){
         return res.status(409).json({success:true , message : "Catégrie déjà existe"}  );
       }

       const newCategory = new CategoryModel({
        categoryName,
        categoryDescription
       })

       await newCategory.save()
       return res.status(200).json({success:true , message: "Catégorie ajoutée avec succès" , data : newCategory});

    }catch(error){
       console.log("Erreur de serveur lors d'ajout de catégorie", error)
      return res.status(500).json({success: false , message: "Erreur de serveur"})
    }
}


const getCategories = async (req , res) => {
  
   try{
      const categories = await CategoryModel.find();
      return res.status(200).json({success: true , data:categories});

   }catch(error){
      console.log("Erreur de serveur lors de l'affichage de catégories", error)
      return res.status(500).json({success: false , message: "Erreur de serveur"})
   }
}



const updateCategory = async (req , res) => {

   try{
     const {id} = req.params;
     const {categoryName , categoryDescription} = req.body;

     const existCategory = await CategoryModel.findById(id);

     if(!existCategory){
      return res.status(404).json({success:true , message:"Catégorie introuvable"})
     }

     const updatedCategory = await CategoryModel.findByIdAndUpdate(id , {categoryName , categoryDescription})
     

     return res.status(200).json({success: true , message: "Catégorie modifiée avec succès" , data: updatedCategory})


   }catch(error){
      console.log("Erreur de serveur lors de modification de catégorie" , error);
      return res.status(500).json({success: false , message : "Erreur de serveur"});
   }
}


const deleteCategory = async (req , res) => {
   try{
      const {id} = req.params;

      const productCountWithThisCategory = await ProductModel.countDocuments({productCategoryId : id});
      if(productCountWithThisCategory > 0) {
         return res.status(400).json({success : false , message : "Vous pouvez pas supprimé cette catégorie associée aux produits"});
      }




      const existCategory = await CategoryModel.findById(id);
      if(!existCategory){
         return res.status(404).json({success: true , message: "Catégorie introuvable"})
      }

      await CategoryModel.findByIdAndDelete(id)
      return res.status(200).json({success:true , message: "Catégorie supprimée avec succès"})

   }catch(error){
     console.log("Erreur de serveur lors de suppression de catégorie" , error)
     return res.status(500).json({success: false , message:"Erreur de serveur"})
   }
}



export {addCategory , getCategories , updateCategory , deleteCategory}
