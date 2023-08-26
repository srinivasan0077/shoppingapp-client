import {useContext, useEffect, useState } from "react";
import properties from "../properties/properties.json";
import "../admin-styles/general.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../App";

function Inventory(){
    const [inventories,setInventories]=useState([]);
    const [variant,setVariant]=useState({});
    const navigate=useNavigate();
    const {id,variantId}=useParams();
    const {credential}=useContext(UserContext);
    useEffect(()=>{
        fetchInventories();
    },[])


    function fetchInventories(){
         
        fetch(properties.remoteServer+"/admin/api/variants/"+variantId,{
            credentials: "include",
            headers: {
                'csrfToken':credential
            }
        }).then(
            (stream)=>stream.json()
        ).then(
            (json)=>{
                if(json.status===2000){
                    setVariant(json.content);
                }
            }
        )

         fetch(properties.remoteServer+"/admin/api/variants/"+variantId+"/inventories",{
            credentials: "include",
            headers: {
                'csrfToken':credential
            }
          }).then(
            (stream)=>stream.json()
         ).then(
            (json)=>{
                if(json.status===2000){
                    setInventories(json.content);
                }
            }
         )

    }
    
    function deleteInventory(id){

        fetch(properties.remoteServer+"/admin/api/inventories/"+id,{
            credentials: "include",
            method:"DELETE",
            headers: {
                'csrfToken':credential
            }
        }).then(
            (stream)=>stream.json()
        ).then(
            (json)=>{
                if(json.status===2000){

                    let filterdInventories=inventories.filter((inventory)=>{
                        return inventory.inventoryId!==id;
                    })
                    setInventories(filterdInventories);
                }else{
                    alert(json.message);
                }
            }
        )
    }


    function renderInventories(){
        
         return(
            inventories.map((inventory)=>{
                return(
                    <tr key={inventory.inventoryId}>
                        <td>{inventory.inventoryId}</td>
                        <td>{inventory.size.name}</td>
                        <td>{inventory.availableStocks}</td>
                        <td>            
                        <Link to={"/admin/hack/item/"+id+"/variant/"+variantId+"/inventory/"+inventory.inventoryId+"/edit"} className="link-style" >Edit</Link>
                        <Link  className="link-style" onClick={()=>{deleteInventory(inventory.inventoryId)}}>Delete</Link>
                        </td>
                    </tr>
                )
            })
         )
    }


    return(
           <>
              <h3 style={{textAlign:"center",padding:20,color:"maroon"}}>Inventories for {variant.name}</h3>
              <div style={{margin:20}}>
                  <input type={"button"} className="general-btn-style" style={{marginRight:10}}  onClick={()=>{navigate("/admin/hack/item/"+id+"/variant/"+variantId+"/inventory/add")}}  value=" New "/>
              </div>
              <table className="table" style={{margin:20}}>
                <thead>
                    <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Size</th>
                    <th scope="col">Available stocks</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                     {renderInventories()}
                </tbody>
                </table>
                
           </>
    );
}

export default Inventory;