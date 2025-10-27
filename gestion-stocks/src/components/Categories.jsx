import axios from "axios";
import  {useEffect , useState } from "react";
import { IoSearch } from "react-icons/io5";


export const Categories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  const [categories , setCategories] = useState([]);
  

  const [editCategory , setEditCategory] = useState(null);
  const [filtredCategories , setFiltredCategories] = useState(categories);
  const [isLoading , setIsLoading] = useState(true);










  const handleSubmitCategory = async (e) => {
    e.preventDefault();

    // Modifier Categorie par id
    if (editCategory) {
      console.log("Id Catégorie" , editCategory)

      try{
        
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/category/${editCategory}`,
        { categoryName, categoryDescription },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("info-token")}`,
          },
        }
      );
      const data = await response.data;

      if (data.success) {
        alert(data.message);
        setEditCategory(null);
        handleGetCategories();
        handleCancel();

      } else {
        alert(data.message);
      }

      }catch(error){
        console.error("Erreur de serevur : " , error);
      } 



    } else {
      // Ajouter Categorie
     try{
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/category/add`,
        { categoryName, categoryDescription },
        {
          headers: {
            Authorization: `Barear ${localStorage.getItem("info-token")}`,
          },
        }
      );

      const data = await response.data;

      if (data.success) {
        setCategoryName("");
        setCategoryDescription("");
        alert(data.message)
        handleGetCategories();
      } else {
        alert(data.message);
      }


     }catch(error){
         console.log("Erreur de serveur : " , error);
     }
    
    };
 }

  const handleGetCategories = async () => {
  
    try{
      setIsLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/category` , 
      {
        headers : {
          Authorization: `Bearer ${localStorage.getItem("info-token")}`,
        }
      });

      const data = await response.data;
      if (data.success){
         setIsLoading(false);
        setCategories(data.data)
        setFiltredCategories(data.data)
        console.log(data)
      }else{
         setIsLoading(false)
         console.error(data.message);
      }

    }catch(error){
      console.error("Erreur de serveur : " , error);

    }



   
   
  }


  useEffect(() => {
   handleGetCategories()
  }, [])





  const handleEditCategory = async (category) => {
    console.log(category)
    setEditCategory(category._id)
    setCategoryName(category.categoryName)
    setCategoryDescription(category.categoryDescription)
  }


  const handleCancel = async () => {
    setEditCategory(null);
    setCategoryName("");
    setCategoryDescription("");
  };
 

  const handleDeleteCategory = async (id) => {


    try{

      const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?");
    console.log(confirmDelete)
    if(confirmDelete){
        const response = await axios.delete(`http://localhost:3001/api/category/${id}` , 
          {
            headers : {
              Authorization : `Bearer ${localStorage.getItem("info-token")}`,
            }
          }
        );
    
        if(response.data.success){
          console.log("Catégorie supprimée avec succès");
          handleGetCategories();
        }else{
         console.error("Erreur de suppression de catégorie", response.data.message);
      }
    }
      
    }catch(error){
      if(error.response){
        alert(error.response.data.message);
      }else{
         alert("Erreur de serveur : " , error);
      }
     

    }
    
  }
  

  const handleSearchCategoriesByName = (e) => {
      setFiltredCategories(
        categories.filter((category) => category.categoryName.toLowerCase().includes(e.target.value) )
      )
  }


  if(isLoading) return <div>chargement...</div>

  return (
    <>
      <h1 className="ms-5 text-2xl font-bold my-5">
        Gestion des catégories
      </h1>


   
          <div className="ml-5 bg-white w-2/6 px-2 py-1 rounded-lg border border-gray-300 flex items-center ">
       <input type="text"  placeholder="Chercher catégorie par nom ..."   className="focus:outline-none w-full " 
        onChange={handleSearchCategoriesByName}
       /> <IoSearch />
     </div>



      <div className=" flex flex-col lg:flex-row">
        <div className="bg-white m-5 p-4  rounded-lg lg:w-1/3">
        <h2 className=" text-lg font-bold mb-3">{editCategory ? "Modifier Catégorie" : "Ajouter Catégorie"}</h2>
          <form onSubmit={handleSubmitCategory} className="flex flex-col space-y-4 ">
            <div>
              <div className="mb-4">
                <label
                  htmlFor="nameCat"
                  className="block text-sm/6 font-medium "
                >
                  Nom Catégorie
                </label>
                <div className="mt-2">
                  <input
                    id="nameCat"
                    type="text"
                    placeholder="Entrer le nom de la catégorie"
                    required
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 border  border-black"
                    onChange={(e) => setCategoryName(e.target.value)}
                    value={categoryName}
                  />
                </div>
              </div>

              <div className="flex flex-col mb-4">
                <label
                  htmlFor="descCat"
                  className="block text-sm/6 font-medium mb-2"
                >
                  Description Catégorie
                </label>
                <textarea
                  id="descCat"
                  cols="35"
                  rows="4"
                  placeholder="Entrer la description de la catégorie"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 border  border-black"
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  value={categoryDescription}

                ></textarea>
              </div>
              <div className="flex ">

                 <button
                type="submit"
                className = {`${editCategory ?  "bg-blue-700 hover:bg-blue-600 block w-[50%] w-full" : "bg-violet-700 hover:bg-violet-600 w-full" }  cursor-pointer block text-sm/6 font-medium  text-white py-2 px-3 rounded-lg mr-2 `}>
                {editCategory ? "Modifier Catégorie" : "Ajouter Catégorie"}
              </button>


              { editCategory && (
                 <button
                type="submit"
                className="cursor-pointer block  text-sm/6 font-medium bg-red-700 hover:bg-red-600  text-white py-2 px-3 rounded-lg "
                onClick={handleCancel}
              >
               Annuler
              </button>
              )


              }


              </div>




            </div>
          </form>
        </div>

        {/* ---------- */}
     


        <div className="bg-white m-5 p-4 w-full rounded-lg  lg:w-2/3">
          <table className="w-full border border-violet-100" >
            <thead>
              <tr className="bg-violet-100">
                <th className="px-4 py-3 font-bold text-sm/6 text-center">S. No</th>
                <th   className="px-4 py-3 font-bold text-sm/6  text-center">Nom catégorie</th>
                <th  className="px-4 py-3 font-bold text-sm/6  text-center" >Description catégorie</th>
                <th   className="px-4 py-3 font-bold text-sm/6  text-center">Action</th>
              </tr>
            </thead>
            <tbody>

              {filtredCategories && filtredCategories.map((category , index) => (

              <tr key={index}>
                <td   className="px-4 py-3 font-bold text-sm/6 text-center">{index + 1}</td>
                <td   className="px-4 py-3 text-sm/6 text-center">{category.categoryName}</td>
                <td   className="px-4 py-3 text-sm/6 text-center">{category.categoryDescription}</td>
                <td   className="px-4 py-3 text-sm/6 flex flex-row justify-center items-center">
                   <button
                className="cursor-pointer block text-sm/6 font-medium bg-blue-700 hover:bg-blue-600 text-white py-2 px-3 rounded-lg mr-2"
                onClick={() => handleEditCategory(category)} 
              >
                Modifier
              </button>

               <button
                className="cursor-pointer block text-sm/6 font-medium bg-pink-700 hover:bg-pink-600 text-white py-2 px-3 rounded-lg "
        
              onClick={() => handleDeleteCategory(category._id)}
              >
                Supprimer
              </button>

                </td>
              </tr>

              ))}

            
           
             

            
           
            </tbody>
          </table>
           {filtredCategories.length === 0 && <p className="text-center mt-3 text-base text-black">Aucune catégorie trouvée </p>}
        </div>
        {/* ---------- */}
      </div>
    </>
  );
};
