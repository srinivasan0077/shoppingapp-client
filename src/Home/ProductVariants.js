
import { useEffect,useRef,useState} from "react";
import "../css/home.css";
import "../css/general.css";
import BoxComponent from "./Box";
import properties from "../properties/properties.json";
import { useParams, useSearchParams } from "react-router-dom";


function ProductVariants(){
    const {productId}=useParams();
    const variantComponents=useRef([]);
    const [comps,setComps]=useState(variantComponents.current)
    const lastVariant=useRef();
    const hasMore=useRef(true);
    const [header,setHeader]=useState({});
    const [queryParameters] = useSearchParams();
    const search=queryParameters.get("search");

    useEffect(()=>{
        variantComponents.current=[];
        lastVariant.current=undefined;
        hasMore.current=true;
        fetchVariants(true);
        fetchHeaderDetails();
    },[productId,search])

    function fetchHeaderDetails(){
        if(productId!==null && productId!==undefined){
            fetch(properties.remoteServer+"/public/api/headers/"+productId,{
                method:"GET",
                credentials: "include"
            }).then(
                (stream)=>stream.json()
            ).then(json=>{
                if(json.status===2000){
                    setHeader(json.content)
                }
            })
        }else{
            setHeader({})
        }
    
    }

    function fetchVariants(initial){
        let getInfo={}
        let url=properties.remoteServer+"/public/api/products/"+productId+"/variants";

        if(search!==undefined && search!==null){
              getInfo.filterBy="name";
              getInfo.filterValue=search;
              url=properties.remoteServer+"/public/api/variants";
        }

        if(lastVariant.current!==undefined){
           getInfo.paginationKey=lastVariant.current.variantId;
        }

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
                        if(json.content.length===0){
                            hasMore.current=false;
                            if(initial){
                                setComps(variantComponents.current);
                            }
                            return;
                        }

                        let variants=json.content;
                        if(variants.length>0){
                            lastVariant.current=variants[variants.length-1];
                            if(initial){
                                variantComponents.current=variants;
                            }else{
                                variantComponents.current=variantComponents.current.concat(variants);
                            }
                        }

                        setComps(variantComponents.current);


               }
           }
        )
   }

   function loadMore(){
        if(hasMore.current){
            fetchVariants(false);
        }
   }


    return(
        <>
        <div className="home-page">
           <div className="component-margin">
                   <div style={{marginTop:10}}>
                       
                            <div className="topic-style">{header.productName}</div>  
                            <div className="grid-container" id="variant-component">
                                {comps.map(variant=>{
                                            return (
                                                <div key={variant.variantId}>
                                                    <BoxComponent variant={variant}/>
                                                </div>
                                            )
                                })}
                            </div>
                            <div className="center-the-item" style={{margin:20}}>
                               <button onClick={loadMore} className="general-maroon-btn-style">Load More</button>
                            </div>
                      
                    </div>
           </div>
        </div>
        </>
    )
}

export default ProductVariants;