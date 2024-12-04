
const express=require('express');
const cors= require('cors');
const mysql=require("mysql2");
const bcrypt=require('bcryptjs');
const app= express();
const dotenv=require('dotenv');

dotenv.config();

app.use(express.json());
app.use(cors());

const db=mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port:process.env.DB_PORT,
    connectionLimit: 10,
})
;
db.getConnection(err => {
    if (err) {
      console.error('error connecting to db: ' + err.stack);
      return;
    }
    console.log('connected to db  ' );
  });

app.put('/update/:email/:psw',  (req, res) => {
    const email = req.params.email;
    const password = req.params.psw;
    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
    try {
         db.query('SELECT * FROM personne WHERE email = ?', [email],(err,result)=>{
            const l=result.length;
            if (l<=0) {
                return (res.json({
                message: "User doesn't exists",
                status: false}));
            }
                const hashedPassword=  bcrypt.hash(password,8);
                const query1 = `update personne set  password=? where email=?;`;
                db.query(query1, [hashedPassword,email],(err,result)=>{
                if(err){
                    console.log(err);
                    return (res.status(500).json({ message: "Error while querying the database", status: false }));
                }
                return (res.json({
                    message: "changed successfully",
                    status: true}));
            });
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
            status: false
        });
    }
});



app.listen(process.env.PORT,()=>{
    console.log('work on port '+process.env.PORT)
})
