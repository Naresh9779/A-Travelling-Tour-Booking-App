import axios from "axios"

import { showAlert } from "./alert"


export const userData=async(data,type)=>
{
   
    const  url= type==='data'?'/api/v1/users/updateMe':'/api/v1/users/updatePassword'
    try{
        const res=await axios({
            method: 'PATCH',
            url,
            data
            
        })
    
            if(res.data.status==="success")
            {
                showAlert('success',`${type} ! updated successfully`);
                window.setTimeout(()=>{
                    location.reload(true)},2000)
             
    
            }






    }
    catch(err){
  
        showAlert('error',err.response.data.message);
       
}
}