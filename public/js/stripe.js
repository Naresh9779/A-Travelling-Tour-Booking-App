
import axios from 'axios';
const stripe=Stripe('pk_test_51Op2xvSDKsAVOdzPRYtwk6UWSJ9BzNfbBoPCPgCrCuzkcSxgBW6PlE87lqqsZsWZAt8EzlkM9AQv0dh20wA5fWUX00EVO0mQZG')
import {showAlert} from './alert'
export const bookTour=async(tourId)=>{
    
try{const session=await axios( `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`)

     console.log(session)
    await stripe.redirectToCheckout({
        sessionId:session.data.data.session.id
    })}
    catch(err)
{
    showAlert('error',err);
}}
    
    
   

    
