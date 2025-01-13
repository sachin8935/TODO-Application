const mongoose = require('mongoose');
const { Schema } = mongoose;
var userSignup=new Schema({
    firstName:{
        type:String,
        // required:true,
        trim:true,
    },
    lastName:{
        type:String,
        // required:true,
        trim:true,
    },
    email:{
        type:String,
        // required:true,
    },
    password:{
        type:String,
        // required:true
    },
    todo: [
        {
        type: Schema.Types.ObjectId, // Reference to the user who owns this todo
        ref: 'Todo',
        // required: true,
    },
],
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('signUp',userSignup);