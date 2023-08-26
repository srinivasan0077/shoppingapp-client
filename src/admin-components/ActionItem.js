import { useContext, useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import properties from "../properties/properties.json";
import "../admin-styles/general.css";
import Select from "react-select";
import { UserContext } from "../App";

function ActionItem(props){
 
   const [action,setAction]=useState();
   const {id}=useParams();
   const [state,setState]=useState({productItemId:0,productItemName:"",description:"",product:{}})
   const [options,setOptions]=useState([]);
   const {credential}=useContext(UserContext);

   useEffect(()=>{
    const preApiCalls=async ()=>{

            document.getElementById("item-result-display").style.display="none";

            await fetch(properties.remoteServer+"/admin/api/products",{
                credentials: "include",
                headers: {
                    'csrfToken':credential
                }
              }).then(
                (stream)=>stream.json()
             ).then(
                (json)=>{
                    var newOptions=[]
                    if(json.status===2000){
                        if(json.content.length!==undefined){
                            for(var i=0;i<json.content.length;i++){
                                newOptions.push({value:json.content[i].productId,label:json.content[i].productName});
                                setOptions(newOptions);
                            }
                        }
                    }
                }
             )

            
            if(props.operation==="add"){
                setAction("Add");
            }else if(props.operation==="edit"){
                
                await fetch(properties.remoteServer+"/admin/api/items/"+id,{
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
                            setState({productItemId:json.content.productItemId,productItemName:json.content.productItemName,product:json.content.product,description:json.content.description});
                        }
                    }
                )
            }
            

           
     }

     preApiCalls();
   },[])
   
   function handleProductSelect(SelectedOption){
         state.product={productId:SelectedOption.value};
         setState({...state});
   }

   function handleChange(e){
       
      state[e.target.name]=e.target.value;
      setState({...state});
      console.log(state);
       
   }

   async function ItemAction(action){
           let inputData=JSON.stringify(state);
           document.getElementById("add-item-btn").disabled=true;
           
           try{

            if(action==="add"){
                delete inputData["productItemId"];
                console.log(inputData)
                await fetch(properties.remoteServer+"/admin/api/items",{
                    credentials: "include",
                    method:"POST",
                    body:inputData,
                    headers: {
                    'Content-Type': 
                    'application/json;charset=utf-8',
                    'csrfToken':credential
                    }
                }).then(res=>res.json()).then(json=>{
                    const resultContainer=document.getElementById("item-result-display");
                    const resultContent=document.getElementById("item-result-content");
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
                await fetch(properties.remoteServer+"/admin/api/items",{
                    method:"PUT",
                    body:inputData,
                    credentials: "include",
                    headers: {
                    'Content-Type': 
                    'application/json;charset=utf-8',
                    'csrfToken':credential
                    }
                }).then(res=>res.json()).then(json=>{
                    const resultContainer=document.getElementById("item-result-display");
                    const resultContent=document.getElementById("item-result-content");
                    console.log(json)
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

        document.getElementById("add-item-btn").disabled=false;
   }

   function getDefaultValue(){
     
      for(let i=0;i<options.length;i++){
           if(options[i].value===state.product.productId){
               return options[i];
           }
      }
   }

   function renderForm(){
        if(action!==undefined){
            if(action==="Add"){
                console.log(options)
                return(
                    <div className="general-container">
                        <div className="general-heading">Add Item</div>
                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Item Name</div>
                            <input className="form-control" type={"text"} name="productItemName" value={state.productItemName} onChange={handleChange}/>
                        </div>
                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Product</div>
                            <Select options={options} onChange={handleProductSelect}/>
                        </div>
                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Description</div>
                            <input className="form-control" type={"text"} name="description" value={state.description} onChange={handleChange}/>
                        </div>
                        <div className="container-align-center">
                            <input type={"button"} className="general-btn-style"  id="add-item-btn" onClick={()=>{ItemAction("add")}}  value="Add"/>
                        </div>
    
                    </div>
                )
            }else if(action==="Edit"){
             
                return(
                    <div className="general-container">
                    <div className="general-heading">Edit Item</div>
                    <div style={{paddingTop: 10}}>
                        <div className="general-input-name">Item Name</div>
                        <input className="form-control" type={"text"} name="productItemName" value={state.productItemName} onChange={handleChange}/>
                    </div>
                    <div style={{paddingTop: 10}}>
                        <div className="general-input-name">Product</div>
                        <Select options={options} onChange={handleProductSelect} defaultValue={getDefaultValue()}/>
                    </div>
                    <div style={{paddingTop: 10}}>
                        <div className="general-input-name">Description</div>
                        <input className="form-control" type={"text"} name="description" value={state.description} onChange={handleChange}/>
                    </div>
                    <div className="container-align-center">
                        <input type={"button"} className="general-btn-style"  id="add-item-btn" onClick={()=>{ItemAction("edit")}}  value="Edit"/>
                    </div>

                </div>
                )
            }
        }
   }

   return(
      <>
        <h3 style={{textAlign:"center",padding:20,color:"maroon"}}>{action} Item</h3>
        <div className="container-align-center">
            <div className="result-container" id="item-result-display"><h6 style={{textAlign:"center"}} id="item-result-content"> </h6></div>
        </div>
        <div className="container-align-center">
            {renderForm()}
        </div>
      </>
   )
}

export default ActionItem;