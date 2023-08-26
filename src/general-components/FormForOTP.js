import { useEffect } from "react";
import "../css/login.css"


function FormForOTP(props){
  
    const {state,setState}=props;
    const {handleSubmit,handleResendCode}=props;

    useEffect(()=>{
        document.getElementById("spotpform-result-display").style.display="none";
    },[])

    function handleChange(e){
        state[e.target.name]=e.target.value;
        setState({...state});
    }

    async function handleResendClick(){
        try{
            document.getElementById("resendotp-btn").disabled=true;
            await handleResendCode(document.getElementById("spotpform-result-display"),document.getElementById("spotpform-result-content"));
        }catch(err){
            console.log(err);
        }finally{
            document.getElementById("resendotp-btn").disabled=false;
        }
    }

    async function handleSubmitClick(){
        if(!validateOTPForm()){
            return;
        }

        try{
            document.getElementById("otpvalidate-btn").disabled=true;
            await handleSubmit(document.getElementById("spotpform-result-display"),document.getElementById("spotpform-result-content"));
        }catch(err){
            console.log(err);
        }finally{
            document.getElementById("otpvalidate-btn").disabled=false;
        }
    }

    function validateOTPForm(){
        if(state.otp===undefined || state.otp===null || isNaN(state.otp) || state.otp.toString().length!==6){
            let resultContainer=document.getElementById("spotpform-result-display");
            let resultContent=document.getElementById("spotpform-result-content");
            resultContent.innerText="Invalid otp";
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
                    <div className="login-result" id="spotpform-result-display"><div className="login-result-content" id="spotpform-result-content"> </div></div>
            </div>
            <div className="login-page">
            <div className="login-container">
                <div className="login-heading">OTP Validation</div>
                <div className="input-container">
                    <div className="input-name">Enter OTP</div>
                    <input className="form-control" type={"number"} name="otp" value={state.otp} onChange={handleChange}/>
                </div>
                <div className="button-container">
                    <input type={"button"} onClick={handleSubmitClick} id="otpvalidate-btn" className="input-button" value="Submit"/>
                </div>
                <div style={{display:"flex",fontSize:13,justifyContent:"center",padding:5}}>
                    <div>Not received your code?</div>
                    <div style={{color:"blue",cursor:"pointer"}}><button className="remove-button-styling" id="resendotp-btn" onClick={handleResendClick}>Resend code</button></div>
                </div>
            </div>
        </div>
       </div>
    )
}

export default FormForOTP;