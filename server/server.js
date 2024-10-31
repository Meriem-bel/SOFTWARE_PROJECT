import express from 'express';
import mysql from 'mysql' 
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser';

const salt = 10;


const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser())


const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:'signup'
})

app.post('/register',(req,res) =>{
    const sql = "INSERT INTO LOGIN ('name','email','password') VALUES(?)";
    bcrypt.hash(req.body.password.toString(),salt,(err,hash) =>{
        if (err) return res.json({Error:"Error for hashing psssword"});
        const values =[
            req.body.name,
            req.body.email,
            hash
        ]
        db.query(sql,[values],(err,result) =>{
            if(err) return res.json({Error: "Inserting data error in server"});
            return res.json({Status: "Success"});
        })
    })
    

})


app.listen(8081,() =>{
    console.log("Running. ..");
})