import { createContext,useEffect,useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Header from './auth-components/header';
import LoginPage from './auth-components/Login';
import SignUpPage from './auth-components/SignUp';
import properties from "./properties/properties.json";
import EmailForm from './auth-components/EmailForm';
import OtpForm from './auth-components/OtpForm';
import ChangePasswordForm from './auth-components/ChangePassword';
import SignupOtpForm from './auth-components/SignupOtpForm';
import Home from './Home/Home';
import Category from './admin-components/category';
import AdminHeader from './admin-components/AdminHeader';
import ActionCategory from './admin-components/ActionCategory';
import Product from './admin-components/product';
import ActionProduct from './admin-components/ActionProduct';
import Size from './admin-components/size';
import ActionSize from './admin-components/ActionSize';
import Item from './admin-components/item';
import ActionItem from './admin-components/ActionItem';
import Variant from './admin-components/variant';
import ActionVariant from './admin-components/ActionVariant';
import Images from './admin-components/image';
import ActionImage from './admin-components/ActionImage';
import Inventory from './admin-components/inventory';
import ActionInventory from './admin-components/ActionInventory';
import Topic from './admin-components/topic';
import ActionTopic from './admin-components/ActionTopic';
import Relation from './admin-components/relation';
import ActionRelation from './admin-components/ActionRelation';
import Color from './admin-components/color';
import ActionColor from './admin-components/ActionColor';
import ViewItem from './Home/ViewItem';
import BannerImages from './admin-components/banner-image';
import ActionBanner from './admin-components/ActionBanner';
import ProductVariants from './Home/ProductVariants';
import { useRef } from 'react';
import Cart from './Home/Cart';
import Checkout from './Home/Checkout';
import Account from './Home/Account';
import EditAccount from './Home/EditAccount';
import NotFound from './auth-components/NotFound';
import Support from './Home/Support';
import Conditions from './Home/Conditions';
import Privacy from './Home/Privacy';
import Refund from './Home/Refund';
import Shipping from './Home/Shipping';
import Order from './admin-components/order';
import Payment from './Home/Payment';


const UserContext=createContext();

function App() {
  const [logged, setLogged] = useState(false);
  const [render,setRender]=useState(false);
  const [credential,setCredential]=useState("");
  const [user,setUser]=useState({"firstname":"","roleid":"","userid":""});
  const scrollToRef = useRef();
  const path=useLocation();
  const [cartCount,setCartCount]=useState(0);

  const value={
    logged:logged,
    setLogged:setLogged,
    user:user,
    setUser:setUser,
    credential:credential,
    setCredential:setCredential,
    cartCount:cartCount,
    setCartCount:setCartCount,
    scroll:scrollToRef
  }

  useEffect(()=>{
        if(scrollToRef.current!==undefined){
           scrollToRef.current.scrollIntoView();
        }
  },[path])

  useEffect(()=>{
    const checkUser=async ()=>{
       try{
         await fetch(properties.remoteServer+"/checkUser",{
          method:"GET",
          credentials: "include",
          headers:{
            "accept":"application/json;charset=utf-8"
          }
          } 
          ).then(res=>res.json()).then(json=>{
            if(json.status===2001){
                setLogged(true);
                let content=JSON.parse(json.content);
                setCredential(content.csrfToken);
                setUser((user)=>{
                  user["userid"]=content.userid;
                  user["roleid"]=content.roleid;
                  user["firstname"]=content.username;
                  return {...user};
                });
            }
        })
       }catch(err){
         console.log(err)
       }finally{
           setRender(true)
       }
    };

    checkUser();
  },[])

  function renderComponent(){
    if(render){
       return(
        <div className='App' id="scrollableDiv">
          <div ref={scrollToRef}></div>
          <Routes>
            <Route path='/admin/hack' element={<AdminHeader/>}>
                <Route index element={<Category/>}/>
                <Route path='category' element={<Category/>}/>
                <Route path='category/add' element={<ActionCategory operation="add"/>}/>
                <Route path='category/:id/edit' element={<ActionCategory operation="edit"/>}/>
                <Route path='product' element={<Product/>}/>
                <Route path='product/add' element={<ActionProduct operation="add"/>}/>
                <Route path='product/:id/edit' element={<ActionProduct operation="edit"/>}/>
                <Route path='product/:id/size' element={<Size/>}/>
                <Route path='product/:id/size/add' element={<ActionSize operation="add"/>}/>
                <Route path='product/:id/size/:sizeId/edit' element={<ActionSize operation="edit"/>}/>
                <Route path='item' element={<Item/>}/>
                <Route path='item/add' element={<ActionItem operation="add"/>}/>
                <Route path='item/:id/edit' element={<ActionItem operation="edit"/>}/>
                <Route path='item/:id/variant' element={<Variant/>}/>
                <Route path='item/:id/variant/add' element={<ActionVariant operation="add"/>}/>
                <Route path='item/:id/variant/:variantId/edit' element={<ActionVariant operation="edit"/>}/>
                <Route path='item/:id/variant/:variantId/image' element={<Images/>}/>
                <Route path='item/:id/variant/:variantId/images/add' element={<ActionImage operation="add"/>}/>
                <Route path='item/:id/variant/:variantId/images/:imageId/edit' element={<ActionImage operation="edit"/>}/>
                <Route path='item/:id/variant/:variantId/inventory' element={<Inventory/>}/>
                <Route path='item/:id/variant/:variantId/inventory/add' element={<ActionInventory operation="add"/>}/>
                <Route path='item/:id/variant/:variantId/inventory/:inventoryId/edit' element={<ActionInventory operation="edit"/>}/>
                <Route path='topics' element={<Topic/>}/>
                <Route path='topics/add' element={<ActionTopic operation="add"/>}/>
                <Route path='topics/:id/edit' element={<ActionTopic operation="edit"/>}/>
                <Route path='topics/:topicId/relations' element={<Relation/>}/>
                <Route path='topics/:topicId/relations/add' element={<ActionRelation/>}/>
                <Route path='color' element={<Color/>}/>
                <Route path='color/add' element={<ActionColor operation="add"/>}/>
                <Route path='color/:id/edit' element={<ActionColor operation="edit"/>}/>
                <Route path='banners' element={<BannerImages/>}/>
                <Route path='banners/add' element={<ActionBanner operation="add"/>}/>
                <Route path='banners/:imageId/edit' element={<ActionBanner operation="edit"/>}/>
                <Route path='orders' element={<Order/>}/>
            </Route>
            <Route path="/" element={<Header/>}>
              <Route index element={<Home/>} />
              <Route path="loginPage" element={<LoginPage />} />
              <Route path="signupPage" element={<SignUpPage />} />
              <Route path="otpvalidationform" element={<SignupOtpForm/>} />
              <Route path="forgotpassword" element={<EmailForm/>} />
              <Route path="otpform" element={<OtpForm/>}/>
              <Route path="changepassword" element={<ChangePasswordForm/>} />
              <Route path="view-item/:variantId"  element={<ViewItem/>}/>
              <Route path="products/:productId/items"  element={<ProductVariants/>}/>
              <Route path="items"  element={<ProductVariants/>}/>
              <Route path="view-cart"  element={<Cart/>}/>
              <Route path="checkout"  element={<Checkout/>}/>
              <Route path="my-account"  element={<Account/>}/>
              <Route path="edit-account"  element={<EditAccount/>}/>
              <Route path="customer-care"  element={<Support/>}/>
              <Route path="terms&conditions"  element={<Conditions/>}/>
              <Route path="privacy-policy"  element={<Privacy/>}/>
              <Route path="refund-policy"  element={<Refund/>}/>
              <Route path="shipping-policy"  element={<Shipping/>}/>
              <Route path="payment/:orderId"  element={<Payment/>}/>
            </Route>
            <Route path='*' element={<NotFound/>}/>
          </Routes>
      </div>
    
       )
    }
  }
  return (

    <UserContext.Provider value={value}>
        {renderComponent()}
    </UserContext.Provider>
  );

}

export {UserContext};
export default App;
