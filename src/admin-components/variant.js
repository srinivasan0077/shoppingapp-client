import {useContext, useEffect, useState } from "react";
import properties from "../properties/properties.json";
import "../admin-styles/general.css";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../App";

function Variant(){
    const {credential}=useContext(UserContext);
    const [variants,setVariants]=useState([]);
    const navigate=useNavigate();
    const [stack,setStack]=useState([]);
    const {id}=useParams();
    const [item,setItem]=useState({productItemId:0,productItemName:"",description:"",product:{}})

    useEffect(()=>{
        
        fetch(properties.remoteServer+"/admin/api/items/"+id,{
            credentials: "include",
            headers: {
                'csrfToken':credential
            }
        }).then(
            (stream)=>stream.json()
        ).then(
            (json)=>{
                if(json.status===2000){
                    setItem(json.content);
                }
            }
        )
       

        fetchVariants();
    },[])

    console.log(stack)

    function fetchVariants(){
         let getInfo={
            range:10
         }
         
         if(stack.length>0){
            getInfo.paginationKey=stack[stack.length-1];
         }

         fetch(properties.remoteServer+"/admin/api/items/"+id+"/variants/list",{
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

    function toggleVariant(variantId){
        fetch(properties.remoteServer+"/admin/api/variants/"+variantId+"/toggle",{
            credentials: "include",
            headers: {
                'csrfToken':credential
            }
          }).then(
            (stream)=>stream.json()
         ).then(
            (json)=>{
                if(json.status===2000){
                    fetchVariants();
                }else{
                    alert(json.message);
                }
            }
         )
    }

    function renderVariants(){
        
         return(
            variants.map((variant)=>{
                return(
                    <tr key={variant.variantId} style={{backgroundColor:variant.isActive?"lightgreen":"white"}}>
                        <td>{variant.variantId}</td>
                        <td>{variant.name}</td>
                        <td>{variant.color.name}</td>
                        <td>{variant.price}</td>
                        <td>  
                             <Link to={"/admin/hack/item/"+id+"/variant/"+variant.variantId+"/edit"} className="link-style">Edit</Link>
                             <Link to={"/admin/hack/item/"+id+"/variant/"+variant.variantId+"/image"} className="link-style">Images</Link>
                             <Link to={"/admin/hack/item/"+id+"/variant/"+variant.variantId+"/inventory"} className="link-style">Inventory</Link>
                             <Link onClick={()=>toggleVariant(variant.variantId)}  className="link-style">{variant.isActive?"Deactivate":"Activate"}</Link>
                        </td>
                    </tr>
                )
            })
         )
    }


    return(
           <>
              <h3 style={{textAlign:"center",padding:20,color:"maroon"}}>Variants for {item.productItemName}</h3>
              <div style={{margin:20}}>
                        <input type={"button"} className="general-btn-style" style={{marginRight:10}}  onClick={()=>{navigate("/admin/hack/item/"+id+"/variant/add")}}  value=" New "/>
                        <input type={"button"} className="general-btn-style" style={{marginRight:10}}  onClick={()=>{getVariants("prev")}}  value=" Prev "/>
                        <input type={"button"} className="general-btn-style"  onClick={()=>{getVariants("next")}}  value=" Next "/>
              </div>
              <table className="table" style={{margin:20}}>
                <thead>
                    <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Name</th>
                    <th scope="col">Color</th>
                    <th scope="col">Price</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                     {renderVariants()}
                </tbody>
                </table>

           </>
    );
}

export default Variant;