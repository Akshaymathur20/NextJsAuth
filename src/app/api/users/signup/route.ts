import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import { NextRequest,NextResponse} from 'next/server'
import becyptjs from 'bcryptjs'

import { sendEmail } from '@/helpers/mailer'
import { verify } from 'crypto'
import { userInfo } from 'os'


connect()

export async function POST(request:NextRequest){

    try {
      const reqBody= await request.json()
      const {username,email,password}= reqBody
      //validation
      console.log(reqBody);


      //check if it is present oor not
      const user =await User.findOne({email})
      if(user){
        return NextRequest.json({error:"User already exists"},{status:400})
      }

      const salt =  await becyptjs.genSalt(10);
      const hashedPassword = await becyptjs.hash(password,salt)


      const newUser=new User({
        username,
        email,
        password:hashedPassword
      })
  
      const savedUser= await newUser.save()
      console.log(savedUser);

      //sending verification mail
     
      await sendEmail({email,emailType:"VERIFY",userId:savedUser._id})

      return NextResponse.json({
        message:"User registered Succesfully",
        success:true,
        savedUser
      })

    } catch (error:any) {
       return NextResponse.json({error:error.message},{status:500})   
    }
}

// localhost:3000/api/users/signup