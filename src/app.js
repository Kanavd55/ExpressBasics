const express = require('express');

const app = express();
const { userAuth } = require('./middlewares/userAuth');
app.get("/test",(req,res)=>{
    res.send("Hello from the server")
})

app.get("/namaste",(req,res)=>{
    res.send("Hello from the namaste")
})

app.post('/user',userAuth,async(req,res)=>{
    //saving data to db
    res.send("User data saved");
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

app.get("/",(req,res)=>{
    res.send("Hello from the root")
})
app.listen(3000,()=>{
    console.log("Server is listening successfully on port 3000")
});