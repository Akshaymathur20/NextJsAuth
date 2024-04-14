import { error, log } from "console";
import mongoose from "mongoose";

export async function connect(){
  try{

    //here we can also use if  else condition to check what variables comes 
    mongoose.connect(process.env.MONGO_URI!)
    ///we use varible because sometimes error comes after connection
    const connection = mongoose.connection

    connection.on('connected',()=>{
        console.log("MongoDB connected");
    })
    connection.on('error',(err)=>{
        console.log('MongoDB connection error, please make sure db is up and running'+ err);
        process.exit()
    })


  }
  catch(error){
    console.log("Something went wrong in connecting to DB");
    console.log(error);
  }
}