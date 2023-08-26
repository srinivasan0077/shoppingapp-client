import { Outlet, useNavigate } from "react-router-dom";
import "../admin-styles/admin-header.css";
import Logo from "../images/royall.png"
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";

function AdminHeader(){

    const {logged,user}=useContext(UserContext);
    const [render,setRender]=useState();
    const navigate=useNavigate();

    useEffect(()=>{
        if(!logged || user.roleid!==2){
            navigate("/",{replace:true});
        }else{
            setRender(true);
        }

    },[logged,user])

    function renderAdminComponents(){
        if(render){
            return (
                <>
                <div className="admin-header">
            
                        <div>
                            <img className="admin-img-style" src={Logo} alt="logo-img"/>
                        </div>
                        <div className="admin-nav" onClick={()=>{navigate("/admin/hack/category")}}>
                            Categories
                        </div>
                        <div className="admin-nav"  onClick={()=>{navigate("/admin/hack/product")}}>
                            Products
                        </div>
                        <div className="admin-nav" onClick={()=>{navigate("/admin/hack/item")}}>
                            Items
                        </div>
                        <div className="admin-nav" onClick={()=>{navigate("/admin/hack/topics")}}>
                            Topics
                        </div>
                        <div className="admin-nav" onClick={()=>{navigate("/admin/hack/color")}}>
                            Colors
                        </div>
                        <div className="admin-nav" onClick={()=>{navigate("/admin/hack/banners")}}>
                            Banners
                        </div>
                 </div>
                 <Outlet/>
               </>
            )
        }
    }

    return(
       <div>
          {renderAdminComponents()}
      </div>
    )
}

export default AdminHeader;