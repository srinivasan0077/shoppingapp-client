import { useContext, useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import properties from "../properties/properties.json";
import "../admin-styles/general.css";
import Select from "react-select";
import { UserContext } from "../App";

function ActionInventory(props){

   const [action,setAction]=useState();
   const {variantId,inventoryId}=useParams();
   const [variant,setVariant]=useState({});
   const [state,setState]=useState({inventoryId:"",size:{},variant:{variantId:variantId},availableStocks:""});
   const [options,setOptions]=useState([]);
   const {credential,user,logged}=useContext(UserContext);
   const navigate=useNavigate();

   useEffect(()=>{
    if(!logged || user.roleid!==2){
        navigate("/",{replace:true});
        return;
    }

    const preApiCalls=async ()=>{
            document.getElementById("inventory-result-display").style.display="none";
            var localVariant;

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
                        localVariant=json.content;
                        setVariant(json.content);
                    }
                }
            )
            
            await fetch(properties.remoteServer+"/admin/api/items/"+localVariant.item.productItemId,{
                credentials: "include",
                headers: {
                    'csrfToken':credential
                }
            }).then(
                (stream)=>stream.json()
            ).then(
                async (json)=>{
                    if(json.status===2000){
                        await fetch(properties.remoteServer+"/admin/api/products/"+json.content.product.productId+"/sizes",{
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
                                            newOptions.push({value:json.content[i].sizeId,label:json.content[i].name});
                                            setOptions(newOptions);
                                        }
                                    }
                                }
                            }
                        )
                    }
                }
            )

            if(props.operation==="add"){
                setAction("Add");
            }else if(props.operation==="edit"){

                fetch(properties.remoteServer+"/admin/api/inventories/"+inventoryId,{
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
                            json.content.variant={variantId:variantId};
                            setState(json.content);
                        }
                    }
                    )
            }
            
        }

        preApiCalls();
    },[])

    function handleSizeSelect(SelectedOption){
        state.size={sizeId:SelectedOption.value}
        setState({...state});
    }

    function handleChange(e){
        
        state[e.target.name]=e.target.value;
        setState({...state});
        console.log(state);
        
    }


   async function InventoryAction(action){
           let inputData={...state};
           document.getElementById("add-inventory-btn").disabled=true;

           try{
            if(action==="add"){
                delete inputData["inventoryId"];
                console.log(inputData)
                await fetch(properties.remoteServer+"/admin/api/inventories",{
                    credentials: "include",
                    method:"POST",
                    body:JSON.stringify(inputData),
                    headers: {
                    'Content-Type': 
                    'application/json;charset=utf-8',
                    'csrfToken':credential
                    }
                }).then(res=>res.json()).then(json=>{
                    const resultContainer=document.getElementById("inventory-result-display");
                    const resultContent=document.getElementById("inventory-result-content");
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
                await fetch(properties.remoteServer+"/admin/api/inventories",{
                    credentials: "include",
                    method:"PUT",
                    body:JSON.stringify(inputData),
                    headers: {
                    'Content-Type': 
                    'application/json;charset=utf-8',
                    'csrfToken':credential
                    }
                }).then(res=>res.json()).then(json=>{
                    const resultContainer=document.getElementById("inventory-result-display");
                    const resultContent=document.getElementById("inventory-result-content");
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
        document.getElementById("add-inventory-btn").disabled=false;
   }

   function renderForm(){
        if(action!==undefined){
            if(action==="Add"){
                return(
                    <div className="general-container">
                        <div className="general-heading">Add Inventory</div>

                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Size</div>
                            <Select options={options} onChange={handleSizeSelect}/>
                        </div>
                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Inventory</div>
                            <input className="form-control" type="number" name="availableStocks" value={state.availableStocks} onChange={handleChange}/>
                        </div>
    
                        <div className="container-align-center">
                            <input type={"button"} className="general-btn-style"  id="add-inventory-btn" onClick={()=>{InventoryAction("add")}}  value="Add"/>
                        </div>
    
                    </div>
                )
            }else if(action==="Edit"){
                return(
                    <div className="general-container">
                        <div className="general-heading">Edit Inventory</div>

                        <div style={{paddingTop: 10}}>
                            <div className="general-input-name">Inventory</div>
                            <input className="form-control" type="number" name="availableStocks" value={state.availableStocks} onChange={handleChange}/>
                        </div>
    
                        <div className="container-align-center">
                            <input type={"button"} className="general-btn-style"  id="add-inventory-btn" onClick={()=>{InventoryAction("edit")}}  value="Edit"/>
                        </div>
    
                    </div>
                )
            }
        }
   }

   return(
      <>
        <h3 style={{textAlign:"center",padding:20,color:"maroon"}}>{action} inventories for variant {variant.name}</h3>
        <div className="container-align-center">
            <div className="result-container" id="inventory-result-display"><h6 style={{textAlign:"center"}} id="inventory-result-content"> </h6></div>
        </div>
        <div className="container-align-center">
            {renderForm()}
        </div>
      </>
   )
}

export default ActionInventory;