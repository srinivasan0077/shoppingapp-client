import {useContext, useEffect, useState } from "react";
import properties from "../properties/properties.json";
import "../admin-styles/general.css";
import { Link, useNavigate} from "react-router-dom";
import ImageViewer from "react-simple-image-viewer";
import { UserContext } from "../App";

function BannerImages(){
    const [images,setImages]=useState([]);
    const navigate=useNavigate();
    const [currentImage, setCurrentImage] = useState([]);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const {credential,user,logged}=useContext(UserContext);
    useEffect(()=>{
        if(!logged || user.roleid!==2){
            navigate("/",{replace:true});
            return;
        }
        fetchImages();
    },[])

    function deleteImage(imageId){

        fetch(properties.remoteServer+"/admin/api/banners/"+imageId,{
            credentials: "include",
            method:"DELETE",
            headers: {
                'csrfToken':credential
            }
        }).then(
            (stream)=>stream.json()
        ).then(
            (json)=>{
                if(json.status===2000){

                    let filterdImages=images.filter((image)=>{
                        return image.imageId!==imageId;
                    })
                    setImages(filterdImages);
                }
            }
        )
    }

    function fetchImages(){
         
         fetch(properties.remoteServer+"/admin/api/banners",{
            credentials: "include",
            headers: {
                'csrfToken':credential
            }
          }).then(
            (stream)=>stream.json()
         ).then(
            (json)=>{
                if(json.status===2000){
                    setImages(json.content);
                }
            }
         )

    }

    const openImageViewer =(url) => {
        setCurrentImage([url]);
        setIsViewerOpen(true);
    };

    
    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
     };
    


    function renderImages(){
        
         return(
            images.map((image)=>{
                return(
                    <tr key={image.imageId}>
                        <td>{image.imageId}</td>
                        <td>{image.name}</td>
                        <td>{image.ord}</td>
                        <td>{image.url}</td>
                        <td>  
                       
                             <Link to={"/admin/hack/banners/"+image.imageId+"/edit"} className="link-style" >Edit</Link>
                             <Link  className="link-style" onClick={()=>{deleteImage(image.imageId)}}>Delete</Link>
                             <Link  className="link-style" onClick={()=>{openImageViewer(image.url)}}>View</Link>
                        </td>
                    </tr>
                )
            })
         )
    }


    return(
           <>
              <h3 style={{textAlign:"center",padding:20,color:"maroon"}}>Banners</h3>
              <div style={{margin:20}}>
                  <input type={"button"} className="general-btn-style" style={{marginRight:10}}  onClick={()=>{navigate("/admin/hack/banners/add")}}  value=" New "/>
              </div>
              <table className="table" style={{margin:20}}>
                <thead>
                    <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Name</th>
                    <th scope="col">Order</th>
                    <th scope="col">Image Url</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                     {renderImages()}
                </tbody>
                </table>
                
                {isViewerOpen && (
                        <ImageViewer
                        src={currentImage}
                        currentIndex={0}
                        onClose={closeImageViewer}
                        disableScroll={false}
                        backgroundStyle={{
                            backgroundColor: "rgba(0,0,0,0.9)"
                        }}
                        closeOnClickOutside={true}
                        />
                )}

           </>
    );
}

export default BannerImages;