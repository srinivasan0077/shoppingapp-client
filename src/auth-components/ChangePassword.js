import "../css/login.css"
import { UserContext } from "../App";
import { useContext, useEffect, useState } from "react";
import properties from "../properties/properties.json";
import { useNavigate } from "react-router-dom";



function ChangePasswordForm(){
    const {logged,scroll}=useContext(UserContext);
    const [state,setState]=useState({"password":"","confirmpw":""});
    const navigate=useNavigate();
    const whitespaceRegex=/\s/;
    useEffect(()=>{
        document.getElementById("cpform-result-display").style.display="none";
           if(logged){
               navigate("/");
           }
    },[logged])

    async function handleSubmit(){

        if(!validatePassword()){
            return;
        }

        try{
          let inputData=JSON.stringify({"password":state.password});
          document.getElementById("changepw-submit-btn").disabled=true;
         await fetch(properties.remoteServer+"/changepw",{
            method:"POST",
            body:inputData,
            credentials: "include",
            headers: {
             'Content-Type': 
            'application/json;charset=utf-8'
            }
          }).then(res=>res.json()).then(json=>{
              if(json.status===2000){
                  navigate("/loginPage",{ replace: true });
              }else if(json.status===4001){
                  navigate("/forgotpassword",{ replace: true });
              }else{
                  showValidationResult(json.message);
                  return false;
              } 
    
          })
        }catch(err){
            console.log(err);
        }finally{
            document.getElementById("changepw-submit-btn").disabled=false;
        }
    }

    function handleChange(e){
        state[e.target.name]=e.target.value;
        setState({...state});
    }

    function showValidationResult(message){
        let resultContainer=document.getElementById("cpform-result-display");
        let resultContent=document.getElementById("cpform-result-content");
        resultContent.innerText=message;
        resultContent.style.color="red";
        resultContainer.style.border="1px solid red";
        resultContainer.style.display="block";
        if(scroll.current!==undefined){
            scroll.current.scrollIntoView();
         }
    }

    function validatePassword(){
        if(state.password===undefined || state.password===null || state.password.length===0 ||
            whitespaceRegex.test(state.password) || state.password.length<6 || state.password.length>20){
                  showValidationResult("Password length should be between 6 and 20 and no whitespce allowed.");
                  return false;
            }
    
            if(state.password!==state.confirmpw){
                showValidationResult("Password and Confirm Password are not equal.");
                return false;
            }

            return true;
    }

    function handleKeyInput(e){
        if(e.key==='Enter'){
            const changepwBtn=document.getElementById("changepw-submit-btn");
            if(changepwBtn!==undefined){
                changepwBtn.click();
            }
        }
    }

    return (
        <div className="login-body">
            <div className="login-result-container">
                    <div className="login-result" id="cpform-result-display"><div className="login-result-content" id="cpform-result-content"> </div></div>
            </div>
            <div className="login-page">
            <div className="login-container">
                <div className="login-heading">Change Password</div>
                <div className="input-container">
                    <div className="input-name">Password</div>
                    <input className="form-control" type={"password"} name="password" value={state.password} onChange={handleChange}/>
                </div>
                <div className="input-container">
                    <div className="input-name">Confirm Password</div>
                    <input className="form-control" type={"password"} name="confirmpw" value={state.confirmpw} onChange={handleChange} onKeyDown={handleKeyInput}/>
                </div>
                <div className="button-container">
                    <input type={"button"} onClick={handleSubmit}  id="changepw-submit-btn" className="input-button" value="Submit"/>
                </div>
                
            </div>
            </div>
        </div>
    )
}

export default ChangePasswordForm;