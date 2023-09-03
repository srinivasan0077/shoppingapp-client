import { useNavigate, useSearchParams } from "react-router-dom";
import "../css/login.css"
import { useContext, useState,useEffect } from "react";
import { UserContext } from "../App";
import properties from "../properties/properties.json";



function OtpForm(){
  
    const {logged,scroll}=useContext(UserContext);
    const [state,setState]=useState({"otp":""});
    const [queryParameters] = useSearchParams();
    const email=queryParameters.get("email");
    const navigate=useNavigate();
    const whitespaceRegex=/\s/
    const emailRegex=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

    function handleChange(e){
        state[e.target.name]=e.target.value;
        setState({...state});
    }

    useEffect(()=>{
        document.getElementById("otpfw-result-display").style.display="none";
 
        if(logged){
            navigate("/");
        }
    },[logged])

    async function handleSubmit(){
         if(!validateOTPForm()){
              return;
         }

         try{
            let inputData=JSON.stringify(state);
            document.getElementById("otpvalidate-btn").disabled=true;
            await fetch(properties.remoteServer+"/otpvalidationforpwchange",{
                method:"POST",
                body:inputData,
                credentials: "include",
                headers: {
                'Content-Type': 
                'application/json;charset=utf-8'
                }
            }).then(res=>res.json()).then(json=>{
                if(json.status===2000){
                    navigate("/changepassword",{ replace: true });
                }else if(json.status===4001){
                    navigate("/forgotpassword",{ replace: true });
                }else{            
                    showValidationResult(json.message);
                }
                
            })
        }catch(err){
            console.log(err);
        }finally{
            document.getElementById("otpvalidate-btn").disabled=false;
        }
    }

    async function resendOTP(){
          if(email===undefined || email===null){
                navigate("/forgotpassword",{ replace: true });
          }else if(email.length>320 || !emailRegex.test(email) || whitespaceRegex.test(email)){
                showValidationResult("Invalid Email");
          }else{
            try{
                let inputData=JSON.stringify({"email":email});
                document.getElementById("resendotp-btn").disabled=true;
                await fetch(properties.remoteServer+"/otpforpwchange",{
                    method:"POST",
                    body:inputData,
                    credentials: "include",
                    headers: {
                    'Content-Type': 
                    'application/json;charset=utf-8'
                    }
                }).then(res=>res.json()).then(json=>{
                    
                    if(json.status===2000){
                        let resultContainer=document.getElementById("otpfw-result-display");
                        let resultContent=document.getElementById("otpfw-result-content");
                        resultContent.innerHTML=json.message;
                        resultContent.style.color="blue";
                        resultContainer.style.border="1px solid blue";
                        resultContainer.style.display="block";
                    }else if(json.status===4001){
                        navigate("/forgotpassword",{ replace: true });
                    }else{
                        showValidationResult(json.message);
                    }
                })
        }catch(err){
            console.log(err);
        }finally{
            document.getElementById("resendotp-btn").disabled=false;
        }
      }
    }

    function showValidationResult(message){
        let resultContainer=document.getElementById("otpfw-result-display");
        let resultContent=document.getElementById("otpfw-result-content");
        resultContent.innerText=message;
        resultContent.style.color="red";
        resultContainer.style.border="1px solid red";
        resultContainer.style.display="block";
        if(scroll.current!==undefined){
            scroll.current.scrollIntoView();
         }
    }

    function validateOTPForm(){
        if(state.otp===undefined || state.otp===null || isNaN(state.otp) || state.otp.toString().length!==6){
            showValidationResult("Invalid otp");
            return false;
        }
        return true;
    }

    function handleKeyInput(e){
        if(e.key==='Enter'){
            const otpvalidateBtn=document.getElementById("otpvalidate-btn");
            if(otpvalidateBtn!==undefined){
                otpvalidateBtn.click();
            }
        }
    }

    return (
        <div className="login-body">
             <div className="login-result-container">
                    <div className="login-result" id="otpfw-result-display"><div className="login-result-content" id="otpfw-result-content"> </div></div>
            </div>

            <div className="login-page">
               <div className="login-container">
                    <div className="login-heading">OTP Validation</div>
                        <div className="input-container">
                            <div className="input-name">Enter OTP</div>
                            <input className="form-control" type={"number"} name="otp" value={state.otp} onChange={handleChange} onKeyDown={handleKeyInput}/>
                        </div>
                        <div className="button-container">
                            <input type={"button"} onClick={handleSubmit} id="otpvalidate-btn" className="input-button" value="Submit"/>
                        </div>
                        <div style={{display:"flex",fontSize:13,justifyContent:"center",padding:5}}>
                            <div>Not received your code?</div>
                            <div style={{color:"blue",cursor:"pointer"}} id="resendotp-btn" onClick={resendOTP}>Resend code</div>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default OtpForm;