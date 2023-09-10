import {useContext, useEffect, useState } from "react";
import properties from "../properties/properties.json";
import "../admin-styles/general.css";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";


function Color(){
    const [colors,setColors]=useState([]);
    const navigate=useNavigate();
    const {credential,user,logged}=useContext(UserContext);
    const [stack,setStack]=useState([]);
    const [filter,setFilter]=useState({filterBy:"name",filterValue:""});
    const [applyFilter,setApplyFilter]=useState(false);

    useEffect(()=>{
        if(!logged || user.roleid!==2){
            navigate("/",{replace:true});
            return;
        }
        fetchColors();
    },[applyFilter])

    function fetchColors(){
        let getInfo={
            range:10
         }

         if(stack.length>0){
            getInfo.paginationKey=stack[stack.length-1];
         }

         
         if(applyFilter && getInfo.filterBy!=="" && getInfo.filterValue!==""){
            getInfo.filterBy=filter.filterBy;
            getInfo.filterValue=filter.filterValue;
        }

         fetch(properties.remoteServer+"/admin/api/colors/list",{
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
                  setColors(json.content);
                }
            }
         )
    }

    function getColors(option){
        if(option==="next"){
            if(colors.length>0){
                stack.push(colors[colors.length-1].colorId);
                setStack(stack);
                fetchColors();
            }
        }else if(option==="prev"){
            stack.pop();
            setStack(stack);
            fetchColors();
        }

    }

    function handleKeyPress(e){
        if (e.keyCode === 13) {
            setStack([]);
            if(!applyFilter){
               setApplyFilter(true); 
            }else{
                fetchColors();
            }
        }
   }

   function handleChange(e){
       
    filter[e.target.name]=e.target.value;
    setFilter({...filter});

   }

   function refreshContainer(){
    setStack([]);
    setApplyFilter(false);
    }

    function renderColors(){
        
         return(
            colors.map(color=>{
                return(
                    <tr key={color.colorId}>
                        <td>{color.colorId}</td>
                        <td>{color.name}</td>
                        <td>{color.cssColor}</td>
                        <td style={{backgroundColor:color.cssColor,width:50}}></td>
                        <td>  
                             <Link to={"/admin/hack/color/"+color.colorId+"/edit"} className="link-style">Edit</Link>
                        </td>
                    </tr>
                )
            })
         )
    }


    return(
           <>
              <h3 style={{textAlign:"center",padding:20,color:"maroon"}}>Colors</h3>
              <div style={{margin:20,display:"flex"}}>
                 <input type={"search"} style={{marginLeft:10}} onKeyUp={handleKeyPress} onChange={handleChange}  name="filterValue"  placeholder="Search"/>
             </div>
              <div style={{margin:20}}>
                        <input type={"button"} className="general-btn-style" style={{marginRight:10}}  onClick={()=>{navigate("/admin/hack/color/add")}}  value=" New "/>
                        <input type={"button"} className="general-btn-style" style={{marginRight:10}}  onClick={()=>{getColors("prev")}}  value=" Prev "/>
                        <input type={"button"} className="general-btn-style" style={{marginRight:10}}  onClick={()=>{getColors("next")}}  value=" Next "/>
                        <input type={"button"} className="general-btn-style"  onClick={refreshContainer}  value=" Refresh "/>
              </div>
              <table className="table" style={{margin:20}}>
                <thead>
                    <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Name</th>
                    <th scope="col">CSS Color</th>
                    <th scope="col">color</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                     {renderColors()}
                </tbody>
                </table>

           </>
    );
}

export default Color;