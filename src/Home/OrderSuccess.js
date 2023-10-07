
import "../css/ordersuccess.css";
import { useContext, useEffect, useState } from "react";
import properties from "../properties/properties.json";
import { UserContext } from "../App";
import { useLocation, useNavigate } from "react-router-dom";

function OrderSuccess(){
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const payment_intent=params.get('payment_intent');
    const orderId=params.get('orderId');
    const [isSuccess,setIsSuccess]=useState(false);
    const {setCartCount}=useContext(UserContext);
    const navigate=useNavigate();
    const location=useLocation();
    const {logged,credential}=useContext(UserContext);

    useEffect(()=>{
        if(!logged){
            navigate("/loginPage",{state:{redirectUrl:location.pathname+location.search},replace:true});
        }

        if(payment_intent!==undefined && payment_intent!==null){
            fetch(properties.remoteServer+"/auth/api/payment/"+payment_intent,{
                method:"GET",
                credentials: "include",
                headers: {
                   'csrfToken':credential
                }
                }).then(
                (stream)=>stream.json()
                ).then(
                (json)=>{
                    if(json.status===2000){
                        setTimeout(()=>{
                             navigate("/my-orders",{replace:true})
                        }, 5000);

                        if(json.content.status==="succeeded"){
                            setIsSuccess(true)
                        }

                        if(json.content.isCart){
                            localStorage.removeItem("cart");
                            setCartCount(0);
                        }

                    }
                 
                    
                })
               
        }else if(orderId!==undefined && orderId!==null){
            fetch(properties.remoteServer+"/auth/api/orders/"+orderId,{
                method:"GET",
                credentials: "include",
                headers: {
                   'csrfToken':credential
                }
                }).then(
                (stream)=>stream.json()
                ).then(
                (json)=>{
                    if(json.status===2000){
                        if(json.content!==null && json.content!==undefined){
                            if(json.content.statusCode==="COD" || json.content.statusCode==="OPEN"){
                                setTimeout(()=>{
                                    navigate("/my-orders",{replace:true})
                               }, 5000);
                               setIsSuccess(true);
                            }
                        }
                    }
                })
        }
    },[payment_intent,logged])

    return (
        <div className="order-container">
            {isSuccess &&
            <div className="card">
                <div className="order-italic-container">
                    <i className="order-italic">✓</i>
                </div>
                <h1 className="order-heading">Success</h1> 
                <p className="order-para">We received your order<br/> We'll be in touch shortly!</p>
            </div>
            }
        </div>
    )
}

export default OrderSuccess;