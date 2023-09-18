import {PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js';
import { useContext, useState } from 'react';
import "../css/view-item.css";
import properties from "../properties/properties.json";
import { UserContext } from '../App';

const PaymentAction = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing,setIsProcessing]=useState(false);
    const {scroll}=useContext(UserContext);

    function showValidationResult(message){
      let resultContainer=document.getElementById("payment-result-display");
      let resultContent=document.getElementById("payment-result-content");
      resultContent.innerText=message;
      resultContent.style.color="red";
      resultContainer.style.border="1px solid red";
      resultContainer.style.display="block";
      if(scroll.current!==undefined){
          scroll.current.scrollIntoView();
       }
  }

    const handleSubmit = async (event) => {

      event.preventDefault();
  
      if (!stripe || !elements) {
        return;
      }
      setIsProcessing(true);

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: properties.clientServer+"/payment/success",
        },
      });
  
      if (result.error) {
        showValidationResult(result.error.message);
      }
      console.log(result)
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