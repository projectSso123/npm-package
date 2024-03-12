import react, { useEffect, useState } from "react";
import './app.css'

export default function SsoAuth({client_id,client_secret}){
  return(
    
  <>
   <div>

   <SsoLoginButton client_id={client_id} client_secret={client_secret}></SsoLoginButton>

   </div>
  </>
  )

}
function SsoLoginButton({client_id,client_secret}){
  const [logged , setlogged] = useState(false);
  const [message , setMessage] = useState("")
   useEffect(()=>{
  
    const params = new URLSearchParams(window.location.search);
    const value = params.get("code");
    if(value){  
      localStorage.removeItem("auth_token")
      localStorage.setItem("auth_token",value);
      gettoken("http://localhost:3000/testing",client_id,client_secret,'http://localhost:3000');
    }
    else{
      setMessage("")
    }

    
   },[])
function getAuthcode(base_uri,client_id,state){

    const params = {
      response_type: 'code',
      client_id:client_id,
      redirect_uri: base_uri,
      scope:base_uri,
      state:state,
    }
    
window.location.href = `http://localhost:3001?${new URLSearchParams(params)}`
}
async function gettoken(base_uri,client_id,client_secret,redirect_uri){
    setMessage("proccessing")
    if(!localStorage.getItem("auth_token")){
       setMessage("auth failed")
       return ;
    }
    const access_code = localStorage.getItem("auth_token");
    try{
      const payload = {
        grant_type:"authorization_code",
      
        redirect_uri:base_uri,
        client_id:client_id,
        client_secret:client_secret
      }
      const response =  await fetch("http://localhost:8080/api/access_token",{
      method:"POST",
      mode:"cors",
      cache:'reload',
      
       headers:{
        Authorization:`bearer ${access_code}`
       },
       body:JSON.stringify(payload)
      })
      if(response.ok){
        const data = await response.json();
        if(data.success){
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem("refresh_token" , data.refresh_token);
        setMessage("")
        setlogged(true);
        }
        else{
          setMessage("Something went wrong")
        }
      }
      else{
        console.log("worng response")
        setMessage("something went wrong")
        return {success:false, message:"something went worng"}
      }
    }catch(err){
       console.log(err)
       return {success:false, message:err}
    }
  }
  return (
  <>
  <div className="container">
     { !logged ?<button className="googleButton" onClick={()=>{
        getAuthcode("http://localhost:3000/testing",client_id,2324123)
      }}>Login with Google</button>: <h4>logged in</h4> } 
      
      <div>
      <h3>
      {message}
      </h3>
      </div>
    </div>
  </>
  )
}

  // module.exports={
  //   getUrlParameter,
  //   getAuthcode,
  //   gettoken
  // }