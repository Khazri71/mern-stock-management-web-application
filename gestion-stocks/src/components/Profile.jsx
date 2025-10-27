import axios from 'axios';
import { useEffect, useState } from 'react'

export const Profile = () => {




const [user , setUser] = useState({
  name : "",
  email : "",
  address : "",
  password :""
});



const [edit , setEdit] =  useState(false);




const handleGetUser = async () => {
  try{
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/profile` , {
      headers : {
        Authorization : `Bearer ${localStorage.getItem("info-token")}`,
      }
    });
  
    const data = response.data;
    if(data.success){
     
         setUser({
           name : data.data.userName,
           email : data.data.userEmail,
           address : data.data.userAddress,
         })
    }else{
         console.log(data.message);
    }

  }catch(error) {
    console.error("Erreur de serveur" , error);

  }
}


useEffect(() => {
   handleGetUser();

},[])


const handleChangeUser = (e) => {
  const {name , value}= e.target;
  setUser((prev) => ({
    ...prev ,
    [name] : value
  }));
  console.log(user);
}


const handleEditUser = (e) => {
   e.preventDefault()
    setEdit(!edit)
}


const handleSubmitUpdateUser = async (e) => {
    e.preventDefault();
  try{
    
    const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/user/update` , user , 
      {
        headers : {
          Authorization : `Bearer ${localStorage.getItem("info-token")}`, 
        }
        }
      
    );
    const data = response.data;
    if(data.success){
      alert(data.message)
      setEdit(false);
      console.log(data.message , data.updatedUser);
    }else{
      alert(data.message)
    }

  }catch(error){
    console.error("Erreur de serveur : " , error);
  }
}

  return (
    <>
          <h1 className="ms-5 text-2xl font-bold my-5">
       Mon Profil
      </h1>
      <div className=" flex flex-col lg:flex-row  justify-center items-center">
        <div className="bg-white m-5 p-4  rounded-lg lg:w-1/3">
       
          <form 
          onSubmit={handleSubmitUpdateUser} 
          className="flex flex-col space-y-4 ">
            <div>
              <div className="mb-4">
                <label
                  htmlFor="namePro"
                  className="block text-sm/6 font-medium "
                >
                  Nom 
                </label>
                <div className="mt-2">
                  <input
                    id="namePro"
                    type="text"
                    placeholder="Nom utilisateur"
                    required
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 border  border-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                    onChange={handleChangeUser}
                    name = "name"
                    value={user.name}
                    disabled = {!edit} 
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="emailPro"
                  className="block text-sm/6 font-medium "
                >
                  Email 
                </label>
                <div className="mt-2">
                  <input
                    id="emailPro"
                    type="text"
                    placeholder="Email utilisateur"
                    required
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 border  border-black-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                     onChange={handleChangeUser}
                     name = "email"
                    value={user.email}
                     disabled = {!edit} 
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="addrPro"
                  className="block text-sm/6 font-medium "
                >
                  Adresse 
                </label>
                <div className="mt-2">
                  <input
                    id="addrPro"
                    type="text"
                    placeholder="Adresse utilisateur"
                    required
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 border  border-black-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                   onChange={handleChangeUser}
                   name = "address"
                    value={user.address}
                     disabled = {!edit} 
                  />
                </div>
              </div>

              {edit && (
                
              <div className="mb-4">
                <label
                  htmlFor="passPro"
                  className="block text-sm/6 font-medium "
                >
                  Mot de passe  
                </label>
                <div className="mt-2">
                  <input
                    id="passPro"
                    type="password"
                    placeholder="Entrer nouveau mot de passe (option)"
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 border  border-black-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
                   onChange={handleChangeUser}
                    name="password"
                     disabled = {!edit} 
                  />
                </div>
              </div>

              )}


              <div className="flex ">
                {!edit ? ( 
                <button
                type="submit"
                className="cursor-pointer block text-sm/6 font-medium bg-blue-700 hover:bg-blue-600 text-white py-2 px-3 rounded-lg mr-2 w-full"
                onClick={handleEditUser}
              
              >
                Modifier
              </button>
              ) : (
                <>
                <button
                className="cursor-pointer block text-sm/6 font-medium bg-green-700 hover:bg-green-600 text-white py-2 px-3 rounded-lg mr-2 w-full"
              >
                Conserver 
              </button>

              <button
                className="cursor-pointer block text-sm/6 font-medium bg-red-700 hover:bg-red-600 text-white py-2 px-3 rounded-lg mr-2 w-full"
              onClick={() => setEdit(false)}
              
              >
                Annuler 
              </button>
                  </>
               )}
             

              </div>




            </div>
          </form>
        </div>

  </div>
    
    </>
)

}