import axios from 'axios';
import { showAlert } from './alert';

export const login=async(email,password) => {
 try {const url='http://127.0.0.1:3000/api/v1/users/login'
    
    const res=await axios({

    
        method: 'POST',
        url,
       data:{email,password}
    })

        if(res.data.status==="success")
        {
            showAlert('success',"Loged In Successfully");
            window.setTimeout(()=>{
                location.assign('/')
            },1000)

        }

    }
    catch(err)
    {
        showAlert('error',err.response.data.message);
    }
}

export const logout=async()=>{
    try { const res=await axios({
        method: 'GET',
        url:'http://127.0.0.1:3000/api/v1/users/logout',
        
    })

        if(res.data.status==="success")
        {
            showAlert('success',"Logged Out Successfully");
            window.setTimeout(()=>{
                location.assign('/')
        },1000)

        }

    }
    catch(err)
    {
        showAlert('error','Error in Logging Out ! Try Again');
    }
    

}
export const signup = async(name,email,password,passwordConfirm) =>{
    try {const url='http://127.0.0.1:3000/api/v1/users/signup'
    
    const res=await axios({

    
        method: 'POST',
        url,
       data:{
        name,email,password,passwordConfirm
       }
    })

        if(res.data.status==="success")
        {
            showAlert('success',"Registered In Successfully");
            window.setTimeout(()=>{
                location.assign('/')
            },1000)

        }

    }
    catch(err)
    {
        showAlert('error',err.response.data.message);
    }
}


