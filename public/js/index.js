import {login} from './login'
import {signup} from './login'

import '@babel/polyfill'
import { displayMap } from './mapbox';
import {logout} from './login';
import { userData } from './updateSetting';
import {bookTour} from './stripe';


const map=document.getElementById('map');
const loginForm=document.querySelector('.form--login')
const signupForm=document.querySelector('.signup-form')
const logoutBtn=document.querySelector('.nav__el--logout');
const updateDataBtn=document.querySelector('.form-user-data');
const updatePasswordBtn=document.querySelector('.btn--newpassword');
const bookingBtn=document.getElementById('booktour');
console.log(signupForm);


if(map)
{const locations = JSON.parse(document.getElementById('map').dataset.locations);

displayMap(locations);}

if(signupForm)
{
    document.querySelector('.signup-form').addEventListener('submit',async e=>{
        e.preventDefault();
        document.querySelector('.btn').textContent='Registering...'
        const form=new FormData();
        const name=document.getElementById('name').value
        const email=document.getElementById('email').value
        const password=document.getElementById('password').value
        const passwordConfirm=document.getElementById('passwordConfirm').value
       
      await  signup(name,email,password,passwordConfirm)
      document.querySelector('.btn').textContent='Sign Up'
}
)}


if(loginForm)
{document.querySelector('.form--login').addEventListener('submit', async e=>{
    e.preventDefault();
    
   const email= document.getElementById('email').value;
  const password=document.getElementById('password').value;
  
  login(email,password)
    
    


   
});}
if(logoutBtn){
logoutBtn.addEventListener('click',e=>{
    logout();
});}

if(updateDataBtn) {

    document.querySelector('.btn--save--setting').addEventListener('click',e=>{
        e.preventDefault();
        const form=new FormData();
        form.append('name',document.getElementById('name').value)
        form.append('email',document.getElementById('email').value)
        form.append('photo',document.getElementById('photo').files[0])
        

  
    userData(form,'data');
    
       

    })

}
if(updatePasswordBtn) {

    document.querySelector('.btn--newpassword') .addEventListener('click', async e=>{
        e.preventDefault();
        document.querySelector('.btn--newpassword').textContent='Updating...'
    
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

  
   await userData({passwordCurrent,password,passwordConfirm},'Password');
   document.querySelector('.btn--newpassword').textContent='SAVE PASSWORD'
    
       

    })

}

if(bookingBtn)
{
    bookingBtn.addEventListener('click',async e=>{
        e.target.textContent='Processing...';
       
    const tourId=document.getElementById('booktour').dataset.tourid;
    
    bookTour(tourId);

     } );
}


