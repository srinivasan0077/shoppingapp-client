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

    let statusObj=undefined;
    let stackArr=undefined;
    if(localStorage.getItem("orderState")!==null){
        let orderState=JSON.parse(localStorage.getItem("orderState"));
        statusObj=orderState["status"];
        stackArr=orderState["stack"];
    }else{
        statusObj=options[0];
        stackArr=[];
    }

    const [stack,setStack]=useState(stackArr);
    const [status,setStatus]=useState(statusObj);
    const [render,setRender]=useState(false);

    useEffect(()=>{
        if(!logged || user.roleid!==2){
            navigate("/",{replace:true});
            return;
        }

        if(stack.length>0){
            fetchOrders();
        }else{
            fetchOrders(true);
        }
    },[status])

    async function fetchOrders(freshApiCall){
         let getInfo={
            range:10,
            filterBy:"status",
            filterValue:status.value
         }

         if(stack.length>0 &&  (freshApiCall===undefined || freshApiCall===false)){
            getInfo.paginationKey=stack[stack.length-1];
         }

         await fetch(properties.remoteServer+"/admin/api/orders/list",{
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
         setRender(true);
    }

    function maintainState(status,stack){
        let orderState={
            "status":status,
            "stack":stack
        }
        localStorage.setItem("orderState",JSON.stringify(orderState));
    }


    function getOrders(option){
        if(option==="next"){
            if(orders.length===10){
                stack.push(orders[orders.length-1].orderId);
                setStack(stack);
                maintainState(status,stack);
                fetchOrders();
            }
        }else if(option==="prev"){
            stack.pop();
            setStack(stack);
            maintainState(status,stack);
            fetchOrders();
        }

  }

   function closeOrder(id){
        if(window.confirm("Close the order?")){
            fetch(properties.remoteServer+"/admin/api/orders/"+id+"/_close",{
                credentials: "include",
                headers: {
                    'csrfToken':credential
                }
            }).then(
                (stream)=>stream.json()
            ).then(
                (json)=>{
                    alert(json.message);
                    if(json.status===2000){
                          fetchOrders();
                    }
                }
            )
        }
   }

    function renderOrders(){
        
         return(
            orders.map(order=>{
                return(
                    <tr key={order.orderId}>
                        <td>{order.orderId}</td>
                        <td>{order.shipTo.addressId}</td>
                        <td>{new Date(order.date).toLocaleDateString()}</td>
                        <td>{order.statusCode}</td>
                        <td>{order.clientSecret}</td>
                        {order.statusCode!=="CLOSED" && order.statusCode!=="WAITING"  &&
                             <td><Link className="link-style" onClick={()=>{closeOrder(order.orderId)}}>Close</Link></td>}
                        <td>  
                             <Link to={"/admin/hack/orders/"+order.orderId} className="link-style">View</Link>
                        </td>
                    </tr>
                )
            })
         )
    }

    function refreshContainer(){
        setStack([]);
        fetchOrders(true);
        maintainState(status,[]);
    }

    function handleFieldSelect(SelectedOption){
         setStatus(SelectedOption);
         maintainState(SelectedOption,stack);
    }



    return(
           <>{render &&
              <>
              <h3 style={{textAlign:"center",padding:20,color:"maroon"}}>Orders</h3>
              <div style={{margin:20,display:"flex"}}>
                 <Select options={options} className="general-select-style"  onChange={handleFieldSelect} defaultValue={status}/>
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
                    <th scope="col">Client Secret</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                     {renderOrders()}
                </tbody>
                </table>
                </>
               }
           </>
    );
}

export default Order;