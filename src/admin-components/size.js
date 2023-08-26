import {useEffect, useState,useContext } from "react";
import properties from "../properties/properties.json";
import "../admin-styles/general.css";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../App";

function Size(){
    const [sizes,setSizes]=useState([]);
    const navigate=useNavigate();
    const {id}=useParams();
    const productName=useLocation().state;
    const {credential}=useContext(UserContext);

    useEffect(()=>{
        fetchSizes();
    },[])

    function fetchSizes(){
         
         fetch(properties.remoteServer+"/admin/api/products/"+id+"/sizes",{
            credentials: "include",
            headers: {
                'csrfToken':credential
            }
          }).then(
            (stream)=>stream.json()
         ).then(
            (json)=>{
                if(json.status===2000){
                    setSizes(json.content);
                }
            }
         )
    }

    function renderSizes(){
        
         return(
            sizes.map(size=>{
                return(
                    <tr key={size.sizeId}>
                        <td>{size.sizeId}</td>
                        <td>{size.name}</td>
                        <td>{size.order}</td>
                        <td>{size.description}</td>
                        <td>  
                             <Link to={"/admin/hack/product/"+id+"/size/"+size.sizeId+"/edit"} state={productName} className="link-style">Edit</Link>
                        </td>
                    </tr>
                )
            })
         )
    }


    return(
           <>
              <h3 style={{textAlign:"center",padding:20,color:"maroon"}}>Sizes for {productName}</h3>
              <div style={{margin:20}}>
                        <input type={"button"} className="general-btn-style"  onClick={()=>{navigate("/admin/hack/product/"+id+"/size/add",{state:productName})}}  value=" New "/>
              </div>
              <table className="table" style={{margin:20}}>
                <thead>
                    <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Name</th>
                    <th scope="col">Order</th>
                    <th scope="col">Description</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                     {renderSizes()}
                </tbody>
                </table>

           </>
    );
}

export default Size;