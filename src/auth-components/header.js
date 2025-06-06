import { Outlet,useNavigate } from "react-router-dom";
import "../css/header.css";
import {FaShoppingCart,FaBars,FaUser, FaPhoneAlt, FaMailBulk, FaAddressCard } from 'react-icons/fa';
import { UserContext } from "../App";
import { useContext, useEffect, useState} from "react";
import properties from "../properties/properties.json";

function Header(){

    const {logged,setLogged,cartCount,setCartCount,credential}=useContext(UserContext);
    const [headers,setHeaders]=useState([]);
    const navigate=useNavigate();


    useEffect(()=>{
        let count=0;
         let cart=localStorage.getItem("cart");
         if(cart!==null || cart!==undefined){
              cart=JSON.parse(cart);
              for(let key in cart){
                  count+=cart[key].count;
              }
         }
         setCartCount(count);
         
        fetch(properties.remoteServer+"/public/api/headers",{
            method:"GET",
            credentials: "include"
          }).then(
            (stream)=>stream.json()
         ).then(
            (json)=>{
                if(json.status===2000){
                  setHeaders(json.content);
                }
            }
         )
         
    },[])
   

    function handleKeyPress(e){
        if (e.keyCode === 13) {
            navigate("items?search="+e.target.value);
        }
    }

    function logoutUser(){
        fetch(properties.remoteServer+"/logout",{ credentials: "include",headers: {
            'csrfToken':credential
        }})
        .then(res=>res.json()).then(json=>{
            if(json.status===2000){
                setLogged(false);
                navigate("/");
            }
        })
    }

    
    function renderLoginUserComponent(){
        if(!logged){
            return (
                <button className="bag-container-style" onClick={()=>{
                    navigate("/loginPage");
                }}>Login</button>
            );
        }else{
            return(
                <div className="account-div">
                   <button className="bag-container-style"><FaUser className="bag-style"/></button>
                   <div className="account-dropdown-content">
                        <div onClick={()=>{navigate("/my-account")}}>My Account</div>
                        <div onClick={()=>{navigate("/my-orders")}}>My Orders</div>
                        <div onClick={logoutUser}>Logout</div>
                    </div>
                </div>
            )
        }
    }

    function toggleSideNav(){
          const sidenav=document.getElementById("sidenav-id");
          if(sidenav.style.display==="block"){
            sidenav.style.display="none";
          }else{
            sidenav.style.display="block";
          }
    }

    function renderHeaders(isSideNav,mobileView){
        return(
            headers.map((header)=>{
                if(mobileView){
                    return(
                        <div onClick={()=>{toggleSideNav();navigate("/products/"+header.productId+"/items");}} className={isSideNav?"side-tab":"tab"} key={header.productId}>{header.productName}</div>
                    )
                }else{
                    return(
                    <div onClick={()=>{navigate("/products/"+header.productId+"/items");}} className={isSideNav?"side-tab":"tab"} key={header.productId}>{header.productName}</div>
                    )
                }
            })
         )
    }


    return (
        <>
        <div className="header-div" id="header-div">
            <div className="header-container">
                
                <div className="image-container">
                     <div className="fabar-class"><FaBars onClick={toggleSideNav}/></div>
                     <div className="site-name-style">Royall</div>
                </div>
                <div className="tab-container">
                    <div className="tab" onClick={()=>{navigate("/");}}>Home</div>
                    {renderHeaders(false)}
                    <div className="tab" onClick={()=>{navigate("/customer-care")}}>Support</div>
                </div>
                <div className="search-container">
                   <input type={"search"} className="form-control search-field"  placeholder="Search" onKeyUp={handleKeyPress}/>
                </div>

                <div className="user-signin">
                    {renderLoginUserComponent()}
                    <button className="bag-container-style" onClick={()=>{navigate("/view-cart")}}>
                        <FaShoppingCart className="bag-style"/>
                        <div style={{marginLeft:2}}>{cartCount}</div>
                    </button>
                </div>

                
            </div>
            <div className="mobile-search-container">
                   <input type={"search"} onKeyUp={handleKeyPress} style={{height:40}} className="form-control"  placeholder="Search"/>
            </div>
            <div className="sidenav-container" id="sidenav-id">
                   
                <div className="sidenav">
                   <div onClick={toggleSideNav}>
                     X
                    </div>
                    <div onClick={()=>{toggleSideNav();navigate("/");}}>Home</div>
                    {renderHeaders(true,true)}
                    <div onClick={()=>{toggleSideNav();navigate("/customer-care")}}>Support</div>
                </div>
                
            </div>
        </div>
        <Outlet/>
        <div className="contact-style-container">
              <div className="contact-style">
                   <div className='contact-style-child'>
                        <div>Contact Us</div>
                    </div>
                    <div className='contact-style-child'>
                        <FaPhoneAlt style={{marginRight:10}}/>
                        <div>+91-9843556495 +91-9080110805</div>
                    </div>
                    <div className='contact-style-child'>
                        <FaMailBulk style={{marginRight:10}}/>
                        <div>royallcustomerservice1@gmail.com</div>
                    </div>
                    <div className='contact-style-child'>
                        <FaAddressCard style={{marginRight:10}}/>
                        <div>No:50,5th Cross,Sakthi Nagar,Saram,Puducherry 605013</div>
                    </div>
              </div>
              <div style={{margin:10,color:"white"}}>© 2023 - Royall - All rights reserved.</div>
        </div>
        </>
    )
}

export default Header;