const nodemailer = require('nodemailer');
const pug= require('pug');
const { htmlToText } = require('html-to-text');
const {google}= require('googleapis');







module.exports=class email{
    constructor(user,url){
        this.to=user.email;
        this.firstName=user.name.split(' ')[0];
        this.from=`<${process.env.EMAIL_FROM}>`
        this.url=url;

    }


   newTranspot(){
        if(process.env.NODE_ENV === 'production')
        {
            const oAuth2Client =new google.auth.OAuth2(process.env.CLIENT_ID,process.env.CLIENT_SECRET,process.env.REDIRECT_URL)
            oAuth2Client.setCredentials({refresh_token:process.env.REFRESH_TOKEN})
            const acessToken= oAuth2Client.getAccessToken();
            return nodemailer.createTransport({
                service:'gmail',
                auth:{
                    type:'OAuth2',

                    user:process.env.EMAIL_FROM,
                    clientId:process.env.CLIENT_ID,
                    clientSecret:process.env.CLIENT_SECRET,
                    refreshToken:process.env.REFRESH_TOKEN,
                    acessToken:acessToken
                }
            })
        }
        return nodemailer.createTransport({
            host:process.env.EMAIL_HOST,
            port:process.env.EMAIL_PORT*1,
            auth:{
                user:process.env.EMAIL_USERNAME,
                pass:process.env.EMAIL_PASSWORD
            },
            
        });

      
    }
    async send(template,subject){
        const html= pug.renderFile(`${__dirname}/../views/email/${template}`,{
            firstName:this.firstName,
            url:this.url,
            subject
        });
     const   mailOptions={
            from:this.from,
            to :this.to,
            subject,
            html,
            text:htmlToText(html)
        };
        await this.newTranspot().sendMail(mailOptions)
            
    }
    async sendWelcome(){
    await this.send('Welcome','Welcome To Our Natour Family')
   
    }

    async sendReset(){
        await this.send('passwordReset','This Link Valid Only For 10 Minutes!!')
    }
}

    
    // Defining Options
    






