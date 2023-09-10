import { useContext, useEffect, useState } from "react";
import {useParams,useNavigate } from "react-router-dom";
import properties from "../properties/properties.json";
import "../admin-styles/general.css";
import { UserContext } from "../App";

function ActionCategory(props){
   const [action,setAction]=useState();
   const {id}=useParams();
   const [state,setState]=useState({productTypeId:0,productTypeName:"",description:""})
   const {credential,user,logged}=useContext(UserContext);
   const navigate=useNavigate();

   useEffect(()=>{
        if(!logged || user.roleid!==2){
            navigate("/",{replace:true});
            return;
        } 
        document.getElementById("result-display").style.display="none";

    
        if(props.operation==="add"){
            setAction("Add");
        }else if(props.operation==="edit"){
            
            fetch(properties.remoteServer+"/admin/api/categories/"+id,{
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
                    setState({productTypeId:json.content.productTypeId,productTypeName:json.content.productTypeName,description:json.content.description});
                }
            }
            )
        }
    

   },[id])

   function handleChange(e){
        state[e.target.name]=e.target.value;
        setState({...state});
   }

   async function categoryAction(action){
           let inputData=JSON.stringify(state);
           document.getElementById("add-category-btn").disabled=true;
           try{
            if(action==="add"){
                delete inputData["productTypeId"];
                console.log(inputData)
                await fetch(properties.remoteServer+"/admin/api/categories",{
                    method:"POST",
                    body:inputData,
                    credentials: "include",
                    headers: {
                    'Content-Type': 
                    'application/json;charset=utf-8',
                    'csrfToken':credential
                    }
                }).then(res=>res.json()).then(json=>{
                    const resultContainer=document.getElementById("result-display");
                    const resultContent=document.getElementById("result-content");
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
                await fetch(properties.remoteServer+"/admin/api/categories",{
                    method:"PUT",
                    body:inputData,
                    credentials: "include",
                    headers: {
                    'Content-Type': 
                    'application/json;charset=utf-8',
                    'csrfToken':credential
                    }
                }).then(res=>res.json()).then(json=>{
                    const resultContainer=document.getElementById("result-display");
                    const resultContent=document.getElementById("result-content");
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
        document.getElementById("add-category-btn").disabled=false;
   }

   function renderForm(){
        if(action!==undefined){
            if(action==="Add"){
                return(
                    <div className="general-container">
                        <div className="general-heading">Add Category</div>
                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Category Name</div>
                            <input className="form-control" type={"text"} name="productTypeName" value={state.productTypeName} onChange={handleChange}/>
                        </div>
                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Description</div>
                            <input className="form-control" type={"text"} name="description" value={state.description} onChange={handleChange}/>
                        </div>
                        <div className="container-align-center">
                            <input type={"button"} className="general-btn-style"  id="add-category-btn" onClick={()=>{categoryAction("add")}}  value="Add"/>
                        </div>
    
                    </div>
                )
            }else if(action==="Edit"){
                return(
                  <div className="general-container">
                    <div className="general-heading">Edit Category</div>
                    <div style={{paddingTop: 10}}>
                        <div className="general-input-name">Category Name</div>
                        <input className="form-control" type={"text"} name="productTypeName" value={state.productTypeName} onChange={handleChange}/>
                    </div>
                    <div style={{paddingTop: 10}}>
                        <div className="general-input-name">Description</div>
                        <input className="form-control" type={"text"} name="description" value={state.description} onChange={handleChange}/>
                    </div>
                    <div className="container-align-center">
                        <input type={"button"} className="general-btn-style"  id="add-category-btn" onClick={()=>{categoryAction("edit")}} value=" Edit "/>
                    </div>

                   </div>
                )
            }
        }
   }

   return(
      <>
        <h3 style={{textAlign:"center",padding:20,color:"maroon"}}>{action} Category</h3>
        <div className="container-align-center">
            <div className="result-container" id="result-display"><h6 style={{textAlign:"center"}} id="result-content"> </h6></div>
        </div>
        <div className="container-align-center">
            {renderForm()}
        </div>
      </>
   )
}

export default ActionCategory;