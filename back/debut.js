
const express=require('express');
const cors= require('cors');
const mysql=require("mysql");
const bcrypt=require('bcryptjs');
const app= express();
const dotenv=require('dotenv');

dotenv.config();

app.use(express.json());
app.use(cors());

const db=mysql.createConnection({
    user:"root",
    password:process.env.PSW,
    host:'localhost',
    database:"res"
})
;
db.connect(err => {
    if (err) {
      console.error('error connecting to db: ' + err.stack);
      return;
    }
    console.log('connected to db  ' );
  });

app.put('/update/:email/:psw', async (req, res) => {
    const email = req.params.email;
    const password = req.params.psw;
    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
    try {
        await db.query('SELECT * FROM personne WHERE email = ?', [email],async(err,result)=>{
            const l=result.length;
            if (l<=0) {
                return (res.json({
                message: "User doesn't exists",
                status: false}));
            }
                const hashedPassword= await bcrypt.hash(password,8);
                const query1 = `update personne set  password=? where email=?;`;
                await db.query(query1, [hashedPassword,email],(err,result)=>{
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