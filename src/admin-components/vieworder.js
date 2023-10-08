import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../App";
import properties from "../properties/properties.json";


function ViewOrder(){
    const {credential,user,logged}=useContext(UserContext);
    const {orderId}=useParams();
    const [order,setOrder]=useState();
    const navigate=useNavigate();
    const [render,setRender]=useState(false);

    const colors={
        OPEN:"green",
        WAITING:"orange",
        CLOSED:"black",
        FAILED:"red"
    }

    useEffect(()=>{
        if(!logged || user.roleid!==2){
            navigate("/",{replace:true});
            return;
        }

        fetch(properties.remoteServer+"/admin/api/orders/"+orderId,{
            credentials: "include",
            headers: {
                'csrfToken':credential
            }
        }).then(
            (stream)=>stream.json()
        ).then(
            (json)=>{
                if(json.status===2000){
                    setOrder(json.content);
                    setRender(true);
                }
            }
        )
       
    },[])

    function renderItems(){
        return(
            order.inventories.map(inventory=>{
                return(
                    <tr key={inventory.inventoryId}>
                        <td>{inventory.variant.variantId}</td>
                        <td>{inventory.variant.name}</td>
                        <td>{inventory.variant.item.productItemId}</td>
                        <td>{inventory.variant.item.productItemName}</td>
                        <td>{inventory.size.name}</td>
                        <td>{inventory.variant.color.name}</td>
                        <td>{inventory.variant.price}</td>
                        <td>{inventory.orderedCount}</td>
                        <td><Link to={"/admin/hack/item/"+inventory.variant.item.productItemId+"/variant"} className="link-style">View</Link></td>
                    </tr>
                )
            })
         )
    }

    function renderShippingDetails(){
        let keys=Object.keys(order.shipTo);
        return(
              keys.map(key=>{
                if(order.shipTo[key]===undefined || order.shipTo[key]===null){
                    return;
                }
                return(
                    <tr key={key}>
                        <td>{key}</td>
                        <td>{order.shipTo[key]}</td>
                    </tr>
                )
              })
         )
    }

    function renderUserDetails(){
        if(order.orderedBy!==null && order.orderedBy!==undefined){
            return (
                <tr key={order.orderedBy.userid}>
                     <td>{order.orderedBy.userid}</td>
                     <td>{order.orderedBy.email}</td>
                     <td>{order.orderedBy.firstname}</td>
                     <td>{order.orderedBy.lastname}</td>
                     <td>{order.orderedBy.phone}</td>
                </tr>
            )
        }

    }


    return (
        <>
           <h3 style={{textAlign:"center",padding:20,color:"maroon"}}>Order No {orderId}</h3>
           {render &&
              <>
                  <h4 style={{color:colors[order.statusCode]}}>STATUS [{order.statusCode}]</h4>

                  <h4>Ordered Items</h4>
                  <table className="table" style={{margin:20}}>
                        <thead>
                            <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Name</th>
                            <th scope="col">Type Id</th>
                            <th scope="col">Type</th>
                            <th scope="col">Size</th>
                            <th scope="col">Color</th>
                            <th scope="col">Price</th>
                            <th scope="col">Ordered</th>
                            <th scope="col">View Item</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderItems()}
                        </tbody>
                </table>

                <h4>Shipping Details</h4>
                <table className="table" style={{margin:20}}>
                    
                        <tbody>
                            {renderShippingDetails()}
                        </tbody>
                </table>
                <h4>Ordered By</h4>
                <table className="table" style={{margin:20}}>
                    
                         <thead>
                            <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Email</th>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderUserDetails()}
                        </tbody>
                </table>
              </>
           }
        </>
    )
}

export default ViewOrder;