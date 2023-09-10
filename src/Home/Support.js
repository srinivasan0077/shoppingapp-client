
import {FaAddressBook, FaAddressCard, FaMailBulk,FaPhoneAlt} from 'react-icons/fa';
import "../css/login.css";
import "../css/support.css";

function Support(){


    return (
        <>
            <div style={{textAlign:"center",padding:5,fontSize:20,color:"#2F4F4F"}}>Customer Support</div>
            <div className='login-result-container'>
                <div className='support-container'>
                    <div className='support-container-child'>
                        <FaPhoneAlt style={{color:"maroon",fontSize:20,marginRight:10}}/>
                        <div>9080110805</div>
                    </div>
                    <div className='support-container-child'>
                        <FaMailBulk style={{color:"maroon",fontSize:20,marginRight:10}}/>
                        <div>royallcustomerservice1@gmail.com</div>
                    </div>
                    <div className='support-container-child'>
                        <FaAddressCard style={{color:"maroon",fontSize:20,marginRight:10}}/>
                        <div>No:50,5th Cross,Sakthi Nagar,Saram,Puducherry 605013</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Support;