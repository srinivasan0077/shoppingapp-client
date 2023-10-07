import { useContext, useEffect, useState } from "react";
import "../css/cart.css";
import "../css/general.css";
import "../css/view-item.css";
import { UserContext } from "../App";
import properties from "../properties/properties.json";
import { useNavigate } from "react-router-dom";

function Cart(){

    const {cartCount,setCartCount}=useContext(UserContext);
    const [shoppingCart,setShoppingCart]=useState({});
    const [subtotal,setSubTotal]=useState(0);
    const navigate=useNavigate();
    
    useEffect(()=>{
            let inventories=[];
            let cart=localStorage.getItem("cart");
            if(cart!==null || cart!==undefined){
                cart=JSON.parse(cart);
                for(let key in cart){
                    inventories.push({inventoryId:cart[key].inventoryId});
                }

                if(inventories.length>0){
                    fetch(properties.remoteServer+"/public/api/carts/_local",{
                        credentials: "include",
                        method:"POST",
                        body:JSON.stringify(inventories),
                        headers: {
                            'Content-Type': 
                            'application/json;charset=utf-8'
                        }
                    }).then(res=>res.json()).then(json=>{
                        if(json.status===2000){
                            let subtotal=0;
                            let localCartCopy={...cart};
                            let reverseCart={};
                            let inventoryIdSet=new Set([]);
                            let totalCartCount=0;
                            let deductCount=0;
                            for(let i=0;i<json.content.length;i++){
                                let cartItem=localCartCopy["key:"+json.content[i].inventoryId];
                                cartItem.size=json.content[i].size;
                                cartItem.variant=json.content[i].variant;
                                cartItem.availableStocks=json.content[i].availableStocks;
                                subtotal=subtotal+json.content[i].variant.price*cartItem.count;
                                inventoryIdSet.add("key:"+json.content[i].inventoryId);
                            }

                            Object.keys(localCartCopy).reverse().forEach(key=>{
                                totalCartCount+=cart[key].count;;
                                if(!inventoryIdSet.has(key)){
                                      deductCount+=cart[key].count;
                                      delete cart[key];
                                }else{
                                    reverseCart[key]=localCartCopy[key];
                                }
                            })
                           
                            if(json.content.length>0){
                                setShoppingCart(reverseCart);
                                setSubTotal(subtotal);
                            }

                            localStorage.setItem("cart",JSON.stringify(cart));
                            setCartCount(totalCartCount-deductCount);

                        }
                    })
                }
            }
        

    },[])

    function addToCart(key){
        if(cartCount>=50){
            showAlertNotice("Cannot add more than 50 items in cart!",1);
            return;
        }

        let item=shoppingCart[key];
        let cart=JSON.parse(localStorage.getItem("cart"));
        if((item.count+1)>item.availableStocks){
            showAlertNotice("No items left!",1);
            return;
        }
        item["count"]=item.count+1;
        cart[key]["count"]= cart[key].count+1;
        setShoppingCart(shoppingCart);
        localStorage.setItem("cart",JSON.stringify(cart));
        setCartCount(cartCount+1);
        setSubTotal(subtotal+item.variant.price)
        
    }

    function removeFromCart(key){
        if(cartCount<=0){
            return;
        }

        let item=shoppingCart[key];
        let cart=JSON.parse(localStorage.getItem("cart"));
        item["count"]=item.count-1;
        cart[key]["count"]= cart[key].count-1;
        if(item.count<=0){
                delete shoppingCart[key];
                delete cart[key];
        }
        setShoppingCart(shoppingCart);
        localStorage.setItem("cart",JSON.stringify(cart));
        setCartCount(cartCount-1);
        setSubTotal(subtotal-item.variant.price);
        
    }

    function showAlertNotice(message,signal){
        const alertBox=document.getElementById("cart-alert-notice");
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
    function closeAlertNotice(){
        document.getElementById("cart-alert-notice").style.display="none";
    }

    function goTocheckoutPage(){
       
        let cart=[];
        for(let key in shoppingCart){
            if(shoppingCart[key].count>shoppingCart[key].availableStocks){
                showAlertNotice("Please check item availability!",1);
                return;
            }
            cart.push(shoppingCart[key]);
        }

        if(cart.length>0){
             navigate("/checkout?items="+encodeURIComponent(JSON.stringify(cart))+"&isCart=true");
        }else{
            showAlertNotice("Cannot move to checkout page as no items in cart!",1);
        }
    }


    function renderCartItems(){
        if(shoppingCart!==undefined){
            return Object.keys(shoppingCart).map(key=>{
                
                return (
                    <div className="cart-item-style" key={key}>
                        <div>
                            <img className="cart-item-img-style" alt="item-img" src={shoppingCart[key].variant.images[0].url}/>
                        </div>
                        <div className="cart-item-details-style">
                                <div className="cart-item-detail" style={{color:"#C0C0C0"}}>{shoppingCart[key].variant.item.productItemName}</div>
                                <div className="cart-item-detail" style={{color:"#BC8F8F"}}>{shoppingCart[key].variant.name}</div>
                                <div className="cart-item-detail" style={{color:"#708090"}}>Price : ₹{shoppingCart[key].variant.price}</div>
                                <div className="cart-item-detail" style={{color:"#708090"}}>Size : {shoppingCart[key].size.name}</div>
                                <div className="cart-item-detail" style={{color:"green"}}>Available:{shoppingCart[key].availableStocks}</div>
                                <div className="cart-item-detail" style={{color:shoppingCart[key].variant.isCOD?"green":"brown",fontSize:15}}>{shoppingCart[key].variant.isCOD?"COD Available":"COD Not Available"}</div>
                        </div>
                        <div className="cart-item-count-container">
                              <div className="cart-item-count-handler" onClick={()=>{removeFromCart(key)}}>-</div>
                              <div className="cart-item-count">{shoppingCart[key].count}</div>
                              <div className="cart-item-count-handler" onClick={()=>{addToCart(key)}}>+</div>
                        </div>
                        <div style={{display:"flex",alignItems:"center"}}>
                             Total : ₹{shoppingCart[key].count*shoppingCart[key].variant.price}
                        </div>
                    </div>
                )
            })
        }
    }

    return(
        <>
        <div style={{textAlign:"center",padding:5,fontSize:20,color:"#2F4F4F"}}>Shopping Cart</div>
        <div className="alert" id="cart-alert-notice">
                                <span className="alertClose" onClick={closeAlertNotice}>X</span>
                                <span className="alertText" id="alert-text">Notice!
                                <br className="clear"/></span>
        </div>
        <div className="cart-container">
           <div className="cart-item-container">
                 {renderCartItems()}
           </div>
           <div className="cart-buy-container">
                <div className="cart-buy-container-heading">Order Now!</div>
                <div style={{textAlign:"center",fontSize:15,letterSpacing:2,color:"#2F4F4F"}}>Subtotal({cartCount}) : ₹{subtotal}</div>
                <div style={{textAlign:"center",fontSize:15,letterSpacing:3,margin:10}}><input className="general-usr-btn-style" type="button" onClick={goTocheckoutPage} value={"Proceed to Buy"}/></div>
           </div>
        </div>
        </>
    )
}

export default Cart;