import { useContext, useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import properties from "../properties/properties.json";
import "../admin-styles/general.css";
import { UserContext } from "../App";
import AsyncSelect from "react-select/async";
import Select from "react-select";

function ActionVariant(props){
 
   const [action,setAction]=useState();
   const {id,variantId}=useParams();
   const [state,setState]=useState({variantId:0,name:"",price:"",item:{productItemId:id},color:{},isCOD:false});
   const {credential,user,logged}=useContext(UserContext);
   const navigate=useNavigate(); 
   const optionsForCOD=[{value:true,label:"Available"},{value:false,label:"Not Available"}];

   useEffect(()=>{
    if(!logged || user.roleid!==2){
        navigate("/",{replace:true});
        return;
    }
    const preApiCalls=async ()=>{

            document.getElementById("variant-result-display").style.display="none";

            if(props.operation==="add"){
                setAction("Add");
            }else if(props.operation==="edit"){
                
                await fetch(properties.remoteServer+"/admin/api/variants/"+variantId,{
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
                            setState({variantId:json.content.variantId,name:json.content.name,
                            price:json.content.price,item:{productItemId:id},color:json.content.color,isCOD:json.content.isCOD});
                        }
                    }
                )
            }
            

           
     }

     preApiCalls();
   },[])

   
   function handleColorSelect(SelectedOption){
         state.color={colorId:SelectedOption.value};
         setState({...state});
   }

   async function loadOptions(inputValue){
    const response= await fetch(properties.remoteServer+"/admin/api/colors/search?name="+inputValue,{
        credentials: "include",
        headers: {
            'csrfToken':credential
        }
    })
    
    const json=await response.json();
    let colors=[];
    for(let i=0;i<json.content.length;i++){
        colors.push({value:json.content[i].colorId,label:json.content[i].name});
    }

    return new Promise((resolve)=>{
        resolve(colors);
    })
   
  };

   

   function handleChange(e){
       
      state[e.target.name]=e.target.value;
      setState({...state});
      console.log(state);
       
   }

   async function VariantAction(action){
           let inputData=JSON.stringify(state);
           document.getElementById("add-variant-btn").disabled=true;
           
           try{

            if(action==="add"){
                delete inputData["variantId"];
                console.log(inputData)
                await fetch(properties.remoteServer+"/admin/api/variants",{
                    credentials: "include",
                    method:"POST",
                    body:inputData,
                    headers: {
                    'Content-Type': 
                    'application/json;charset=utf-8',
                    'csrfToken':credential
                    
                    }
                }).then(res=>res.json()).then(json=>{
                    const resultContainer=document.getElementById("variant-result-display");
                    const resultContent=document.getElementById("variant-result-content");
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
                await fetch(properties.remoteServer+"/admin/api/variants",{
                    method:"PUT",
                    body:inputData,
                    credentials: "include",
                    headers: {
                    'Content-Type': 
                    'application/json;charset=utf-8',
                    'csrfToken':credential
                    
                    }
                }).then(res=>res.json()).then(json=>{
                    const resultContainer=document.getElementById("variant-result-display");
                    const resultContent=document.getElementById("variant-result-content");
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

        document.getElementById("add-variant-btn").disabled=false;
   }

   function getDefaultValue(){
      return {value:state.color.colorId,label:state.color.name};
   }

   function handleCODSelect(SelectedOption){
    state.isCOD=SelectedOption.value
    setState({...state});
 }

 function getDefaultCODOption(){
   
  for(let i=0;i<optionsForCOD.length;i++){
       if(optionsForCOD[i].value===state.isCOD){
           return optionsForCOD[i];
       }
  }
}

   function renderForm(){
        if(action!==undefined){
            if(action==="Add"){
            
                return(
                    <div className="general-container">
                        <div className="general-heading">Add Variant</div>
                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Variant Name</div>
                            <input className="form-control" type={"text"} name="name" value={state.name} onChange={handleChange}/>
                        </div>
                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Color</div>
                            <AsyncSelect  loadOptions={loadOptions} onChange={handleColorSelect}/>
                        </div>
                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Price</div>
                            <input className="form-control" type={"number"} name="price" value={state.price} onChange={handleChange}/>
                        </div>
                        <div className="container-align-center">
                            <input type={"button"} className="general-btn-style"  id="add-variant-btn" onClick={()=>{VariantAction("add")}}  value=" Add "/>
                        </div>
    
                    </div>
                )
            }else if(action==="Edit"){
             
                return(
                    <div className="general-container">
                        <div className="general-heading">Edit Variant</div>
                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Variant Name</div>
                            <input className="form-control" type={"text"} name="name" value={state.name} onChange={handleChange}/>
                        </div>
                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Color</div>
                            <AsyncSelect  loadOptions={loadOptions} onChange={handleColorSelect} defaultValue={getDefaultValue}/>
                        </div>
                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Price</div>
                            <input className="form-control" type={"number"} name="price" value={state.price} onChange={handleChange}/>
                        </div>
                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">COD</div>
                            <Select options={optionsForCOD} onChange={handleCODSelect} defaultValue={getDefaultCODOption}/>
                        </div>
                        <div className="container-align-center">
                            <input type={"button"} className="general-btn-style"  id="add-variant-btn" onClick={()=>{VariantAction("edit")}}  value=" Edit "/>
                        </div>
    
                    </div>
                )
            }
        }
   }

   return(
      <>
        <h3 style={{textAlign:"center",padding:20,color:"maroon"}}>{action} Variant</h3>
        <div className="container-align-center">
            <div className="result-container" id="variant-result-display"><h6 style={{textAlign:"center"}} id="variant-result-content"> </h6></div>
        </div>
        <div className="container-align-center">
            {renderForm()}
        </div>
      </>
   )
}

export default ActionVariant;