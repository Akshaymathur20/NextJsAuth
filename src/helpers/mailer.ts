import User from '@/models/userModel';
import nodemailer from 'nodemailer'

import bcryptjs from 'bcryptjs';



export const sendEmail = async({email,emailType,userID}:any)=>{

  
  
  
  try {
    const hashedToken= await bcryptjs.hash(userID.toString(),10)

      if(emailType==="VERIFY"){
          await User.findByIdAndUpdate(userID,
            {verifyToken:hashedToken, verifyTokenExpiry:Date.now()+3600000})
      }else if(emailType==='RESEt'){
        await User.findByIdAndUpdate(userID,
          {forgotPasswordToken:hashedToken, forgotPasswordTokenExpiry:Date.now()+3600000})
      }else{

      }

       var transport = nodemailer.createTransport({
       host: "sandbox.smtp.mailtrap.io",
       port: 2525,
       auth: {
       user: "dac25661f8704b", //
       pass: "315c948093acd3" //
       }
      });

          const mailOptions={
            from: 'akshay@akshay.ai', // sender address
            to: email, 
            subject: emailType=='VERIFY'? "Verify your email":"Reset Your Passowrd",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType==="VERIFY"? "verify your email":"reset your password"} or copy and paste the link belore in your browser.<br>
            ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`, 
          }

         const mailResponse= await transport.sendMail(mailOptions)

         return mailResponse

        
    } catch (error:any) {
         throw new Error(error.message)
    }
}