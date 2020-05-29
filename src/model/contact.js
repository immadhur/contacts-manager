const mongoose=require('mongoose');
const validator=require('validator');

const schema=mongoose.Schema({
    firstName:{
        require:true,
        type:String,
        trim:true
    },
    lastName:{
        require:true,
        type:String,
        trim:true
    },
    email:{
        require:true,
        type:String,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email!');
            }
        }
    },
    phone:{
        require:true,
        type:String,
        unique:true,
        validate(value){
            if(!validator.isMobilePhone(String(value), "en-IN")){
                throw new Error('Invalid mobile number!');
            }
        }
    },
    status:{
        require:true,
        type:String,
    }
})

module.exports=mongoose.model('Contact', schema);