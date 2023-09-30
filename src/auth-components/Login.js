import "../css/login.css";
import { UserContext } from "../App";
import { useContext, useEffect, useState } from "react";
import properties from "../properties/properties.json";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";


function LoginPage(){
    const {logged,setLogged,setCredential,user,setUser,scroll}=useContext(UserContext);
    const [state,setState]=useState();
    const navigate=useNavigate();
    const whitespaceRegex=/\s/
    const emailRegex=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    const history=useLocation().state;

    useEffect(()=>{
           document.getElementById("login-result-display").style.display="none";
           if(logged){
               navigate("/");
           }
    },[logged])

    async function handleLogin(){

          if(!validateLoginDetails()){
              return;
          }

          try{
                let inputData={email:state};

                document.getElementById("login-btn").disabled=true;
                await fetch(properties.remoteServer+"/login",{
                    method:"POST",
                    body:JSON.stringify(inputData),
                    credentials: "include",
                    headers: {
                    'Content-Type': 
                    'application/json;charset=utf-8'
                    }
                }).then(res=>res.json()).then(json=>{
                    
                    if(json.status===2000){
                        if(history!==null && history!==undefined && history.redirectUrl!==undefined){
                            navigate("/otpvalidationform",{state:history})
                        }else{
                            navigate("/otpvalidationform")
                        }
                    }else{
                        showValidationResult(json.message);   
                    }
            
                })
        }catch(err){
            console.log(err);
        }finally{
            document.getElementById("login-btn").disabled=false;
        }
    }

    function handleChange(e){
        setState(e.target.value);
    }

    function showValidationResult(message){
        let resultContainer=document.getElementById("login-result-display");
        let resultContent=document.getElementById("login-result-content");
        resultContent.innerText=message;
        resultContent.style.color="red";
        resultContainer.style.border="1px solid red";
        resultContainer.style.display="block";
        if(scroll.current!==undefined){
            scroll.current.scrollIntoView();
         }
    }
    
    function validateLoginDetails(){
        if(state===undefined || state===null || state===""){
            showValidationResult("Invalid Email");
            return false;
        }

        if(state.length<=320 && emailRegex.test(state) && !whitespaceRegex.test(state)){
            return true;
        }

        showValidationResult("Invalid Email");
        return false;
    }

    function handleKeyInput(e){
        if(e.key==='Enter'){
            const loginBtn=document.getElementById("login-btn");
            if(loginBtn!==undefined){
                loginBtn.click();
            }
        }
    }

    function handleGoogleLogin(authdetails){
        const formData = new FormData();
        formData.append("jwtcredential",authdetails.credential);

        fetch(properties.remoteServer+"/google/login",{
            method:"POST",
            body:formData,
            credentials: "include"
        }).then(res=>res.json()).then(json=>{
            
            if(json.status===2000){
                setLogged(true);
                let content=JSON.parse(json.content);
                setCredential(content.csrfToken);
                setUser({...user,"userid":content.userid,"roleid":content.roleid,"firstname":content.username});
                
                if(history!==null && history!==undefined && history.redirectUrl!==undefined){
                    navigate(history.redirectUrl,{ replace: true });
                }else{
                    navigate("/",{ replace: true });
                }
                
            }else{
                showValidationResult(json.message);   
            }
    
        })
    }

  

    return (
        <div className="login-body">
            <div className="login-result-container">
                    <div className="login-result" id="login-result-display"><div className="login-result-content" id="login-result-content"> </div></div>
            </div>
            <div className="login-page">
                <div className="login-container">
                    <div className="login-heading">Sign in</div>
                    <div className="input-container">
                        <div className="input-name">Enter your email</div>
                        <input className="form-control" type={"email"} name="emailorphone" value={state} onChange={handleChange} onKeyDown={handleKeyInput}/>
                    </div>
                    <div className="button-container">
                        <input type={"button"} onClick={handleLogin} id="login-btn" className="input-button" value="Sign in"/>
                    </div>
                    <h6 style={{textAlign:"center",marginTop:10}}>or</h6>
                    <hr/>
                    <div style={{display:"flex",justifyContent:"center"}}>
                    <GoogleOAuthProvider clientId={properties.googleClientId}>
                            <GoogleLogin
                            onSuccess={credentialResponse => {
                                handleGoogleLogin(credentialResponse);
                            }}
                            onError={() => {
                                showValidationResult("Google Authentication Failed.Try Again!");
                            }}
                            />
                    </GoogleOAuthProvider>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default LoginPage;