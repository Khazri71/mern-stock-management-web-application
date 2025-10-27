import OrderModel from "../models/Order.js";
import ProductModel from "../models/Product.js"



const getDashData = async (req , res) => {

    try{
      const totalProducts = await ProductModel.countDocuments({isDeleted : false});

      const resultStock = await ProductModel.aggregate([
        {$group : {_id : null , totalStock : {$sum :"$productStock"}}}
      ]);
      const totalStock = resultStock[0]?.totalStock || 0;



      const startOfDay = new Date();
      startOfDay.setHours(0 , 0 , 0 , 0);
      const endOfDay = new Date();
      endOfDay.setHours(23 , 59 , 59 , 999);

      const ordersToday = await OrderModel.countDocuments({
        orderDate : {$gte : startOfDay , $lte : endOfDay}
      });


      const resultRevenu = await OrderModel.aggregate([
        {$group : {_id: null , totalRevenu : {$sum : "$orderTotal"}}}
      ]);
      const  totalRevenu = resultRevenu[0]?.totalRevenu || 0;




    const outOfStock = await ProductModel.find({productStock : 0}).select("productName productStock").populate("productCategoryId" , "categoryName");



    const resultHighestSaleProduct = await OrderModel.aggregate([
        {$group : {_id :"$orderProduct" , totalQuantity : {$sum : "$orderQuantity"}}},
        {$sort : {totalQuantity : -1}},
        {$limit : 1},
        {
            $lookup : {
                from : "products",
                localField : "_id",
                foreignField : "_id",
                as : "product"
            }
        },
        {$unwind : "$product"},
        {
            $lookup : {
                from : "categories",
                localField : "product.productCategoryId",
                foreignField : "_id",
                as : "product.productCategoryId"
            }
        },
        { $unwind : "$product.productCategoryId"},
        {
            $project : {
                name : "$product.productName",
                category : "$product.productCategoryId.categoryName",
                totalQuantity : 1
            }
        }

    ]);
    const highestSaleProduct = resultHighestSaleProduct[0] || {message : "Aucune donnée de vente n'est disponible"};

    const lowStock = await ProductModel.find({productStock : {$gt: 0 , $lt: 5}}).select("productName productStock").populate("productCategoryId" , "categoryName");


    const dashboardData = {
         totalProducts,
    totalStock,
    ordersToday ,
    totalRevenu,
    outOfStock ,
    highestSaleProduct ,
    lowStock
    };

    return res.status(200).json({success : true , data : dashboardData});
    


    }catch(error){
     console.error("Erreur de serveur lors de la récupèration des données de tableau de bord" , error);
     return res.status(500).json({success : false , message : "Erreur de serveur"});


    }

}



export {getDashData}