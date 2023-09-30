import {useLocation, useNavigate } from "react-router-dom";
import "../css/login.css"
import { useContext, useState,useEffect } from "react";
import { UserContext } from "../App";
import properties from "../properties/properties.json";
import FormForOTP from "../general-components/FormForOTP";



function SignupOtpForm(){
  
    const {logged,scroll,setLogged,setCredential,setUser,user}=useContext(UserContext);
    const [state,setState]=useState({"otp":""});
    const navigate=useNavigate();
    const history=useLocation().state;

    useEffect(()=>{
        if(logged){
            navigate("/");
        }
    },[logged])

    async function handleSubmit(resultContainer,resultContent){
         try{
          let inputData=JSON.stringify(state);
          await fetch(properties.remoteServer+"/otpvalidation",{
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
                  if(history!==null && history!==undefined && history.redirectUrl!==undefined){
                    navigate(history.redirectUrl,{ replace: true });
                  }else{
                        navigate("/",{ replace: true });
                  }
              }else if(json.status===4002){
                    navigate("/loginPage")
              }else{
                resultContent.innerText=json.message;
                resultContent.style.color="red";
                resultContainer.style.border="1px solid red";
                resultContainer.style.display="block";
                if(scroll.current!==undefined){
                    scroll.current.scrollIntoView();
                 }
               }
             
          })
        }catch(err){
            console.log(err);
        }
    }

    async function resendOTP(resultContainer,resultContent){
         
        try{
            await fetch(properties.remoteServer+"/resendcode",{
                credentials: "include",
              })
            .then(res=>res.json()).then(json=>{
                if(json.status===2000){
                    resultContent.innerText=json.message;
                    resultContent.style.color="green";
                    resultContainer.style.border="1px solid green";
                    resultContainer.style.display="block";

                }else if(json.status===4001){
                    navigate("/loginPage")
                }else{
                    resultContent.innerText=json.message;
                    resultContent.style.color="red";
                    resultContainer.style.border="1px solid red";
                    resultContainer.style.display="block";
                    if(scroll.current!==undefined){
                        scroll.current.scrollIntoView();
                    }
                 }
            })
        }catch(err){
            console.log(err);
        }
    }

    

    return (
        <div>
            <FormForOTP state={state} setState={setState} handleSubmit={handleSubmit} handleResendCode={resendOTP}/>
        </div>
    )
}

export default SignupOtpForm;