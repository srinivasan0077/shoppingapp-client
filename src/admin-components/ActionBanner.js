import { useContext, useEffect, useState } from "react";
import {  useParams,useNavigate } from "react-router-dom";
import properties from "../properties/properties.json";
import "../admin-styles/general.css";
import { UserContext } from "../App";

function ActionBanner(props){

   const [action,setAction]=useState();
   const {imageId}=useParams();
   const [state,setState]=useState({name:"",ord:0,image:""});
   const {credential,user,logged}=useContext(UserContext);
   const navigate=useNavigate();

   useEffect(()=>{

    if(!logged || user.roleid!==2){
        navigate("/",{replace:true});
        return;
    }
    
    document.getElementById("banner-result-display").style.display="none";

    if(props.operation==="add"){
         setAction("Add");
    }else if(props.operation==="edit"){
        document.getElementById("banner-result-display").style.display="none";
        fetch(properties.remoteServer+"/admin/api/banners/"+imageId,{
            credentials: "include",
            headers: {
                'csrfToken':credential
            }
        }).then(
            (stream)=>stream.json()
        ).then(
            (json)=>{
                if(json.status===2000){
                    setState(json.content);
                }
            }
        )
         setAction("Edit")
    }
    

    },[])

    function handleChange(e){
        if(e.target.name==="image"){
            console.log(e.target);
            state[e.target.name]=e.target.files[0];
        }else{
            state[e.target.name]=e.target.value;
        }
        setState({...state});
    }

   async function imageAction(action){
           document.getElementById("banner-result-display").style.display="none";
           document.getElementById("add-banner-btn").disabled=true;
           try{
            if(action==="add"){
                const formData = new FormData();
                const imageInfo={};
                // Update the formData object
                formData.append(
                    "image",
                    state.image,
                    state.image.name
                );

                imageInfo.name=state.name;
                imageInfo.ord=state.ord;

                formData.append("imageInfo",JSON.stringify(imageInfo));

                await fetch(properties.remoteServer+"/admin/api/banners",{
                    method:"POST",
                    body:formData,
                    credentials: "include",
                    headers: {
                        'csrfToken':credential
                    }
                }).then(res=>res.json()).then(json=>{
                    const resultContainer=document.getElementById("banner-result-display");
                    const resultContent=document.getElementById("banner-result-content");
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
                let inputData={
                    ord:state.ord
                }
                
                await fetch(properties.remoteServer+"/admin/api/banners/"+imageId,{
                    method:"PUT",
                    body:JSON.stringify(inputData),
                    credentials: "include",
                    headers: {
                    'Content-Type': 
                    'application/json;charset=utf-8',
                    'csrfToken':credential
                    }
                }).then(res=>res.json()).then(json=>{
                    const resultContainer=document.getElementById("banner-result-display");
                    const resultContent=document.getElementById("banner-result-content");
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
        document.getElementById("add-banner-btn").disabled=false;
   }

   function renderForm(){
        if(action!==undefined){
            if(action==="Add"){
                return(
                    <div className="general-container">
                        <div className="general-heading">Add Banner</div>

                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Banner Name</div>
                            <input className="form-control" type="text" name="name" value={state.name} onChange={handleChange}/>
                        </div>
                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Order</div>
                            <input className="form-control" type="number" name="ord" value={state.ord} onChange={handleChange}/>
                        </div>
                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Upload Image</div>
                            <input className="form-control" type="file" name="image" onChange={handleChange}/>
                        </div>
    
                        <div className="container-align-center">
                            <input type={"button"} className="general-btn-style"  id="add-banner-btn" onClick={()=>{imageAction("add")}}  value="Add"/>
                        </div>
    
                    </div>
                )
            }else if(action==="Edit"){
                return(
                    <div className="general-container">
                        <div className="general-heading">Edit Banner</div>

                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Order</div>
                            <input className="form-control" type="number" name="ord" value={state.ord} onChange={handleChange}/>
                        </div>
    
                        <div className="container-align-center">
                            <input type={"button"} className="general-btn-style"  id="add-banner-btn" onClick={()=>{imageAction("edit")}}  value="Edit"/>
                        </div>
    
                    </div>
                )
            }
        }
   }

   return(
      <>
        <h3 style={{textAlign:"center",padding:20,color:"maroon"}}>{action} Banner</h3>
        <div className="container-align-center">
            <div className="result-container" id="banner-result-display"><h6 style={{textAlign:"center"}} id="banner-result-content"> </h6></div>
        </div>
        <div className="container-align-center">
            {renderForm()}
        </div>
      </>
   )
}

export default ActionBanner;