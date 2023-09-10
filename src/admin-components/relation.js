import {useContext, useEffect, useState } from "react";
import properties from "../properties/properties.json";
import "../admin-styles/general.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../App";

function Relation(){
    const [relations,setTopics]=useState([]);
    const {topicId}=useParams();
    const navigate=useNavigate();
    const [topic,setTopic]=useState({});
    const {credential,logged,user}=useContext(UserContext);

    useEffect(()=>{
        if(!logged || user.roleid!==2){
            navigate("/",{replace:true});
            return;
        }
        fetch(properties.remoteServer+"/admin/api/topics/"+topicId,{
            credentials: "include",
            headers: {
                'csrfToken':credential
            }
       }).then(
       (stream)=>stream.json()
       ).then(
       (json)=>{
           if(json.status===2000){
               setTopic(json.content);
           }
       }
       )
        fetchTopicVariantRelations();
    },[])

    function fetchTopicVariantRelations(){
      
         fetch(properties.remoteServer+"/admin/api/topics/"+topicId+"/relations",{
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
                    console.log(json)
                }
            }
         )

    }

    async function removeRelation(variantId,link){
         
        if(link.target.disabled===false || link.target.disabled===undefined){
           let input={
               variantId:variantId,
               topicId:topicId
            }
           link.target.disabled=true;
           await fetch(properties.remoteServer+"/admin/api/topic_variant_relation",{
               credentials: "include",
               method:"DELETE",
               body:JSON.stringify(input),
               headers: {
               'Content-Type': 
               'application/json;charset=utf-8',
                'csrfToken':credential
            
               }
           }).then(res=>res.json()).then(json=>{
           
               if(json.status===2000){
                   fetchTopicVariantRelations();
                   alert(json.message);
               }else{
                   alert(json.message);
               }
           }) 
           link.target.disabled=false;
        }
       
  }

    function renderTopicVariantRelations(){
        return(
            relations.map(relation=>{
                return(
                    <tr key={relation.variantId} style={{backgroundColor:(relation.item.isActive && relation.isActive)?"lightgreen":"white"}}>
                        <td>{relation.variantId}</td>
                        <td>{relation.name}</td>
                        <td>{relation.item.productItemName}</td>
                        <td>{(relation.item.isActive && relation.isActive)?"Active":"InActive"}</td>
                        <td>  
                             <Link onClick={(e)=>{removeRelation(relation.variantId,e)}}  className="link-style">Remove</Link>
                        </td>
                    </tr>
                )
            })
         )
    }


    return(
           <>
              <h3 style={{textAlign:"center",padding:20,color:"maroon"}}>Variant relations for '{topic.name}'</h3>
              <div style={{margin:20}}>
                        <input type={"button"} className="general-btn-style"  onClick={()=>{navigate("/admin/hack/topics/"+topicId+"/relations/add")}}  value=" New "/>
              </div>
              <table className="table" style={{margin:20}}>
                <thead>
                    <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Variant Name</th>
                    <th scope="col">Item Type</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                     {renderTopicVariantRelations()}
                </tbody>
                </table>

           </>
    );
}

export default Relation;