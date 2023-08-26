import { UserContext } from "../App";
import { useContext, useState,useEffect} from "react";
import properties from "../properties/properties.json";
import "../css/login.css"
import { useNavigate } from "react-router-dom";


function SignUpPage(){
    const {logged}=useContext(UserContext);
    const [state,setState]=useState({"email":"","password":"","confirmpw":"","firstname":"","lastname":""});
    const navigate=useNavigate();
    const whitespaceRegex=/\s/
    const emailRegex=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

    useEffect(()=>{
        document.getElementById("signup-result-display").style.display="none";
        if(logged){
            navigate("/");
        }
    },[logged])

    async function handleSignUp(){
         if(!validateSignupDetails()){
                return;
         }
          document.getElementById("signup-btn").disabled=true;
          let inputData=JSON.stringify(state);
          try{
                await fetch(properties.remoteServer+"/signup",{
                    method:"POST",
                    body:inputData,
                    credentials: "include",
                    headers: {
                    'Content-Type': 
                    'application/json;charset=utf-8'
                    }
                }).then(res=>res.json()).then(json=>{
                
                    if(json.status===2000){
                        navigate("/otpvalidationform")
                    }else{
                        let resultContainer=document.getElementById("signup-result-display");
                        let resultContent=document.getElementById("signup-result-content");
                        resultContent.innerHTML=json.message;
                        resultContent.style.color="red";
                        resultContainer.style.border="1px solid red";
                        resultContainer.style.display="block";
                    }
            
                })
           }catch(err){
                 console.log(err);
           }finally{
                 console.log("Executed")
                 document.getElementById("signup-btn").disabled=false;
           }
    }

    function validateSignupDetails(){

        if(state.firstname===undefined || state.firstname===null || 
        whitespaceRegex.test(state.firstname) || state.firstname.length<1 || state.firstname.length>20){
              let resultContainer=document.getElementById("signup-result-display");
              let resultContent=document.getElementById("signup-result-content");
              resultContent.innerText="Firstname length should be between 1 and 20 and no whitespce allowed.";
              resultContent.style.color="red";
              resultContainer.style.border="1px solid red";
              resultContainer.style.display="block";
              return false;
        }

        if(state.lastname===undefined || state.lastname===null ||
        whitespaceRegex.test(state.lastname) || state.lastname.length<1 || state.lastname.length>20){
              let resultContainer=document.getElementById("signup-result-display");
              let resultContent=document.getElementById("signup-result-content");
              resultContent.innerText="Lastname length should be between 1 and 20 and no whitespce allowed.";
              resultContent.style.color="red";
              resultContainer.style.border="1px solid red";
              resultContainer.style.display="block";
              return false;
        }
    
        if(state.email===undefined || state.email===null ||
        state.email.length>320 || !emailRegex.test(state.email) || whitespaceRegex.test(state.email)){
            let resultContainer=document.getElementById("signup-result-display");
            let resultContent=document.getElementById("signup-result-content");
            resultContent.innerText="Invalid email";
            resultContent.style.color="red";
            resultContainer.style.border="1px solid red";
            resultContainer.style.display="block";
            return false;
        }

        if(state.password===undefined || state.password===null || state.password.length===0 ||
        whitespaceRegex.test(state.password) || state.password.length<6 || state.password.length>20){
              let resultContainer=document.getElementById("signup-result-display");
              let resultContent=document.getElementById("signup-result-content");
              resultContent.innerText="Password length should be between 6 and 20 and no whitespce allowed.";
              resultContent.style.color="red";
              resultContainer.style.border="1px solid red";
              resultContainer.style.display="block";
              return false;
        }

        if(state.password!==state.confirmpw){
            let resultContainer=document.getElementById("signup-result-display");
            let resultContent=document.getElementById("signup-result-content");
            resultContent.innerText="Password and Confirm Password are not equal.";
            resultContent.style.color="red";
            resultContainer.style.border="1px solid red";
            resultContainer.style.display="block";
            return false;
        }

        return true;
    }

    function handleChange(e){
        state[e.target.name]=e.target.value;
        setState({...state});
    }

    return (
        <div className="login-body">
        <div className="login-result-container">
                    <div className="login-result" id="signup-result-display"><div className="login-result-content" id="signup-result-content"> </div></div>
            </div>
        <div className="login-page">
            <div className="login-container">
                <div className="login-heading">Sign up</div>
                <div className="input-container">
                    <div className="input-name">First Name</div>
                    <input className="form-control" type={"text"} name="firstname" value={state.firstname} onChange={handleChange}/>
                </div>
                <div className="input-container">
                    <div className="input-name">Last Name</div>
                    <input className="form-control" type={"text"} name="lastname" value={state.lastname} onChange={handleChange}/>
                </div>
                <div className="input-container">
                    <div className="input-name">Email</div>
                    <input className="form-control" type={"email"} name="email" value={state.email} onChange={handleChange}/>
                </div>
               {/**<div className="input-container">
                    <div className="input-name">Gender</div>
                    <select className="form-select" aria-label="Default select example" name="gender" onChange={handleChange}>
                        <option defaultValue value={"M"}>Male</option>
                        <option value={"F"}>Female</option>
                    </select>
               </div>**/}
                <div className="input-container">
                    <div className="input-name">Password</div>
                    <input className="form-control" type={"password"} name="password" value={state.password} onChange={handleChange}/>
                </div>
                <div className="input-container">
                    <div className="input-name">Confirm Password</div>
                    <input className="form-control" type={"password"} name="confirmpw" value={state.confirmpw} onChange={handleChange}/>
                </div>
                <div className="button-container">
                    <input type={"button"} onClick={handleSignUp} id="signup-btn" className="input-button" value="Sign up"/>
                </div>
                <div className="helper-container">
                    <div className="helper-child" onClick={()=>{
                        navigate("/loginPage")
                    }}>Already have an account,Sign in?</div>
                </div>
            </div>
        </div>
        </div>
    )
}

export default SignUpPage;