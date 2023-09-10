import { useContext, useEffect, useState } from "react";
import {useParams,useNavigate } from "react-router-dom";
import properties from "../properties/properties.json";
import "../admin-styles/general.css";
import { UserContext } from "../App";

function ActionColor(props){
   const [action,setAction]=useState();
   const {id}=useParams();
   const [state,setState]=useState({colorId:0,name:"",cssColor:""})
   const {credential,user,logged}=useContext(UserContext);
   const navigate=useNavigate();

   useEffect(()=>{
    if(!logged || user.roleid!==2){
        navigate("/",{replace:true});
        return;
    }
        document.getElementById("color-result-display").style.display="none";

    
        if(props.operation==="add"){
            setAction("Add");
        }else if(props.operation==="edit"){
            
            fetch(properties.remoteServer+"/admin/api/colors/"+id,{
            credentials: "include",
            headers: {
                'csrfToken':credential
            }
            }).then(
            (stream)=>stream.json()
            ).then(
            (json)=>{
                if(json.status===2000){
                    setAction("Edit");
                    setState(json.content);
                }
            }
            )
        }
    

   },[id])

   function handleChange(e){
        state[e.target.name]=e.target.value;
        setState({...state});
   }

   async function colorAction(action){
           let inputData=JSON.stringify(state);
           document.getElementById("add-color-btn").disabled=true;
           try{
            if(action==="add"){
                delete inputData["colorId"];
                await fetch(properties.remoteServer+"/admin/api/colors",{
                    method:"POST",
                    body:inputData,
                    credentials: "include",
                    headers: {
                    'Content-Type': 
                    'application/json;charset=utf-8',
                    'csrfToken':credential
                    }
                }).then(res=>res.json()).then(json=>{
                    const resultContainer=document.getElementById("color-result-display");
                    const resultContent=document.getElementById("color-result-content");
                    if(json.status===2000){
                        resultContent.innerHTML=json.message;
                        resultContent.style.color="blue";
                        resultContainer.style.border="1px solid blue";
                        resultContainer.style.display="block";
                    }else{
                        resultContent.innerHTML=json.message;
                        resultContent.style.color="red";
                        resultContainer.style.border="1px solid red";
                        resultContainer.style.display="block";
                    }
                }) 
            }else if(action==="edit"){
                await fetch(properties.remoteServer+"/admin/api/colors/"+id,{
                    method:"PUT",
                    body:inputData,
                    credentials: "include",
                    headers: {
                    'Content-Type': 
                    'application/json;charset=utf-8',
                    'csrfToken':credential
                    }
                }).then(res=>res.json()).then(json=>{
                    const resultContainer=document.getElementById("color-result-display");
                    const resultContent=document.getElementById("color-result-content");
                    if(json.status===2000){
                        resultContent.innerHTML=json.message;
                        resultContent.style.color="blue";
                        resultContainer.style.border="1px solid blue";
                        resultContainer.style.display="block";
                    }else{
                        resultContent.innerHTML=json.message;
                        resultContent.style.color="red";
                        resultContainer.style.border="1px solid red";
                        resultContainer.style.display="block";
                    }
                }) 
            }
        }catch(err){
              console.log(err);
        }
        document.getElementById("add-color-btn").disabled=false;
   }

   function renderForm(){
        if(action!==undefined){
            if(action==="Add"){
                return(
                    <div className="general-container">
                        <div className="general-heading">Add Color</div>
                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Color Name</div>
                            <input className="form-control" type={"text"} name="name" value={state.name} onChange={handleChange}/>
                        </div>
                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Css Code</div>
                            <input className="form-control" type={"text"} name="cssColor" value={state.cssColor} onChange={handleChange}/>
                        </div>
                        <div className="container-align-center">
                            <input type={"button"} className="general-btn-style"  id="add-color-btn" onClick={()=>{colorAction("add")}}  value="Add"/>
                        </div>
    
                    </div>
                )
            }else if(action==="Edit"){
                return(
                  <div className="general-container">
                    <div className="general-heading">Edit Color</div>
                    <div style={{paddingTop: 10}}>
                        <div className="general-input-name">Color Name</div>
                        <input className="form-control" type={"text"} name="name" value={state.name} onChange={handleChange}/>
                    </div>
                    <div style={{paddingTop: 10}}>
                        <div className="general-input-name">Css Code</div>
                        <input className="form-control" type={"text"} name="cssColor" value={state.cssColor} onChange={handleChange}/>
                    </div>
                    <div className="container-align-center">
                        <input type={"button"} className="general-btn-style"  id="add-color-btn" onClick={()=>{colorAction("edit")}} value=" Edit "/>
                    </div>

                   </div>
                )
            }
        }
   }

   return(
      <>
        <h3 style={{textAlign:"center",padding:20,color:"maroon"}}>{action} Color</h3>
        <div className="container-align-center">
            <div className="result-container" id="color-result-display"><h6 style={{textAlign:"center"}} id="color-result-content"> </h6></div>
        </div>
        <div className="container-align-center">
            {renderForm()}
        </div>
      </>
   )
}

export default ActionColor;