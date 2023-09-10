import { useContext, useEffect, useState } from "react";
import {useParams,useNavigate } from "react-router-dom";
import properties from "../properties/properties.json";
import "../admin-styles/general.css";
import Select from "react-select";
import { UserContext } from "../App";

function ActionTopic(props){
   const [action,setAction]=useState();
   const {id}=useParams();
   const [state,setState]=useState({id:0,name:"",active:false})
   const options=[{value:true,label:"true"},{value:false,label:"false"}];
   const {credential,user,logged}=useContext(UserContext);
   const navigate=useNavigate();

   useEffect(()=>{
        if(!logged || user.roleid!==2){
            navigate("/",{replace:true});
            return;
        }
        document.getElementById("topic-result-display").style.display="none";

    
        if(props.operation==="add"){
            setAction("Add");
        }else if(props.operation==="edit"){
            
            fetch(properties.remoteServer+"/admin/api/topics/"+id,{
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

   function handleActiveSelect(SelectedOption){
    state.active=SelectedOption.value
    setState({...state});
   }

   function getDefaultValue(){
     
    for(let i=0;i<options.length;i++){
         if(options[i].value===state.active){
             return options[i];
         }
    }
 }

   async function topicAction(action){
           let inputData=JSON.stringify(state);
           document.getElementById("add-topic-btn").disabled=true;
           try{
            if(action==="add"){
                delete inputData["id"];
                console.log(inputData)
                await fetch(properties.remoteServer+"/admin/api/topics",{
                    method:"POST",
                    body:inputData,
                    credentials: "include",
                    headers: {
                    'Content-Type': 
                    'application/json;charset=utf-8',
                    'csrfToken':credential
                    
                    }
                }).then(res=>res.json()).then(json=>{
                    const resultContainer=document.getElementById("topic-result-display");
                    const resultContent=document.getElementById("topic-result-content");
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
                console.log(inputData);
                await fetch(properties.remoteServer+"/admin/api/topics/"+id,{
                    method:"PUT",
                    body:inputData,
                    credentials: "include",
                    headers: {
                    'Content-Type': 
                    'application/json;charset=utf-8',
                    'csrfToken':credential
                    
                    }
                }).then(res=>res.json()).then(json=>{
                    const resultContainer=document.getElementById("topic-result-display");
                    const resultContent=document.getElementById("topic-result-content");
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
        document.getElementById("add-topic-btn").disabled=false;
   }

   function renderForm(){
        if(action!==undefined){
            if(action==="Add"){
                return(
                    <div className="general-container">
                        <div className="general-heading">Add Topic</div>
                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Topic Name</div>
                            <input className="form-control" type={"text"} name="name" value={state.name} onChange={handleChange}/>
                        </div>
                        <div className="container-align-center">
                            <input type={"button"} className="general-btn-style"  id="add-topic-btn" onClick={()=>{topicAction("add")}}  value="Add"/>
                        </div>
    
                    </div>
                )
            }else if(action==="Edit"){
                return(
                    <div className="general-container">
                    <div className="general-heading">Edit Topic</div>
                    <div style={{paddingTop: 10}}>
                        <div className="general-input-name">Topic Name</div>
                        <input className="form-control" type={"text"} name="name" value={state.name} onChange={handleChange}/>
                    </div>
                    <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Active</div>
                            <Select options={options} onChange={handleActiveSelect} defaultValue={getDefaultValue()}/>
                    </div>
                    <div className="container-align-center">
                        <input type={"button"} className="general-btn-style"  id="add-topic-btn" onClick={()=>{topicAction("edit")}}  value="Edit"/>
                    </div>

                </div>
                )
            }
        }
   }

   return(
      <>
        <h3 style={{textAlign:"center",padding:20,color:"maroon"}}>{action} Topic</h3>
        <div className="container-align-center">
            <div className="result-container" id="topic-result-display"><h6 style={{textAlign:"center"}} id="topic-result-content"> </h6></div>
        </div>
        <div className="container-align-center">
            {renderForm()}
        </div>
      </>
   )
}

export default ActionTopic;