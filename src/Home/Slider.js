import Carousel from "react-bootstrap/Carousel";
import "../css/slider.css";
import { useEffect, useState } from "react";
import properties from "../properties/properties.json";

function SliderComponent(){
    const [banners,setBanners]=useState([]);

    useEffect(()=>{
        fetch(properties.remoteServer+"/public/api/banners",{
            credentials: "include"
            }).then(
            (stream)=>stream.json()
            ).then(
            (json)=>{
                if(json.status===2000){
                    setBanners(json.content);
                }
            }
        )
    },[])

    function renderBanners(){
        
        return(
            banners.map(banner=>{
                return(
                    <Carousel.Item key={banner.imageId}>
                    <img
                    className="banner-img-style"
                    src={banner.url}
                    alt="First slide"
                    />
                   </Carousel.Item>
                )
            })
        )
    

}


    return (
        <div className="banner-container">
            <Carousel style={{zIndex:1}}>
                 {renderBanners()}
            </Carousel>
        </div>
    )
}

export default SliderComponent;