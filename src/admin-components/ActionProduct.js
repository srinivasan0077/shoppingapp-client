import { useContext, useEffect, useState } from "react";
import {useParams,useNavigate } from "react-router-dom";
import properties from "../properties/properties.json";
import "../admin-styles/general.css";
import Select from "react-select";
import { UserContext } from "../App";

function ActionProduct(props){
 
   const [action,setAction]=useState();
   const {id}=useParams();
   const [state,setState]=useState({productId:0,productName:"",description:"",productType:{},isHeader:false})
   const [options,setOptions]=useState([]);
   const optionsForIsHeader=[{value:true,label:"true"},{value:false,label:"false"}];
   const {credential,user,logged}=useContext(UserContext);
   const navigate=useNavigate();

   useEffect(()=>{
    if(!logged || user.roleid!==2){
        navigate("/",{replace:true});
        return;
    }
    const preApiCalls=async ()=>{
            
            document.getElementById("product-result-display").style.display="none";

            await fetch(properties.remoteServer+"/admin/api/categories",{
                credentials: "include",
                headers: {
                    'csrfToken':credential
                }
              }).then(
                (stream)=>stream.json()
             ).then(
                (json)=>{
                    if(json.status===2000){
                        var newOptions=[]
                        if(json.content.length!==undefined){
                            for(var i=0;i<json.content.length;i++){
                                newOptions.push({value:json.content[i].productTypeId,label:json.content[i].productTypeName}); 
                            }
                            setOptions(newOptions);
                        }
                    }
                }
             )

        
            if(props.operation==="add"){
                setAction("Add");
            }else if(props.operation==="edit"){
                
                await fetch(properties.remoteServer+"/admin/api/products/"+id,{
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
            

           
     }

     preApiCalls();
   },[])
   
   function handleCategorySelect(SelectedOption){
         state.productType={productTypeId:SelectedOption.value}
         setState({...state});
   }

   function handleChange(e){
       
      state[e.target.name]=e.target.value;
      setState({...state});
      console.log(state);
       
   }

   async function productAction(action){
           let inputData=JSON.stringify(state);
           document.getElementById("add-product-btn").disabled=true;
           
           try{
            if(action==="add"){
                delete inputData["productId"];
                console.log(inputData)
                await fetch(properties.remoteServer+"/admin/api/products",{
                    credentials: "include",
                    method:"POST",
                    body:inputData,
                    headers: {
                    'Content-Type': 
                    'application/json;charset=utf-8',
                    'csrfToken':credential
                    }
                }).then(res=>res.json()).then(json=>{
                    const resultContainer=document.getElementById("product-result-display");
                    const resultContent=document.getElementById("product-result-content");
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
                await fetch(properties.remoteServer+"/admin/api/products",{
                    method:"PUT",
                    body:inputData,
                    credentials: "include",
                    headers: {
                    'Content-Type': 
                    'application/json;charset=utf-8',
                    'csrfToken':credential
                    }
                }).then(res=>res.json()).then(json=>{
                    const resultContainer=document.getElementById("product-result-display");
                    const resultContent=document.getElementById("product-result-content");
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
    
        document.getElementById("add-product-btn").disabled=false;
   }

   function getDefaultValue(){
     
      for(let i=0;i<options.length;i++){
           if(options[i].value===state.productType.productTypeId){
               return options[i];
           }
      }
   }

   function handleIsHeaderSelect(SelectedOption){
      state.isHeader=SelectedOption.value
      console.log(SelectedOption.value)
      setState({...state});
   }

   function getDefaultIsHeaderValue(){
     
    for(let i=0;i<optionsForIsHeader.length;i++){
         if(optionsForIsHeader[i].value===state.isHeader){
             return optionsForIsHeader[i];
         }
    }
 }

   function renderForm(){
        if(action!==undefined){
            if(action==="Add"){
            
                return(
                    <div className="general-container">
                        <div className="general-heading">Add Product</div>
                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Product Name</div>
                            <input className="form-control" type={"text"} name="productName" value={state.productName} onChange={handleChange}/>
                        </div>
                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Category</div>
                            <Select options={options} onChange={handleCategorySelect}/>
                        </div>
                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Description</div>
                            <input className="form-control" type={"text"} name="description" value={state.description} onChange={handleChange}/>
                        </div>
                        <div className="container-align-center">
                            <input type={"button"} className="general-btn-style"  id="add-product-btn" onClick={()=>{productAction("add")}}  value="Add"/>
                        </div>
    
                    </div>
                )
            }else if(action==="Edit"){
             
                return(
                    <div className="general-container">
                    <div className="general-heading">Edit Product</div>
                    <div style={{paddingTop: 10}}>
                        <div className="general-input-name">Product Name</div>
                        <input className="form-control" type={"text"} name="productName" value={state.productName} onChange={handleChange}/>
                    </div>
                    <div style={{paddingTop: 10}}>
                        <div className="general-input-name">Category</div>
                        <Select options={options} onChange={handleCategorySelect} defaultValue={getDefaultValue()}/>
                    </div>
                    <div style={{paddingTop: 10}}>
                        <div className="general-input-name">Description</div>
                        <input className="form-control" type={"text"} name="description" value={state.description} onChange={handleChange}/>
                    </div>
                    <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Is Header</div>
                            <Select options={optionsForIsHeader} onChange={handleIsHeaderSelect} defaultValue={getDefaultIsHeaderValue}/>
                    </div>
                    <div className="container-align-center">
                        <input type={"button"} className="general-btn-style"  id="add-product-btn" onClick={()=>{productAction("edit")}}  value="Edit"/>
                    </div>

                </div>
                )
            }
        }
   }

   return(
      <>
        <h3 style={{textAlign:"center",padding:20,color:"maroon"}}>{action} Product</h3>
        <div className="container-align-center">
            <div className="result-container" id="product-result-display"><h6 style={{textAlign:"center"}} id="product-result-content"> </h6></div>
        </div>
        <div className="container-align-center">
            {renderForm()}
        </div>
      </>
   )
}

export default ActionProduct;