import {useContext, useEffect, useState } from "react";
import properties from "../properties/properties.json";
import "../admin-styles/general.css";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";

function Category(){
    const [categories,setCategories]=useState([]);
    const navigate=useNavigate();
    const {credential,user,logged}=useContext(UserContext);

    useEffect(()=>{
        if(!logged || user.roleid!==2){
            navigate("/",{replace:true});
            return;
        }
        fetchCategories();
    },[])

    function fetchCategories(){
         fetch(properties.remoteServer+"/admin/api/categories",{
            credentials: "include",
            headers: {
                'csrfToken':credential
            }
          }).then(
            (stream)=>stream.json()
         ).then(
            (json)=>{
                if(json.status===2000){
                  setCategories(json.content);
                }
            }
         )
    }

    function renderCategories(){
        
         return(
            categories.map(category=>{
                return(
                    <tr key={category.productTypeId}>
                        <td>{category.productTypeId}</td>
                        <td>{category.productTypeName}</td>
                        <td>{category.description}</td>
                        <td>  
                             <Link to={"/admin/hack/category/"+category.productTypeId+"/edit"} className="link-style">Edit</Link>
                        </td>
                    </tr>
                )
            })
         )
    }


    return(
           <>
              <h3 style={{textAlign:"center",padding:20,color:"maroon"}}>Category</h3>
              <div style={{margin:20}}>
                        <input type={"button"} className="general-btn-style"  onClick={()=>{navigate("/admin/hack/category/add")}}  value=" New "/>
              </div>
              <table className="table" style={{margin:20}}>
                <thead>
                    <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                     {renderCategories()}
                </tbody>
                </table>

           </>
    );
}

export default Category;