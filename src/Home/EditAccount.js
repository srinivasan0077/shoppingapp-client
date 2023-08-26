import "../css/login.css";
import { UserContext } from "../App";
import { useContext, useEffect, useState } from "react";
import properties from "../properties/properties.json";
import { useNavigate,useSearchParams } from "react-router-dom";



function EditAccount(){
    const {logged,credential}=useContext(UserContext);

    const navigate=useNavigate();
    const whitespaceRegex=/\s/
    const [queryParameters] = useSearchParams();
    const edit=queryParameters.get("edit");
    const value=queryParameters.get("value");
    const [state,setState]=useState({});

    useEffect(()=>{
           document.getElementById("editaccount-result-display").style.display="none";
           if(!logged){
               navigate("/loginPage");
           }
    },[logged])

    function handleFieldUpdate(){

          if(!validateFieldDetails()){
              return;
          }

          try{
             document.getElementById("editaccount-btn").disabled=true;
             const formData = new FormData();
             formData.append("fieldName",edit);
             formData.append("fieldValue",state[edit]);
            
             fetch(properties.remoteServer+"/auth/api/account/edit",{
                method:"POST",
                body:formData,
                credentials: "include",
                headers: {
                  'csrfToken':credential
                }
                }).then(
                (stream)=>stream.json()
                ).then(json=>{
                     if(json.status===2000){
                        let resultContainer=document.getElementById("editaccount-result-display");
                        let resultContent=document.getElementById("editaccount-result-content");
                        resultContent.innerHTML=json.message;
                        resultContent.style.color="blue";
                        resultContainer.style.border="1px solid blue";
                        resultContainer.style.display="block";  
                     }else if(json.status===4001){
                         window.location.reload();
                     }else{
                        let resultContainer=document.getElementById("editaccount-result-display");
                        let resultContent=document.getElementById("editaccount-result-content");
                        resultContent.innerHTML=json.message;
                        resultContent.style.color="red";
                        resultContainer.style.border="1px solid red";
                        resultContainer.style.display="block";
                     }
                })
         
          }catch(err){
            console.log(err);
          }finally{
            document.getElementById("editaccount-btn").disabled=false;
          }
    }

    function handleChange(e){
        state[e.target.name]=e.target.value;
        setState({...state});
    }
    
    function validateFieldDetails(){
    
        if(edit==="password"){
            if(state.password===undefined || state.password===null || state.password==="" ||
            whitespaceRegex.test(state.password) || state.password.length<6 || state.password.length>20){
                let resultContainer=document.getElementById("editaccount-result-display");
                let resultContent=document.getElementById("editaccount-result-content");
                resultContent.innerHTML="Invalid password";
                resultContent.style.color="red";
                resultContainer.style.border="1px solid red";
                resultContainer.style.display="block";
                return false;
            }

            if(state.password!==state.confirmpw){
                let resultContainer=document.getElementById("editaccount-result-display");
                let resultContent=document.getElementById("editaccount-result-content");
                resultContent.innerText="Password and Confirm Password are not equal.";
                resultContent.style.color="red";
                resultContainer.style.border="1px solid red";
                resultContainer.style.display="block";
                return false;
            }
    


        }else if(edit==="firstname" || edit==="lastname"){
            if(state[edit]===undefined || state[edit]===null ||
                whitespaceRegex.test(state[edit]) || state[edit].length<1 || state[edit].length>20){
                      let resultContainer=document.getElementById("editaccount-result-display");
                      let resultContent=document.getElementById("editaccount-result-content");
                      resultContent.innerText=(edit==="firstname"?"First Name":"Last Name")+" length should be between 1 and 20 and no whitespce allowed.";
                      resultContent.style.color="red";
                      resultContainer.style.border="1px solid red";
                      resultContainer.style.display="block";
                      return false;
                }
        }else if(edit==="phone"){
            if(state[edit]===undefined || state[edit]===null ||
                whitespaceRegex.test(state[edit]) || isNaN(state[edit]) || state[edit]<0 || state[edit].toString().length!==10){
                      let resultContainer=document.getElementById("editaccount-result-display");
                      let resultContent=document.getElementById("editaccount-result-content");
                      resultContent.innerText="Invalid Phone Number!";
                      resultContent.style.color="red";
                      resultContainer.style.border="1px solid red";
                      resultContainer.style.display="block";
                      return false;
                }
        }

        return true;
    }

    function renderEditAccountForm(){
        if(edit==="phone"){
            return (
            <div className="input-container">
                <div className="input-name">Phone</div>
                <input className="form-control" type={"number"} name="phone" value={state.phone} onChange={handleChange}/>
            </div>
            )
        }else if(edit==="password"){
            return (
                <>
                    <div className="input-container">
                        <div className="input-name">Password</div>
                        <input className="form-control" type={"password"} name="password" value={state.password} onChange={handleChange}/>
                    </div>
                    <div className="input-container">
                        <div className="input-name">Confirm Password</div>
                        <input className="form-control" type={"password"} name="confirmpw" value={state.confirmpw} onChange={handleChange}/>
                    </div>
                </>
            )
        }else if(edit==="firstname" || edit==="lastname"){
            return (
                <div className="input-container">
                    <div className="input-name">{edit==="firstname"?"First Name":"Last Name"}</div>
                    <input className="form-control" type={"text"} name={edit} value={state[edit]} onChange={handleChange}/>
                </div>
                )
        }
    }


    return (
        <div className="login-body">
            <div className="login-result-container">
                    <div className="login-result" id="editaccount-result-display"><div className="login-result-content" id="editaccount-result-content"> </div></div>
            </div>
            <div className="login-page">
                <div className="login-container">
                    <div className="login-heading">Edit Account</div>
                    
                    {renderEditAccountForm()}
                    <div className="button-container">
                        <input type={"button"} onClick={handleFieldUpdate} id="editaccount-btn" className="input-button" value="Submit"/>
                    </div>
                
                </div>
            </div>
        </div>
    )
}

export default EditAccount;