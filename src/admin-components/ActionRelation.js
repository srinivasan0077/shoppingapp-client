import { useContext, useEffect, useState } from "react";
import { Link,useParams } from "react-router-dom";
import properties from "../properties/properties.json";
import "../admin-styles/general.css";
import Select from "react-select";
import { UserContext } from "../App";

function ActionRelation(props){
 

   const {topicId}=useParams();
   const [variants,setVariants]=useState([]);
   const [filter,setFilter]=useState({filterBy:"variantId",filterValue:""});
   const options=[{value:"variantId",label:"Variant Id"},{value:"name",label:"Variant Name"},{value:"item",label:"Item Id"}]
   const [stack,setStack]=useState([]);
   const [topic,setTopic]=useState({});
   const {credential}=useContext(UserContext);

   function handleFieldSelect(SelectedOption){
    filter.filterBy=SelectedOption.value;
    setFilter({...filter});
   }

   useEffect(()=>{
            fetch(properties.remoteServer+"/admin/api/topics/"+topicId,{
                credentials: "include",
                headers: {
                    'csrfToken':credential
                }
            }).then(
            (stream)=>stream.json()
            ).then(
            (json)=>{
                if(json.status===2000){
                    setTopic(json.content);
                }
            }
            )
   },[])

   async function addToTopic(variantId,link){
         
         if(link.target.disabled===false || link.target.disabled===undefined){
            let input={
                variantId:variantId,
                topicId:topicId
             }
            link.target.disabled=true;
            await fetch(properties.remoteServer+"/admin/api/topic_variant_relation",{
                credentials: "include",
                method:"POST",
                body:JSON.stringify(input),
                headers: {
                'Content-Type': 
                'application/json;charset=utf-8',
                'csrfToken':credential
                }
            }).then(res=>res.json()).then(json=>{
            
                if(json.status===2000){
                    alert(json.message);
                }else{
                    alert(json.message);
                }
            }) 
            link.target.disabled=false;
         }
        
   }

   function renderVariants(){
    return(
        variants.map((variant)=>{
            return(
                <tr key={variant.variantId} style={{backgroundColor:variant.item.isActive?"lightgreen":"white"}}>
                    <td>{variant.variantId}</td>
                    <td>{variant.name}</td>
                    <td>{variant.item.productItemName}</td>
                    <td>{variant.item.isActive?"Active":"InActive"}</td>
                    <td>  
                         <Link onClick={(e)=>{addToTopic(variant.variantId,e)}} className="link-style">Add to Topic</Link>

                    </td>
                </tr>
            )
        })
     )
   }

   function fetchVariants(freshApiCall){
    let getInfo={...filter};
    getInfo["range"]=10;
    if(stack.length>0 && (freshApiCall===undefined || freshApiCall===false)){
       getInfo["paginationKey"]=stack[stack.length-1];
    }

    fetch(properties.remoteServer+"/admin/api/variants/list",{
       method:"POST",
       credentials: "include",
       body:JSON.stringify(getInfo),
       headers: {
           'Content-Type': 
           'application/json;charset=utf-8',
            'csrfToken':credential
        
       }
     }).then(
       (stream)=>stream.json()
    ).then(
       (json)=>{
           if(json.status===2000){
               setVariants(json.content);
           }
       }
    )
}

function getVariants(option){
     if(option==="next"){
         if(variants.length>0){
             stack.push(variants[variants.length-1].variantId);
             setStack(stack);
             fetchVariants();
         }
     }else if(option==="prev"){
         stack.pop();
         setStack(stack);
         fetchVariants();
     }

}


   function handleKeyPress(e){
        if (e.keyCode === 13) {
            setStack([]);  
            fetchVariants(true);
        }
   }

   function handleChange(e){
       
    filter[e.target.name]=e.target.value;
    setFilter({...filter});

     }


   return(
    <>
    <h3 style={{textAlign:"center",padding:20,color:"maroon"}}>Add Relation under '{topic.name}'</h3>
    <div style={{margin:20,display:"flex"}}>
              <Select options={options} className="general-select-style"  onChange={handleFieldSelect} defaultValue={options[0]}/>
              <input type={"search"} style={{marginLeft:10}} onKeyUp={handleKeyPress} onChange={handleChange}  name="filterValue"  placeholder="Search"/>

    </div>
    <div style={{margin:20}}>
                        <input type={"button"} className="general-btn-style" style={{marginRight:10}}  onClick={()=>{getVariants("prev")}}  value=" Prev "/>
                        <input type={"button"} className="general-btn-style"  onClick={()=>{getVariants("next")}}  value=" Next "/>
    </div>

    <table className="table" style={{margin:20}}>
        <thead>
            <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Variant Name</th>
                    <th scope="col">Item Type</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
            </tr>
        </thead>
        <tbody>
             {renderVariants()}
        </tbody>
        </table>

 </>
   )
}

export default ActionRelation;