import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import properties from "../properties/properties.json";
import "../admin-styles/general.css";
import { UserContext } from "../App";

function ActionSize(props){
   const [action,setAction]=useState();
   const {id,sizeId}=useParams();
   const [state,setState]=useState({sizeId:0,name:"",description:"",order:0,product:{productId:id}});
   const productName=useLocation().state;
   const {credential}=useContext(UserContext);

   useEffect(()=>{

       document.getElementById("size-result-display").style.display="none";

       if(props.operation==="add"){
            setAction("Add");
       }else if(props.operation==="edit"){
            
            fetch(properties.remoteServer+"/admin/api/sizes/"+sizeId,{
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
                    setState({sizeId:json.content.sizeId,name:json.content.name,order:json.content.order,
                        product:json.content.product,description:json.content.description});
                }
            }
            )
        }
       

   },[sizeId])

   function handleChange(e){
        state[e.target.name]=e.target.value;
        setState({...state});
   }

   async function sizeAction(action){
           let inputData=JSON.stringify(state);
           document.getElementById("add-size-btn").disabled=true;
           try{
            if(action==="add"){
                delete inputData["sizeId"];
                console.log(inputData)
                await fetch(properties.remoteServer+"/admin/api/sizes",{
                    method:"POST",
                    body:inputData,
                    credentials: "include",
                    headers: {
                    'Content-Type': 
                    'application/json;charset=utf-8',
                    'csrfToken':credential
                    
                    }
                }).then(res=>res.json()).then(json=>{
                    const resultContainer=document.getElementById("size-result-display");
                    const resultContent=document.getElementById("size-result-content");
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
                await fetch(properties.remoteServer+"/admin/api/sizes",{
                    method:"PUT",
                    body:inputData,
                    credentials: "include",
                    headers: {
                    'Content-Type': 
                    'application/json;charset=utf-8',
                    'csrfToken':credential
                    
                    }
                }).then(res=>res.json()).then(json=>{
                    const resultContainer=document.getElementById("size-result-display");
                    const resultContent=document.getElementById("size-result-content");
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
        document.getElementById("add-size-btn").disabled=false;
   }

   function renderForm(){
        if(action!==undefined){
            if(action==="Add"){
                return(
                    <div className="general-container">
                        <div className="general-heading">Add Size</div>
                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Size Name</div>
                            <input className="form-control" type={"text"} name="name" value={state.name} onChange={handleChange}/>
                        </div>
                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Order</div>
                            <input className="form-control" type={"number"} name="order" value={state.order} onChange={handleChange}/>
                        </div>
                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Description</div>
                            <input className="form-control" type={"text"} name="description" value={state.description} onChange={handleChange}/>
                        </div>
                        <div className="container-align-center">
                            <input type={"button"} className="general-btn-style"  id="add-size-btn" onClick={()=>{sizeAction("add")}}  value=" Add "/>
                        </div>
    
                    </div>
                )
            }else if(action==="Edit"){
                return(
                    <div className="general-container">
                    <div className="general-heading">Edit Size</div>
                    <div style={{paddingTop: 10}}>
                        <div className="general-input-name">Size Name</div>
                        <input className="form-control" type={"text"} name="name" value={state.name} onChange={handleChange}/>
                    </div>
                    <div style={{paddingTop: 10}}>
                        <div className="general-input-name">Order</div>
                        <input className="form-control" type={"number"} name="order" value={state.order} onChange={handleChange}/>
                    </div>
                    <div style={{paddingTop: 10}}>
                        <div className="general-input-name">Description</div>
                        <input className="form-control" type={"text"} name="description" value={state.description} onChange={handleChange}/>
                    </div>
                    <div className="container-align-center">
                        <input type={"button"} className="general-btn-style"  id="add-size-btn" onClick={()=>{sizeAction("edit")}}  value=" Edit "/>
                    </div>

                </div>
                )
            }
        }
   }

   return(
      <>
        <h3 style={{textAlign:"center",padding:20,color:"maroon"}}>{action} Size for {productName}</h3>
        <div className="container-align-center">
            <div className="result-container" id="size-result-display"><h6 style={{textAlign:"center"}} id="size-result-content"> </h6></div>
        </div>
        <div className="container-align-center">
            {renderForm()}
        </div>
      </>
   )
}

export default ActionSize;