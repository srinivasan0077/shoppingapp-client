import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import properties from "../properties/properties.json";
import "../css/view-item.css";
import "../css/home.css";
import "../css/cart.css";
import BoxComponent from "./Box";
import { UserContext } from "../App";

function ViewItem(){

    const {variantId}=useParams();
    const [variant,setVariant]=useState();
    const [inventory,setInventory]=useState();
    const [svariants,setSVariants]=useState();
    const [stocks,setStocks]=useState(1)
    const {cartCount,setCartCount}=useContext(UserContext);
    const navigate=useNavigate();

    useEffect(()=>{
        setInventory(undefined);
        fetch(properties.remoteServer+"/public/api/variants/"+variantId,{
            credentials: "include"
            }).then(
            (stream)=>stream.json()
            ).then(
            (json)=>{
                if(json.status===2000){
                    setVariant(json.content);
                    fetch(properties.remoteServer+"/public/api/items/"+json.content.item.productItemId+"/variants",{
                        credentials: "include"
                        }).then(
                            (stream)=>stream.json()
                            ).then(
                            (json)=>{
                                if(json.status===2000){
                                     setSVariants(json.content)
                                }
                            }
                        )
                }
            }
        )
    },[variantId])

   function renderSimilarVariants(){
       if(svariants!==undefined){
            return (
                svariants.map(similarvariant=>{
                    
                    if(similarvariant.variantId!==Number(variantId)){
                        return (
                            <div key={similarvariant.variantId}>
                               <BoxComponent variant={similarvariant}/>
                            </div>
                        )
                    }
                })
            )
       }
   }

   

   function pickInventory(inventoryObj){
        if(inventory!==undefined){
            let size=document.getElementById(inventory.inventoryId);
            size.style.background="white";
            size.style.color="black";
        }

        setInventory(inventoryObj);
        let size=document.getElementById(inventoryObj.inventoryId);
        size.style.background="black";
        size.style.color="white";
   } 

   function renderSizes(){
       return (
       variant.inventories.map(inventoryObj=>{
        return (
            <div className="size-style" key={inventoryObj.inventoryId} id={inventoryObj.inventoryId} onClick={()=>{pickInventory(inventoryObj)}}>
                 {inventoryObj.size.name}
            </div>
       )
       })
    
       );
   }

    
   function modifyCount(op){
        if(stocks===1 && op==="sub"){
            return;
        }else if(op==="add"){
             setStocks(stocks+1);
        }else if(op==="sub"){
            setStocks(stocks-1);
       }
   }

    function renderComponents(){
        if(variant!==undefined){
            return (
                <div className="item-component">
                    <img className="img-view" alt="boximg-view-img" src={variant.images[0].url}/>
                    <div className="item-details">
                        <div className="view-item-name">{variant.item.productItemName}</div>
                        <div className="view-variant-name">{variant.name}</div>
                        <div className="view-variant-price">Price:₹{variant.price}</div>
                        <div className="size-grid">
                              {renderSizes()}
                        </div>
                        <div className="view-variant-available">{inventory!==undefined?"AVAILABLE:"+inventory.availableStocks:""}</div>
                        <div style={{display:"flex",justifyContent:"center",alignItems:"center",margin:10}}>
                              <div className="cart-item-count-handler"  onClick={()=>{modifyCount("sub")}}>-</div>
                              <div className="cart-item-count">{stocks}</div>
                              <div className="cart-item-count-handler" onClick={()=>{modifyCount("add")}}>+</div>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                            <input type="button" value={"Add to Cart"} className="btn-css" onClick={addToCart}/>
                            <input type="button" value={"Buy Now"} className="btn-css" onClick={goToCheckOutPage}/>
                        </div>
                    </div>
                </div>
            )
        }
    }

    function goToCheckOutPage(){
        if(inventory===undefined){
            showAlertNotice("Please pick the size!",1);
        }else if(stocks>inventory.availableStocks){
            showAlertNotice("Only "+inventory.availableStocks+" items available!",1);
        }else{
            let cart=[{
                ...inventory,variant:variant,count:stocks
            }]
            navigate("/checkout?items="+encodeURIComponent(JSON.stringify(cart)));
        }
    }

    function addToCart(){

        if(inventory===undefined){
            showAlertNotice("Please pick the size!",1);
        }else if(stocks>inventory.availableStocks){
            showAlertNotice("Only "+inventory.availableStocks+" items available!",1);
        }else if(cartCount+stocks>50){
            showAlertNotice("Cannot add more than 50 items to cart!",1);
        }else{
            let cart=localStorage.getItem("cart");
            let inventoryObj={...inventory,count:stocks};
           
            if(cart===null || cart===undefined){
                cart={};
                cart["key:"+inventoryObj.inventoryId]=inventoryObj;
                setCartCount(cartCount+stocks);
                localStorage.setItem("cart",JSON.stringify(cart));
                navigate("/view-cart");
            }else{
                cart=JSON.parse(cart);
                
                if(cart["key:"+inventoryObj.inventoryId]===undefined){
                    cart["key:"+inventoryObj.inventoryId]=inventoryObj;
                }else{
                    let count=cart["key:"+inventoryObj.inventoryId].count;
                    if(count+stocks>inventoryObj.availableStocks){
                          showAlertNotice("Item not avialable.Please check your cart!",1);
                          return;
                    }
                    cart["key:"+inventoryObj.inventoryId].count=count+stocks;
                }
                setCartCount(cartCount+stocks);
                localStorage.setItem("cart",JSON.stringify(cart));
                navigate("/view-cart");
            }
        }
    }

    function closeAlertNotice(){
        document.getElementById("alert-notice").style.display="none";
    }

    function showAlertNotice(message,signal){
        const alertBox=document.getElementById("alert-notice");
        alertBox.style.display="block";
        document.getElementById("alert-text").innerText=message;
        if(signal===0){
            alertBox.style.backgroundColor="lightgreen";
            alertBox.style.border="1px solid green";
        }else if(signal===1){
            alertBox.style.backgroundColor="rgb(167, 90, 90)";
            alertBox.style.border="1px solid red";
        }
    }

    return (
        <>
        <div  className="top-view">

            <div className="alert" id="alert-notice">
                                <span className="alertClose" onClick={closeAlertNotice}>X</span>
                                <span className="alertText" id="alert-text">Please pick the size!
                                <br className="clear"/></span>
            </div>
            <div className="item-view">
                {renderComponents()}
            </div>
            <hr style={{marginTop:70}}/>
            <div style={{marginTop:20}}>
                    <div className="view-variant-similar">{(svariants!==undefined && svariants.length>1)?"Similar Items":""}</div>

                    <div className="grid-container">
                            {renderSimilarVariants()}
                    </div>
            </div>
        </div>
        </>
    )


}

export default ViewItem;