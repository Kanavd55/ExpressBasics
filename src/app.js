const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();
const { userAuth } = require('./middlewares/userAuth');
const { validateSignupData } = require('./utils/validation');
const bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cookieParser());
app.get("/test",(req,res)=>{
    res.send("Hello from the server")
})

app.get("/namaste",(req,res)=>{
    res.send("Hello from the namaste")
})

app.post('/user',userAuth,async(req,res)=>{
    //Creating a new instance of User model
    validateSignupData(req);
    const password = req.body.password;
    //hashing password
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;
    const user = new User(req.body);
    //saving data to db
    await user.save();
    res.send("User data saved");
})

app.get('/user',userAuth,async(req,res)=>{
    try{
        const userEmail = req.body.emailId;
        const password = req.body.password;
        const user = await User.findOne({emailId:userEmail});
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!user){
            return res.status(404).send("User not found");
        }
        console.log(isPasswordMatch)
        if(isPasswordMatch){
            //generating jwt token
            const token = await jwt.sign({_id:user._id},"scretfesfKey")
            res.cookie('token',token);
            return res.status(401).send(user);
        }else{
            throw new Error("Invalid credentials");
        }
    }catch(err){
        console.log(err);
        res.status(400).send("Something went wrong");
    }
})

app.get('/feed',userAuth,async(req,res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }catch(err){
        console.log(err);
        res.status(400).send("Something went wrong");
    }
})

app.delete('/user',userAuth,async(req,res)=>{
    try{
        const user = await User.findByIdAndDelete({_id: req.body.id});
        if(!user){
            return res.status(404).send("User not found");
        }else{
            res.send("User deleted successfully");
        }
    }catch(err){
        console.log(err);
        res.status(400).send("Something went wrong");
    }
})

app.patch('/user',userAuth,async(req,res)=>{
    try {
        const cookies = req.cookies;
        const {token} = cookies;
        if(!token){
            return res.status(401).send("Invalid Token");
        }
        const decoded = await jwt.verify(token, "scretfesfKey");
        const {_id} = decoded;
        const userId = _id;
        const data = req.body;
        const AllowedUpdates = ['age', 'gender', 'photoUrl', 'about', 'skills', 'isPremium', 'memberShipType'];
        const isUpdatedAllowed = Object.keys(data).every((key) => AllowedUpdates.includes(key));
        if(!isUpdatedAllowed){
            throw new Error("Invalid updates");
        }
        if(data?.skills?.length > 10){
            throw new Error("Skills cannot be more than 10");
        }
        const user = await User.findByIdAndUpdate({_id:userId}, data, { returnDocument: 'after', runValidators: true });
        res.send("User updated successfully");
    } catch (error) {
        console.log(error);
        res.status(400).send("Something went wrong");
        
    }
})

app.delete('/user',userAuth,async(req,res)=>{
    //deleting data from db
    res.send("User data deleted");
});

app.get('/uses',[(req,res,next)=>{
    console.log("Hi")
    next();
},(req,res,next)=>{
    console.log("Hello")
    next();
}],(req,res)=>{
    res.send("Hello from the uses")
})

app.post("/signup",(req,res)=>{
    //signup logic
    res.send("User signed up successfully");
})

app.get("/",(req,res)=>{
    res.send("Hello from the root")
})

connectDB().then(()=>{
    console.log("Database connected successfully");
    app.listen(7777,()=>{
    console.log("Server is listening successfully on port 3000")
});
})
.catch((err)=>{
    console.log("Database connection failed",err);
})
