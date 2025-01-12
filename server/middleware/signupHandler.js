const newUser= require('../models/signupSchema');
const z= require('zod');
const userEmailCheck= async(req,res,next)=>{
    try{
    const {firstName,lastName,email,password}=req.body;
    const schema=z.object({
        firstName:z.string().min(1,{
            message:'Name is required'
        }),
        lastName:z.string().min(1,{
            message:'Name is required'
        }),
        email:z.string().email({
            message:'Please Enter the email'
        }),
        password:z.string().min(8)
    })
    schema.parse({firstName,lastName,email,password});
    const existingUser= await newUser.findOne({email});
    if(existingUser){
        return res.status(409).json({
            status:"error",
            message:"the user with mail id already exists"
        })
    }
    next();
}
    catch(err){
        console.log(err);
        if(err instanceof z.ZodError){
            return res.status(400).json({
                status:"error",
                message:"Validation failed",
                errors:err.errors.map((e)=>({field:e.path[0],message:e.message}))
            })
        }
        res.status(500).json({
            status:"error",
            message:"Intenal sever error2"
        })
    }
}
module.exports= userEmailCheck;