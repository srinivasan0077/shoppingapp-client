import { Outlet, useNavigate } from "react-router-dom";
import "../admin-styles/admin-header.css";
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
            
                        <div className="admin-nav" style={{fontSize:30}}>
                            Royall
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
                        <div className="admin-nav" onClick={()=>{navigate("/admin/hack/orders")}}>
                            Orders
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