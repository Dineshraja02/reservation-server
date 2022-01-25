const db = require("../mongo");
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');

const service = {
    async register(req,res) {
        try {
            const user = await db.auth.findOne({email: req.body.email})
            if(user)return res.status(400).send({error:"User already exist"})
            
            const salt= await bcrypt.genSalt(10);
            req.body.password= await bcrypt.hash(req.body.password,salt);
            await db.auth.insertOne(req.body);

            res.send({message:"user registered successfully"})
            
        } catch (error) {
            console.log("Error Registering User - ",error);
            res.sendstatus(500)
        }
    },
    async login(req,res){
        try {
            const user = await db.auth.findOne({email: req.body.email})
            if(!user)return res.status(400).send({error:"User not exist"})

            const isValid=await bcrypt.compare(req.body.password,user.password);
            if(!isValid) return res.status(403).send({error:"Email or Password Not Exist"})

            const token= jwt.sign({userId:user._id,email:user.email},process.env.authpass,{expiresIn:'2h'})
            res.header('auth',token).send(token);
           
        } catch (error) {
            console.log("Error login User - ",error);
            res.status(500);
        }
    } 
}

module.exports = service;