import {useContext, useEffect, useState } from "react";
import properties from "../properties/properties.json";
import "../admin-styles/general.css";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { UserContext } from "../App";

function Item(){
    const [items,setItems]=useState([]);
    const [filter,setFilter]=useState({filterBy:"productItemId",filterValue:""});
    const options=[{value:"productItemId",label:"Item Id"},{value:"productItemName",label:"Item Name"},{value:"product",label:"product Id"}]
    const navigate=useNavigate();
    const [stack,setStack]=useState([]);
    const [applyFilter,setApplyFilter]=useState(false);
    const {credential}=useContext(UserContext);


    useEffect(()=>{
        fetchItems();
    },[applyFilter])

    function fetchItems(freshApiCall){
         let getInfo={
            range:10
         }

         if(applyFilter && getInfo.filterBy!=="" && getInfo.filterValue!==""){
              getInfo.filterBy=filter.filterBy;
              getInfo.filterValue=filter.filterValue;
         }

         if(stack.length>0 &&  (freshApiCall===undefined || freshApiCall===false)){
            getInfo.paginationKey=stack[stack.length-1];
         }

         fetch(properties.remoteServer+"/admin/api/items/list",{
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
                    setItems(json.content);
                }
            }
         )
    }

    function getItems(option){
          if(option==="next"){
              if(items.length>0){
                  stack.push(items[items.length-1].productItemId);
                  setStack(stack);
                  fetchItems();
              }
          }else if(option==="prev"){
              stack.pop();
              setStack(stack);
              fetchItems();
          }

    }

    function toggleItem(itemId){
        fetch(properties.remoteServer+"/admin/api/items/"+itemId+"/toggle",{
            credentials: "include",
            headers: {
                'csrfToken':credential
            }
          }).then(
            (stream)=>stream.json()
         ).then(
            (json)=>{
                if(json.status===2000){
                    fetchItems();
                }else{
                    alert(json.message);
                }
            }
         )
    }

    function handleKeyPress(e){
        if (e.keyCode === 13) {
            setStack([]);
            if(!applyFilter){
               setApplyFilter(true); 
            }else{
                fetchItems(true);
            }
        }
   }

   function handleChange(e){
       
    filter[e.target.name]=e.target.value;
    setFilter({...filter});

   }

   function handleFieldSelect(SelectedOption){
    filter.filterBy=SelectedOption.value;
    setFilter({...filter});
   }

   function refreshContainer(){
       setStack([]);
       setApplyFilter(false);
   }

    function renderItems(){
    
         return(
            items.map((item)=>{
                return(
                    <tr key={item.productItemId} style={{backgroundColor:item.isActive?"lightgreen":"white"}}>
                        <td>{item.productItemId}</td>
                        <td>{item.productItemName}</td>
                        <td>{item.product.productName}</td>
                        <td>{item.description}</td>
                        <td>  
                             <Link to={"/admin/hack/item/"+item.productItemId+"/edit"} className="link-style">Edit</Link>
                             <Link to={"/admin/hack/item/"+item.productItemId+"/variant"} state={item.productItemName} className="link-style">Variants</Link>
                             <Link onClick={()=>toggleItem(item.productItemId)} state={item.productItemName} className="link-style">{item.isActive?"Deactivate":"Activate"}</Link>
                        </td>
                    </tr>
                )
            })
         )
    }


    return(
           <>
              <h3 style={{textAlign:"center",padding:20,color:"maroon"}}>Items</h3>
              <div style={{margin:20,display:"flex"}}>
                 <Select options={options} className="general-select-style"  onChange={handleFieldSelect} defaultValue={options[0]}/>
                 <input type={"search"} style={{marginLeft:10}} onKeyUp={handleKeyPress} onChange={handleChange}  name="filterValue"  placeholder="Search"/>
             </div>
              <div style={{margin:20}}>
                        <input type={"button"} className="general-btn-style" style={{marginRight:10}}  onClick={()=>{navigate("/admin/hack/item/add")}}  value=" New "/>
                        <input type={"button"} className="general-btn-style" style={{marginRight:10}}  onClick={()=>{getItems("prev")}}  value=" Prev "/>
                        <input type={"button"} className="general-btn-style" style={{marginRight:10}}  onClick={()=>{getItems("next")}}  value=" Next "/>
                        <input type={"button"} className="general-btn-style"  onClick={refreshContainer}  value=" Refresh "/>
              </div>
              <table className="table" style={{margin:20}}>
                <thead>
                    <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Name</th>
                    <th scope="col">Product Type</th>
                    <th scope="col">Description</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                     {renderItems()}
                </tbody>
                </table>

           </>
    );
}

export default Item;