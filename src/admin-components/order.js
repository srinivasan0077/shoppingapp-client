import {useEffect, useState,useContext, useRef } from "react";
import properties from "../properties/properties.json";
import "../admin-styles/general.css";
import { Link,useNavigate} from "react-router-dom";
import { UserContext } from "../App";
import Select from "react-select";

function Order(){
    const [orders,setOrders]=useState([]);
    const options=[{value:"OPEN",label:"OPEN"},{value:"CLOSED",label:"CLOSED"},{value:"WAITING",label:"WAITING"},{value:"FAILED",label:"FAILED"}]
    const navigate=useNavigate();
    const {credential,logged,user}=useContext(UserContext);
    const [stack,setStack]=useState([]);
    const [status,setStatus]=useState("OPEN");

    useEffect(()=>{
        if(!logged || user.roleid!==2){
            navigate("/",{replace:true});
            return;
        }
        fetchOrders(true);
    },[status])

    function fetchOrders(freshApiCall){
         let getInfo={
            range:10,
            filterBy:"status",
            filterValue:status
         }

         if(stack.length>0 &&  (freshApiCall===undefined || freshApiCall===false)){
            getInfo.paginationKey=stack[stack.length-1];
         }

         fetch(properties.remoteServer+"/admin/api/orders/list",{
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
                    setOrders(json.content);
                }
            }
         )
    }

    function getOrders(option){
        if(option==="next"){
            if(orders.length===10){
                stack.push(orders[orders.length-1].orderId);
                setStack(stack);
                fetchOrders();
            }
        }else if(option==="prev"){
            stack.pop();
            setStack(stack);
            fetchOrders();
        }

  }

    function renderOrders(){
        
         return(
            orders.map(order=>{
                return(
                    <tr key={order.orderId}>
                        <td>{order.orderId}</td>
                        <td>{order.shipTo.addressId}</td>
                        <td>{new Date(order.date).toString()}</td>
                        <td>{order.statusCode}</td>
                        <td>  
                             <Link to={"/admin/hack/orders/"+order.orderId} className="link-style">View Details</Link>
                        </td>
                    </tr>
                )
            })
         )
    }

    function refreshContainer(){
        setStack([]);
        fetchOrders(true);
    }

    function handleFieldSelect(SelectedOption){
                setStatus(SelectedOption.value);
    }


    return(
           <>
              <h3 style={{textAlign:"center",padding:20,color:"maroon"}}>Orders</h3>
              <div style={{margin:20,display:"flex"}}>
                 <Select options={options} className="general-select-style"  onChange={handleFieldSelect} defaultValue={options[0]}/>
             </div>
             <div style={{margin:20}}>
                        <input type={"button"} className="general-btn-style" style={{marginRight:10}}  onClick={()=>{getOrders("prev")}}  value=" Prev "/>
                        <input type={"button"} className="general-btn-style" style={{marginRight:10}}  onClick={()=>{getOrders("next")}}  value=" Next "/>
                        <input type={"button"} className="general-btn-style"  onClick={refreshContainer}  value=" Refresh "/>
              </div>
              <table className="table" style={{margin:20}}>
                <thead>
                    <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Ship To</th>
                    <th scope="col">Order Time</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                     {renderOrders()}
                </tbody>
                </table>

           </>
    );
}

export default Order;