import jwt from 'jsonwebtoken';
import User from '../models/User.js';


const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
}

export const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ success: false, error: userExists.email === email ? 'Email already registered' : 'Username already in use', statusCode: 400 });
        }
        const user = await User.create({ username, email, password });
        const token = generateToken(user._id);
        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    profileImage: user.profileImage,
                    createdAt: user.createdAt,
                },
                token,
            },
            message: 'User registered successfully',
            statusCode: 201,
        });
    } catch (error) {
        console.log(error.message);
        next(error);
    
}   
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({success:false,error:'Please provide email and password',statusCode:400});
        }
        const user = await User.findOne({email}).select('+password');
        if(!user){
            return res.status(401).json({success:false,error:'Invalid email or password',statusCode:401});
        }
        const isMatch = await user.matchPassword(password);
        if(!isMatch){
            return res.status(401).json({success:false,error:'Invalid email or password',statusCode:401});
        }
        const token = generateToken(user._id);
        // console.log(token);
        
        res.status(200).json({
            success:true,
            data:{
                user:{
                    id:user._id,
                    username:user.username,
                    email:user.email,
                    profileImage:user.profileImage,
                    createdAt:user.createdAt,
                },
                token,
                message:'User logged in successfully',
                statusCode:200,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found', statusCode: 404 });
        }
        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    profileImage: user.profileImage,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

export const updateUserProfile = async (req, res, next) => {
    try {
        const {username,email,profileImage} = req.body;
        const user = await User.findById(req.user._id);
        if(!user){
            return res.status(404).json({success:false,error:'User not found',statusCode:404});
        }
        user.username = username || user.username;
        user.email = email || user.email;
        user.profileImage = profileImage || user.profileImage;
        await user.save();
        res.status(200).json({
            success:true,   
            data:{
                user:{
                    id:user._id,
                    username:user.username,
                    email:user.email,
                    profileImage:user.profileImage,
                    
                },
                message:'User profile updated successfully',
                statusCode:200,
            },
        });

    } catch (error) {
        next(error);
    }
};

export const changeUserPassword = async (req, res, next) => {

    try {
        const {  newPassword } = req.body;
        if(!newPassword){
            return res.status(400).json({success:false,error:'Please provide current and new password',statusCode:400});
        }
        const user = await User.findById(req.user._id).select('+password');
        
        user.password = newPassword;
        await user.save();
        res.status(200).json({
            success:true,
            message:'Password changed successfully',
            statusCode:200,
        });
    } catch (error) {
        next(error);
    }
};


export default {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    changeUserPassword,
};
