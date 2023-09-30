
import Select from "react-select";
import "../css/cart.css";
import "../css/checkout.css";
import "../css/login.css";
import {useRef, useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../App";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import properties from "../properties/properties.json";

function Checkout(){

    const [newAddressForm,setNewAddressForm]=useState(false);
    const [address,setAddress]=useState({addressLine1:"",addressLine2:undefined,city:"",state:"",country:"India",postalCode:0,mobile:0});
    const cart=useRef([]);
    const [savedAddress,setSavedAddress]=useState([]);
    const pickedAddress=useRef(undefined);
    const {logged,credential,scroll}=useContext(UserContext);
    const [queryParameters] = useSearchParams();
    const items=queryParameters.get("items");
    const [subTotal,setSubTotal]=useState(0);
    const navigate=useNavigate();
    const location=useLocation();

    useEffect(()=>{
        if(!logged){   
            navigate("/loginPage",{state:{redirectUrl:location.pathname+location.search}});
            return;
        }

        document.getElementById("checkout-result-display").style.display="none";

        let total=0;
        let itemsObj=JSON.parse(items);
        cart.current.length=0;
        for(let item of itemsObj){
             cart.current.push({inventory:{inventoryId:item.inventoryId},count:item.count});
             total+=(item.count*item.variant.price);
        }
        setSubTotal(total);
      
        fetch(properties.remoteServer+"/auth/api/addresses",{
            method:"GET",
            credentials: "include",
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
                    if(json.content!==undefined && json.content!==null && json.content.length!==0){
                            setSavedAddress(json.content);
                    }else{
                        setNewAddressForm(true);
                    }
                }else{
                    setNewAddressForm(true);
                }
            })
        
    },[])

    function handleChange(e){
        address[e.target.name]=e.target.value;
        setAddress({...address});
    }

    function placeOrderAndGotoPaymentPage(){
  
        
          if(validateAddress()){
            try{
                document.getElementById("place-order-button").disabled=true;
                let inputData={orderItems:cart.current};
                let headers={ 'Content-Type': 
                'application/json;charset=utf-8'};
                if(pickedAddress.current!==undefined){
                    inputData={...inputData,addressId:pickedAddress.current};
                }else{
                    inputData={...inputData,...address};
                }

                if(logged){
                    headers['csrfToken']=credential;
                }
                
                fetch(properties.remoteServer+"/auth/api/orders",{
                    method:"POST",
                    body:JSON.stringify(inputData),
                    credentials: "include",
                    headers: {
                       'Content-Type': 'application/json;charset=utf-8',
                       'csrfToken':credential
                    }
                    }).then(
                    (stream)=>stream.json()
                    ).then(
                    (json)=>{
                        if(json.status===2000){
                            navigate("/payment/"+json.content.orderId,{state:{...json.content}});
                        }else{
                            let resultContainer=document.getElementById("checkout-result-display");
                            let resultContent=document.getElementById("checkout-result-content");
                            resultContent.innerText=json.status===5000?"Invalid Request!":json.message;
                            resultContent.style.color="red";
                            resultContainer.style.border="1px solid red";
                            resultContainer.style.display="block";
                        }
                    })
           }catch(err){
                console.log(err);
           }finally{
                document.getElementById("place-order-button").disabled=false;
           }
        }

    }

    function showValidationResult(message){
        let resultContainer=document.getElementById("checkout-result-display");
        let resultContent=document.getElementById("checkout-result-content");
        resultContent.innerText=message;
        resultContent.style.color="red";
        resultContainer.style.border="1px solid red";
        resultContainer.style.display="block";
        if(scroll.current!==undefined){
            scroll.current.scrollIntoView();
         }
    }

    function validate(field){
        if(field===undefined || field===null || field.trim().length===0){
            return false;
        }
        return true;
    }

    function validateAddress(){
        if(newAddressForm){
            if(!validate(address.addressLine1)){
                showValidationResult("Address Line 1 is not valid!");
                return false;
            }

            if(!validate(address.city)){
                showValidationResult("City is not valid!");
                return false;
            }

            if(!validate(address.state)){
                showValidationResult("State is not valid!");
                return false;
            }

            if(!validate(address.country) || address.country!=="India"){
                showValidationResult("Country is not valid!");
                return false;
            }

            if(!validate(address.postalCode) || isNaN(address.postalCode) || address.postalCode.toString().length!==6){
                showValidationResult("Postal Code is not valid!");
                return false;
            }

            if(!validate(address.mobile) || isNaN(address.mobile) || address.mobile<0 ||  address.mobile.toString().length!==10){
                showValidationResult("Mobile number is not valid!");
                return false;
            }
        }else{
            if(pickedAddress.current===undefined){
                showValidationResult("Please pick a address!");
                return false;
            }
        }

        return true; 
    }

    function pickAddress(addressId){
        if(pickedAddress.current!==undefined){
            const pickAddressDOM=document.getElementById("radio-btn-"+pickedAddress.current);
            if(pickAddressDOM!==undefined){
                pickAddressDOM.style.backgroundColor="white";
            }
        }
        const radioButton=document.getElementById("radio-btn-"+addressId);
        radioButton.style.backgroundColor="lightgreen";
        radioButton.style.padding="1px";
        pickedAddress.current=addressId;
    }

    function renderSavedAddresses(){
        console.log(savedAddress)
         return (
             savedAddress.map(address=>{
                return (
                    <div className="checkout-address" key={address.addressId}>
                             <div className="radio-btn-container">
                                 <div className="radio-btn" id={"radio-btn-"+address.addressId} onClick={()=>{pickAddress(address.addressId)}}>
                                 
                                 </div> 
                             </div>
                         
                             <div style={{display:"flex",flexDirection:"column"}}>
                                   {address.addressLine1+" "}{address.addressLine2+" "}{address.city+" "}{address.state+" "}{address.country+" "} 
                                   {address.postalCode+" "}{address.mobile+" "}
                             </div>
                      </div>
                )
             })
         )
    }

    function handleKeyInput(e){
        if(e.key==='Enter'){
            const placeOrderBtn=document.getElementById("place-order-button");
            if(placeOrderBtn!==undefined){
                placeOrderBtn.click();
            }
        }
    }

    function renderComponent(){
        if(!newAddressForm){
            return (                 
            <>

               
                <div className="checkout-link-style" onClick={()=>{setNewAddressForm(true)}}>+ New Address</div>
                <div className="checkout-addresses">
                     {renderSavedAddresses()}
                    
                     
                 </div>
            </>
      )
        }else{
            return (
            <div className="checkout-form-container">
                    <div style={{padding:5,fontSize:20,color:"#2F4F4F"}}>Delivery Address</div>
                    <div className="input-container">
                        <div className="input-name">Address Line 1</div>
                        <input className="form-control" type={"text"} name="addressLine1" onChange={handleChange} onKeyDown={handleKeyInput}/>
                    </div>
                    <div className="input-container">
                        <div className="input-name">Address Line 2</div>
                        <input className="form-control" type={"text"} name="addressLine2" onChange={handleChange} onKeyDown={handleKeyInput}/>
                    </div>
                    <div className="input-same-line">
                        <div className="input-container input-checkout-style">
                            <div className="input-name">City</div>
                            <input className="form-control" type={"text"} name="city" onChange={handleChange} onKeyDown={handleKeyInput}/>
                        </div>
                        <div className="input-container input-checkout-style">
                            <div className="input-name">State</div>
                            <input className="form-control" type={"text"} name="state" onChange={handleChange} onKeyDown={handleKeyInput}/>
                        </div>
                    </div>
                    <div className="input-same-line">
                        <div className="input-container input-checkout-style">
                            <div className="input-name">Country</div>
                            <Select options={[{key:"India",label:"India"}]} defaultValue={{key:"India",label:"India"}}/>
                        </div>
                        <div className="input-container input-checkout-style">
                            <div className="input-name">Postal Code</div>
                            <input className="form-control" type={"number"} name="postalCode" onChange={handleChange} onKeyDown={handleKeyInput}/>
                        </div>
                    </div>
                    <div className="input-same-line">
                        <div className="input-container input-checkout-style">
                            <div className="input-name">Phone</div>
                            <input className="form-control" type={"number"} name="mobile" onChange={handleChange} onKeyDown={handleKeyInput}/>
                        </div>
                    </div>

            </div>
            );
        }
    }
   
    return(
        <>
        <div style={{textAlign:"center",padding:5,fontSize:20,color:"#2F4F4F"}}>Checkout</div>
        <div className="login-result-container">
                    <div className="login-result" style={{width:500}} id="checkout-result-display"><div className="login-result-content" id="checkout-result-content"></div></div>
        </div>
        <div className="cart-container">
                <div className="cart-item-container">
                      {renderComponent()}
                 
                </div>
                <div className="cart-buy-container">
                        <div className="cart-buy-container-heading">Pay Now!</div>
                        <div style={{textAlign:"center",fontSize:15,letterSpacing:2,color:"#2F4F4F"}}>Subtotal : {subTotal}</div>
                        <div style={{textAlign:"center",fontSize:15,letterSpacing:3,margin:10}}><input className="general-usr-btn-style" id="place-order-button" type="button" value={"Proceed to Pay"} onClick={placeOrderAndGotoPaymentPage}/></div>
                </div>
        </div>
        </>
    )
}

export default Checkout;