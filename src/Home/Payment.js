import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import properties from "../properties/properties.json";
import { Elements } from "@stripe/react-stripe-js";
import PaymentAction from "./PaymentAction";
import "../css/login.css";
import "../css/payment.css";

function Payment(){
    const [stripePromise,setStripePromise]=useState(loadStripe(properties.stripePublishableKey));
    const [clientSecret,setClientSecret]=useState();
    const [totalPrice,setTotalPrice]=useState();
    const state=useLocation().state;
    const appearance = {
        theme: 'stripe'
      };
    

    useEffect(()=>{
        console.log(state)
         if(state!==undefined && state.clientSecret!==undefined && state.totalPrice!==undefined){
            setClientSecret(state.clientSecret);
            setTotalPrice(state.totalPrice);
         }
    },[])
    return (
        
          <div className="login-result-container">

             <div className="payment-container">
                {stripePromise && clientSecret && 
                <>
                    <div style={{fontWeight:"bold",fontFamily:"sans-serif"}}>Pay ₹ {totalPrice}</div>
                    
                    <Elements stripe={stripePromise} options={{clientSecret:clientSecret,appearance:appearance}}>
                        <PaymentAction/>
                    </Elements>
                </>
                }
             </div>
          </div>
        
    )
}

export default Payment;