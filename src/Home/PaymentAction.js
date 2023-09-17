import {PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js';
import { useState } from 'react';
import "../css/view-item.css";
import properties from "../properties/properties.json";

const PaymentAction = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing,setIsProcessing]=useState(false);
  
    const handleSubmit = async (event) => {

      event.preventDefault();
  
      if (!stripe || !elements) {
        return;
      }
      setIsProcessing(true);

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: properties.clientServer,
        },
      });
  
      if (result.error) {
        alert(result.error.message);
      } else {
        console.log(result)
      }
      setIsProcessing(false);
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <PaymentElement/>
        <button className='btn-css' style={{marginTop:20}} disabled={isProcessing}>Submit</button>
      </form>
    )
};

export default PaymentAction;