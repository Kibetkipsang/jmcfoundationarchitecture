import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma'


export const register = async (req, res) => {
    try{
        const {email, username, password} = req.body;
        

        // Validation 

        if(!email || !username || !password){
            return res.status(400).json({
                error: "All fields required."
            })
        }
        
        if(password.length < 6){
            return res.status(400).json({
                error: "Password must be at leat 6 characters."
            })
        }
        
        const existingEmail = await prisma.user.findUnique({
            where: {email}
        });

        if(existingEmail){
            return res.status(409).json({
                error: "Email already in use."
            })
        }

        const existingUser = await prisma.user.findUnique({
            where: {username}
        })

        if(existingUser){
            return res.status(409).json({
                error: "Username already in use."
            })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {email, username, password: hashedPassword},
            select: {
                id: true,
                email: true,
                username: true,
                createdAt: true
            }
        })

        res.status(201).json({
            message: "User creeated successfully.", 
            user: user
        })

    }catch(err){
        console.log("Registration Error.", err)
        return res.status(500).json({
            error: "Something went wrong. Please try again later."
        })
    }
};

export const login = async (req, res) => {
    try{

        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                error: "All fields required."
            })
        }

        const user = await prisma.user.findUnique({
            where: {email}
        });

        if(!user){
            return res.status(401).json({
                error: "Invalid email or password."
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({
                error: "Invalid email or password."
            })
        }

        const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '15m'})
        
        res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            }
        });

    }catch(err){
        console.log("Login Error,", err)
        return res.status(500).json({
            error: "Something went wrong. Please try again later."
        })
    }
};

export const getMe = async (req, res) => {
    try{
        const user = await prisma.user.findUnique({
            where: {id: req.user.id},
            select: {
                id: true, 
                email: true,
                username: true,
                createdAt: true
            }
        })

        if(!user){
            return res.status(404).json({
                error: "User not found."
            })
        }

        res.json({user})
    }catch(err){
        console.log("Getme Error", err)
        return res.status(500).json({
            error: "Something went wrong. Please try again later."
        })
    }
};


export const logout = async (req, res) => {
    try{
        res.status(200).json({
            message: "Logged out succesfully"
        })
    }catch(err){
        console.log("Logout Error", err)
        return res.status(500).json({
            error: "Something went wrong. Please try again later."
        })
    }
}
