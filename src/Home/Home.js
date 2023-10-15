
import { useEffect, useRef, useState} from "react";
import "../css/home.css";
import BoxComponent from "./Box";
import SliderComponent from "./Slider";
import properties from "../properties/properties.json";
import InfiniteScroll from "react-infinite-scroll-component";
import ReactLoading from "react-loading";

function Home(){
    const topicRef=useRef([]);
    const [topics,setTopics]=useState(topicRef.current);
    const lastTopic=useRef();
    const hasMore=useRef(true);

    useEffect(()=>{
        topicRef.current=[];
        lastTopic.current=undefined;
        hasMore.current=true;
        fetchTopics(true);
    },[])

    function fetchTopics(initial){
        
        let getInfo={}
        let url=properties.remoteServer+"/public/api/topics_to_display";

        if(lastTopic.current!==undefined){
           getInfo.paginationKey=lastTopic.current.id;
        }

        if(initial===undefined && lastTopic.current===undefined){
            return;
        }
        
        try{
            fetch(url,{
            method:"POST",
            credentials: "include",
            body:JSON.stringify(getInfo),
            headers: {
                'Content-Type': 
                'application/json;charset=utf-8'    
            }
            }).then(
            (stream)=>stream.json()
            ).then(
            (json)=>{
                if(json.status===2000){
                            
                        if(json.content.length!==3){
                            hasMore.current=false;
                        }

                        let topics=json.content;
                        if(topics.length>0){
                            lastTopic.current=topics[topics.length-1];
                            if(initial){
                                topicRef.current=topics;
                            }else{
                                topicRef.current=topicRef.current.concat(topics);
                            }
                        }

                        setTopics(topicRef.current);

                      
                }
            }
            )
        }catch(error){
              console.log(error)
        }
   }

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
             <InfiniteScroll  dataLength={topics.length} next={fetchTopics}
                             hasMore={hasMore.current} scrollableTarget="scrollableDiv" 
                             loader={!hasMore.current && <div style={{marginTop:10,display:"flex",alignItems:"center",justifyContent:"center"}}>
                                        <ReactLoading type="bars" color="maroon"
                                        height={100} width={50} />
                                    </div>}>
                                    
                                    <div className="component-margin">
                                        {renderTopics()}
                                    </div>  
            </InfiniteScroll>
          
        </div>
    )
}

export default Home;