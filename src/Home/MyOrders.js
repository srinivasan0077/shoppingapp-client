import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../App";
import properties from "../properties/properties.json";
import { useLocation, useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import "../css/orders.css";

function MyOrders(){
    const {logged,credential}=useContext(UserContext);
    const navigate=useNavigate();
    const orderComponents=useRef([]);
    const [comps,setComps]=useState(orderComponents.current)
    const lastOrder=useRef();
    const hasMore=useRef(true);
    const location=useLocation();

    useEffect(()=>{
        if(!logged){
            navigate("/loginPage",{state:{redirectUrl:location.pathname+location.search},replace:true});
            return;
        }

        orderComponents.current=[];
        lastOrder.current=undefined;
        hasMore.current=true;
        fetchOrders(true);

    },[logged])

    function fetchOrders(initial){
        
        let getInfo={}
        let url=properties.remoteServer+"/auth/api/orders/list";

        if(lastOrder.current!==undefined){
           getInfo.paginationKey=lastOrder.current.orderId;
        }

        if(initial===undefined && lastOrder.current===undefined){
            return;
        }
        
        try{
            fetch(url,{
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
                            if(json.content===undefined || json.content===null){
                                hasMore.current=false;
                                return;
                            }
                            
                            if(json.content.length!==8){
                                hasMore.current=false;
                            }

                            let orders=json.content;
                            if(orders.length>0){
                                lastOrder.current=orders[orders.length-1];
                                if(initial){
                                    orderComponents.current=orders;
                                }else{
                                    orderComponents.current=orderComponents.current.concat(orders);
                                }
                            }

                            setComps(orderComponents.current);
                }else if(json.status===4001){
                    window.location.reload();
                }
            }
            )
        }catch(error){
              console.log(error)
        }
   }
 
   
    return(
        <>
            <div style={{textAlign:"center",padding:5,fontSize:20,color:"#2F4F4F"}}>My Orders</div>
            <div className="order-component-heading" >
                  <div className="order-heading-child">ID</div>
                  <div className="order-heading-child" >ORDER DETAILS</div>
                  <div className="order-heading-child">STATUS</div>
                  <div className="order-heading-child">AMOUNT PAID</div>                                 
            </div>
            <InfiniteScroll  dataLength={comps.length} next={fetchOrders} hasMore={hasMore.current} scrollableTarget="scrollableDiv">
                                {comps.map(order=>{
                                            let orderDetails="";
                                            let inventories=order.inventories;
                                            let orderStatus="";
                                            let color="black";
                                            let orderDetailsSize=0;
                                            for(let i=0;i<inventories.length;i++){
                                                 let detail=inventories[i].variant.name+"["+inventories[i].size.name+"]";
                                                 if(orderDetailsSize+detail.length>45){
                                                         orderDetails+=detail.substring(0,45-orderDetailsSize)+"....";
                                                         break;
                                                 }else{
                                                         orderDetails+=detail;
                                                         orderDetailsSize+=detail.length;
                                                 }

                                                 if(i!==inventories.length-1){
                                                    orderDetails+=","
                                                 }
                                            }

                                            if(order.statusCode==="OPEN" || order.statusCode==="COD"){
                                                orderStatus="SHIPPING SOON";
                                            }else if(order.statusCode==="CLOSED"){
                                                orderStatus="SHIPPED";
                                                color="green";
                                            }else if(order.statusCode==="FAILED"){
                                                orderStatus="ORDER FAILED.AMOUNT WILL BE REFUNDED.";
                                                color="red";
                                            }

                                            return (
                                                <div key={order.orderId} className="order-component">
                                                    <div className="order-child">{"#"+order.orderId}</div>
                                                    <div className="order-child" >{orderDetails}</div>
                                                    <div className="order-child" style={{color:color}}>{orderStatus}</div>
                                                    <div className="order-child">{"₹ "+order.totalPrice}</div>
                                                </div>
                                            )
                                })}
            </InfiniteScroll>
        </>
    )


}

export default MyOrders;