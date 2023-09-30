import { useContext, useEffect, useState } from "react";
import "../css/account.css";
import { UserContext } from "../App";
import properties from "../properties/properties.json";
import { useNavigate } from "react-router-dom";


function Account(){
    const {logged,credential}=useContext(UserContext);
    const navigate=useNavigate();
    const [user,setUser]=useState({firstname:"",lastname:"",email:"",phone:""});
    
    useEffect(()=>{
        if(!logged){
            navigate("/loginPage");
            return;
        }
        fetchUser();
    },[logged])

    function fetchUser(){
        fetch(properties.remoteServer+"/auth/api/account",{
            method:"GET",
            credentials: "include",
            headers: {
              'csrfToken':credential
            }
            }).then(
            (stream)=>stream.json()
            ).then(data=>{
                 if(data.status===2000){
                          let userDetails={}
                          userDetails.firstname=data.content.firstname;
                          userDetails.lastname=data.content.lastname;
                          userDetails.email=data.content.email;
                          userDetails.phone=data.content.phone;
                          setUser(userDetails);
                 }else if(data.status===4001){
                         window.location.reload();
                 }
            })
    }

    return(
        <>
            <div style={{textAlign:"center",padding:5,fontSize:20,color:"#2F4F4F"}}>My Account</div>
            <div className="account-container">
                    <div className="account-container-row">
                        <div className="account-container-col">First Name</div>
                        <div className="account-container-col">{user.firstname===undefined || user.firstname===null?"-":user.firstname}</div>
                        <div className="account-container-col">
                            <input type="button" className="account-container-col-btn" onClick={()=>{navigate("/edit-account?edit=firstname")}} value={"Edit"}/>
                        </div>
                    </div>
                    <div className="account-container-row">
                        <div className="account-container-col">Last Name</div>
                        <div className="account-container-col">{user.lastname===undefined || user.lastname===null?"-":user.lastname}</div>
                        <div className="account-container-col">
                            <input type="button" className="account-container-col-btn" onClick={()=>{navigate("/edit-account?edit=lastname")}} value={"Edit"}/>
                        </div>
                    </div>
                    <div className="account-container-row">
                        <div className="account-container-col">Email</div>
                        <div className="account-container-col">{user.email===undefined || user.email===null?"-":user.email}</div>
                        <div className="account-container-col">
                           
                        </div>
                    </div>
                    <div className="account-container-row">
                        <div className="account-container-col">Phone</div>
                        <div className="account-container-col">{user.phone===undefined || user.phone===null?"-":user.phone}</div>
                        <div className="account-container-col">
                               <input type="button" className="account-container-col-btn" onClick={()=>{navigate("/edit-account?edit=phone")}} value={"Edit"}/>
                        </div>
                    </div>
               
            </div>
        </>
    )


}

export default Account;