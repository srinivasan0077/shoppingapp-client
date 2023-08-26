
import { useEffect, useState} from "react";
import "../css/home.css";
import BoxComponent from "./Box";
import SliderComponent from "./Slider";
import properties from "../properties/properties.json";

function Home(){
    const [topics,setTopics]=useState([]);

    useEffect(()=>{
        fetch(properties.remoteServer+"/public/api/topics_to_display",{
            credentials: "include"
            }).then(
            (stream)=>stream.json()
            ).then(
            (json)=>{
                if(json.status===2000){
                    setTopics(json.content);
                }
            }
        )
    },[])

    function renderItems(variants){
        return (
            variants.map(variant=>{
                return (
                    <div key={variant.variantId}>
                       <BoxComponent variant={variant}/>
                    </div>
                )
            })
        )
    }

    function renderTopics(){
        console.log(topics)
        return (
            topics.map(topic=>{
                return (
                    <div style={{marginTop:10}} key={topic.id}>
                        <div className="topic-style">{topic.name}</div>

                        <div className="grid-container">
                             {renderItems(topic.variants)}
                        </div>
                    </div>
                )
            })
        )
    }
    return(
        <div className="home-page">
           <SliderComponent/>
           <div className="component-margin">
               {renderTopics()}
           </div>
        </div>
    )
}

export default Home;