import { useNavigate } from "react-router-dom";
import "../css/box.css";

function BoxComponent(props){
    const navigate=useNavigate();
    return (
        <div className="box-container" onClick={()=>{ navigate("/view-item/"+props.variant.variantId);}} >
             <img className="box-img" alt="box-img" src={props.variant.images[0].url}/>
             <div className="box-description">
                <div className="font-style-item-price">{props.variant.item.productItemName}</div>
                <div className="font-style-variant">{props.variant.name}</div>
                <div className="font-style-item-price">Price:{props.variant.price}</div>
             </div>
        </div>
    )
}

export default BoxComponent;