"use client"
import react, { useEffect, useState } from "react";
import './app.css'
import Cookies from "js-cookie";

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
  const url = window.location.href;

   useEffect(()=>{
  
    const params = new URLSearchParams(window.location.search);
    const value = params.get("code");
    if(value && !Cookies.get("refreshToken")){ 
      Cookies.set("authcode",value,{expires:1})
      gettoken(url,client_id,client_secret,url);
    }
    else{
      setMessage("")
    }

    
   },[])

   
   const generateRandomNumber = () => {
    const min = 10000; // minimum 5-digit number
    const max = 99999; // maximum 5-digit number
    const newRandomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return newRandomNumber;
  };
function getAuthcode(base_uri,client_id){
   const state = generateRandomNumber();
   Cookies.set("state",state)
    const params = {
      response_type: 'code',
      client_id:client_id,
      redirect_uri:window.location.href,
      scope:"READ-WRITE",
      state:state,
    }
    
window.location.href = `http://localhost:3000?${new URLSearchParams(params)}`
}
async function gettoken(base_uri,client_id,redirect_uri){
    setMessage("proccessing")
    if(!Cookies.get('authcode')){
       setMessage("auth failed")
       return ;
    }
    const access_code = Cookies.get("authcode");
    console.log(access_code)
    const state = Cookies.get("state")
    try{
    
      
      const response =  await fetch("http://localhost:8080/api/v1/access_token",{
      method:"POST",
      mode:"cors",
      cache:'reload',
      credentials: 'include',
       headers:{
        'Content-Type': 'application/json',
        Authorization:`bearer ${access_code}`
       },
       body:JSON.stringify({
        grant_type:"authorization_code",
        redirect_uri:window.location.href,
        client_id:client_id,
        client_secret:client_secret,
       })
      })
      if(response.ok){
        const data = await response.json();
        if(data.success){
          Cookies.remove("state")
        Cookies.remove("authcode")
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
        getAuthcode(url,client_id)
      }}>Login</button>: <h4>logged in</h4> } 
      
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