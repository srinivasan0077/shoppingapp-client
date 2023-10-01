
import "../css/ordersuccess.css";
import { useContext, useEffect, useState } from "react";
import properties from "../properties/properties.json";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

function OrderSuccess(){
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const payment_intent=params.get('payment_intent');
    const [isSuccess,setIsSuccess]=useState(false);
    const {setCartCount}=useContext(UserContext);
    const navigate=useNavigate();

    useEffect(()=>{
        if(payment_intent!==undefined && payment_intent!==null){
            fetch(properties.remoteServer+"/public/api/payment/"+payment_intent,{
                method:"GET",
                credentials: "include"
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
               
        }
    },[payment_intent])

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