import {useContext, useEffect, useState } from "react";
import properties from "../properties/properties.json";
import "../admin-styles/general.css";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";

function Product(){
    const [products,setProducts]=useState([]);
    const navigate=useNavigate();
    const {credential}=useContext(UserContext);

    useEffect(()=>{
        fetchProducts();
    },[])

    function fetchProducts(){
         fetch(properties.remoteServer+"/admin/api/products",{
            credentials: "include",
            headers: {
                'csrfToken':credential
            }
          }).then(
            (stream)=>stream.json()
         ).then(
            (json)=>{
                  if(json.status===2000){
                       setProducts(json.content);
                  }
            }
         )
    }

    function renderProducts(){
        
            return(
                products.map(product=>{
                    return(
                        <tr key={product.productId} style={{backgroundColor:product.isHeader?"lightgreen":"white"}}>
                            <td>{product.productId}</td>
                            <td>{product.productName}</td>
                            <td>{product.productType.productTypeName}</td>
                            <td>{product.description}</td>
                            <td>  
                                <Link to={"/admin/hack/product/"+product.productId+"/edit"} className="link-style">Edit</Link>
                                <Link to={"/admin/hack/product/"+product.productId+"/size"} state={product.productName} className="link-style">Sizes</Link>
                            </td>
                        </tr>
                    )
                })
            )
        

    }


    return(
           <>
              <h3 style={{textAlign:"center",padding:20,color:"maroon"}}>Product</h3>
              <div style={{margin:20}}>
                        <input type={"button"} className="general-btn-style"  onClick={()=>{navigate("/admin/hack/product/add")}}  value=" New "/>
              </div>
              <table className="table" style={{margin:20}}>
                <thead>
                    <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Description</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                     {renderProducts()}
                </tbody>
                </table>

           </>
    );
}

export default Product;