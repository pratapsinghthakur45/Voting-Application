import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
      name:{
        type:String,
        required: true,
      },
      age:{
        type: Number,
        required: true,
      },
      email:{
        type: String,
      },
      mobileNo:{
        type: String,
      },
      aadharCard:{
        type: Number,
        required: true,
        unique: true,
      },
      address:{
        type:String,
        required: true,
      },
      password:{
        type: String,
        required:true,
      },
      role:{
        type: String,
        enum: ['voter','admin'],
        default: 'voter'
      },
      isVoted:{
        type:Boolean,
        default:false
      }

});

//create user model
const User = mongoose.model('User',userSchema);

export default User;