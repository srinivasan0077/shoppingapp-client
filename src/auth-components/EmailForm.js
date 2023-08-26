import "../css/login.css"
import { UserContext } from "../App";
import { useContext, useEffect, useState } from "react";
import properties from "../properties/properties.json";
import { useNavigate } from "react-router-dom";



function EmailForm(){
    const {logged}=useContext(UserContext);
    const [state,setState]=useState({"email":""});
    const navigate=useNavigate();
    const whitespaceRegex=/\s/
    const emailRegex=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

    useEffect(()=>{
        document.getElementById("fpform-result-display").style.display="none";
        if(logged){
            navigate("/");
        }
    },[logged])

    async function sendOtp(){
         try{
          let inputData=JSON.stringify(state);
          if(!validateFields()){
              return;
          }
          document.getElementById("sendotp-btn").disabled=true;
          await fetch(properties.remoteServer+"/otpforpwchange",{
            method:"POST",
            body:inputData,
            credentials: "include",
            headers: {
             'Content-Type': 
            'application/json;charset=utf-8'
            }
          }).then(res=>res.json()).then(json=>{
              console.log(json);
              if(json.status===2000){
                  navigate("/otpform",{email:state});
              }else{
                let resultContainer=document.getElementById("fpform-result-display");
                let resultContent=document.getElementById("fpform-result-content");
                resultContent.innerText=json.message;
                resultContent.style.color="red";
                resultContainer.style.border="1px solid red";
                resultContainer.style.display="block";
              }
          })

        }catch(err){
            console.log(err);
        }finally{
            document.getElementById("sendotp-btn").disabled=false;
        }
    }

    function handleChange(e){
        state[e.target.name]=e.target.value;
        setState({...state});
    }

    function validateFields(){
        if(state.email===undefined || state.email===null || state.email==="" ||
        state.email.length>320 || !emailRegex.test(state.email) || whitespaceRegex.test(state.email)){
            let resultContainer=document.getElementById("fpform-result-display");
            let resultContent=document.getElementById("fpform-result-content");
            resultContent.innerHTML="Invalid email";
            resultContent.style.color="red";
            resultContainer.style.border="1px solid red";
            resultContainer.style.display="block";

            return false;
        }

        return true;
    }

    return (
        <div className="login-body">
             <div className="login-result-container">
                    <div className="login-result" id="fpform-result-display"><div className="login-result-content" id="fpform-result-content"> </div></div>
            </div>
            <div className="login-page">
                <div className="login-container">
                    <div className="login-heading">Forgot Password</div>
                    <div className="input-container">
                        <div className="input-name">Email</div>
                        <input className="form-control" type={"email"} name="email" value={state.email} onChange={handleChange}/>
                    </div>
                    
                    <div className="button-container">
                        <input type={"button"} onClick={sendOtp} id="sendotp-btn" className="input-button" value="Submit"/>
                    </div>
                
                </div>
            </div>
        </div>
    )
}

export default EmailForm;