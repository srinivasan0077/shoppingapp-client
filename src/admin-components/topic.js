import {useEffect, useState,useContext } from "react";
import properties from "../properties/properties.json";
import "../admin-styles/general.css";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";

function Topic(){
    const {credential}=useContext(UserContext);
    const [topics,setTopics]=useState([]);
    const navigate=useNavigate();

    useEffect(()=>{
        fetchTopics();
    },[])

    function fetchTopics(){
         fetch(properties.remoteServer+"/admin/api/topics",{
            credentials: "include",
            headers: {
                'csrfToken':credential
            }
          }).then(
            (stream)=>stream.json()
         ).then(
            (json)=>{
                if(json.status===2000){
                    setTopics(json.content);
                }
            }
         )
    }

    function renderTopics(){
        
         return(
            topics.map(topic=>{
                return(
                    <tr key={topic.id}>
                        <td>{topic.id}</td>
                        <td>{topic.name}</td>
                        <td>{(topic.active===false)?"Not Active":"Active"}</td>
                        <td>  
                             <Link to={"/admin/hack/topics/"+topic.id+"/edit"} className="link-style">Edit</Link>
                             <Link to={"/admin/hack/topics/"+topic.id+"/relations"} className="link-style">Relations</Link>
                        </td>
                    </tr>
                )
            })
         )
    }


    return(
           <>
              <h3 style={{textAlign:"center",padding:20,color:"maroon"}}>Topics</h3>
              <div style={{margin:20}}>
                        <input type={"button"} className="general-btn-style"  onClick={()=>{navigate("/admin/hack/topics/add")}}  value=" New "/>
              </div>
              <table className="table" style={{margin:20}}>
                <thead>
                    <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Name</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                     {renderTopics()}
                </tbody>
                </table>

           </>
    );
}

export default Topic;