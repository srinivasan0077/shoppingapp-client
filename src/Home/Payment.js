import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentAction from "./PaymentAction";
import properties from "../properties/properties.json";
import "../css/login.css";
import "../css/payment.css";
import { UserContext } from "../App";

function Payment(){
    const {logged,credential}=useContext(UserContext);
    const [stripePromise,setStripePromise]=useState(loadStripe(properties.stripePublishableKey));
    const [clientSecret,setClientSecret]=useState();
    const [totalPrice,setTotalPrice]=useState();
    const [received,setReceived]=useState(0);
    const {orderId}=useParams();
    const location=useLocation();
    const state=location.state;
    const navigate=useNavigate();
    const appearance = {
        theme: 'stripe'
    };
    

    useEffect(()=>{
        if(!logged){   
            navigate("/loginPage",{state:{redirectUrl:location.pathname+location.search}});
            return;
        }

        document.getElementById("payment-result-display").style.display="none";
         if(state!==undefined && state!==null && state.clientSecret!==undefined && state.totalPrice!==undefined &&
            state.clientSecret!==null && state.totalPrice!==null){
            setClientSecret(state.clientSecret);
            setTotalPrice(state.totalPrice);
         }else{
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
                            if(json.content.statusCode==="WAITING"){
                                setTotalPrice(json.content.totalPrice);
                                setClientSecret(json.content.clientSecret);
                            }else{
                                setReceived(1);
                            }
                        }else{
                            setReceived(2);
                        }
                    }
                })
         }
    },[])

    function renderPaymentPage(){
        if(received===0){
             if(stripePromise && clientSecret){
                return (<>
                   <div style={{fontWeight:"bold",fontFamily:"sans-serif"}}>Pay ₹ {totalPrice}</div>
                    
                    <Elements stripe={stripePromise} options={{clientSecret:clientSecret,appearance:appearance}}>
                        <PaymentAction/>
                    </Elements>
                </>)
             }
        }else if(received===1){
                return (
                    <>
                       <div style={{color:"green",width:350}}>Order created successfully.Please check your email.If you face any issues,please raise a query here <a href={properties.clientServer+"/customer-care"}>customer care</a>.</div>
                    </>
                ) 
        }else{
            return (
                <>
                   <div style={{color:"red",width:350}}>Payment page not found.If you face any issues please contact our support team.</div>
                </>
            ) 
        }
    }
    return (

         <div className="login-body">
            <div className="login-result-container">
                    <div className="login-result" id="payment-result-display"><div className="login-result-content" id="payment-result-content"></div></div>
            </div>
          <div className="login-result-container">
           
             <div className="payment-container">
                
              
                    {renderPaymentPage()}
                
                
             </div>
             
          </div>
          </div>
        
    )
}

export default Payment;