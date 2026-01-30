import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Please provide your name'],
        trim:true,
        minlength:[3,'Name must be at least 3 characters long'],
    },
    email:{
        type:String,
        required:[true,'Please provide your email'],    
        unique:true,
        trim:true,
        lowercase:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Please provide a valid email address'],
    },
    password:{
        type:String,
        required:[true,'Please provide a password'],    
        minlength:[6,'Password must be at least 6 characters long'],
        select:false,
    },
    profileImage:{
        type:String,
        default:null,
    },
},{
    timestamps:true,
});

//Encrypt password before saving user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return ;   // ✅ STOP execution
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
});


//Match user entered password to hashed password in database
userSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};

const User=mongoose.model('User',userSchema);

export default User;