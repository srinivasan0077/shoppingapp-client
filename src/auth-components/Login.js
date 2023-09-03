import "../css/login.css";
import { UserContext } from "../App";
import { useContext, useEffect, useState } from "react";
import properties from "../properties/properties.json";
import { useNavigate } from "react-router-dom";



function LoginPage(){
    const {logged,setLogged,setCredential,user,setUser,scroll}=useContext(UserContext);
    const [state,setState]=useState({"email":"","password":""});
    const navigate=useNavigate();
    const whitespaceRegex=/\s/
    const emailRegex=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

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
          let inputData=JSON.stringify(state);
          document.getElementById("login-btn").disabled=true;
          await fetch(properties.remoteServer+"/login",{
            method:"POST",
            body:inputData,
            credentials: "include",
            headers: {
             'Content-Type': 
            'application/json;charset=utf-8'
            }
          }).then(res=>res.json()).then(json=>{
              if(json.status===2000){
                  setLogged(true);
                  let content=JSON.parse(json.content);
                  setCredential(content.csrfToken);
                  setUser({...user,"userid":content.userid,"roleid":content.roleid,"firstname":content.username});
                  navigate("/");
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
        state[e.target.name]=e.target.value;
        setState({...state});
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
    
        if(state.email===undefined || state.email===null || state.email==="" ||
           state.email.length>320 || !emailRegex.test(state.email) || whitespaceRegex.test(state.email)){
            showValidationResult("Invalid email");
            return false;
        }

        if(state.password===undefined || state.password===null || state.password==="" ||
        whitespaceRegex.test(state.password) || state.password.length<6 || state.password.length>20){
              showValidationResult("Invalid password");
              return false;
        }

        return true;
    }

    function handleKeyInput(e){
        if(e.key==='Enter'){
            const loginBtn=document.getElementById("login-btn");
            if(loginBtn!==undefined){
                loginBtn.click();
            }
        }
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
                        <div className="input-name">Email</div>
                        <input className="form-control" type={"email"} name="email" value={state.email} onChange={handleChange} onKeyDown={handleKeyInput}/>
                    </div>
                    <div className="input-container">
                        <div className="input-name">Password</div>
                        <input className="form-control" type={"password"} name="password" value={state.password} onChange={handleChange} onKeyDown={handleKeyInput}/>
                    </div>
                    <div className="button-container">
                        <input type={"button"} onClick={handleLogin} id="login-btn" className="input-button" value="Sign in"/>
                    </div>
                    <div className="helper-container">
                        <div className="helper-child" onClick={()=>{navigate("/forgotpassword")}}>Forgot Password?</div>
                        <div className="helper-child" onClick={()=>{
                            navigate("/signupPage")
                        }}>Create Account?</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;