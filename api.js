const express = require('express')
const bookingmodel = require('./booking')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const adminmodel = require('./aRegister')
const baddmodel = require('./bikeAdd')
// const bcrypt = require('bcrypt')


const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("attach"));


mongoose.connect("mongodb://127.0.0.1:27017/BikeServ")
.then((res)=>{
    console.log(res,"DB Connected")
}).catch(err=>{console.log(err)});


app.post("/ClintBooking",async(req,res)=>{
    const{cname,cemail,service,mobile,detail} = req.body;

    let send = await bookingmodel.create({
        cname:cname,
        cemail:cemail,
        service:service,
        mobile:mobile,
        detail:detail
    })


    if(send)
    {
        res.status(200).json({"msg":"Data Inserted"})
    }
    else{
        res.status(400).json({"error":"Inavalid argu"})
    }
})

//Admin Registration
app.post("/adminRegister",async(req,res)=>{
    const{id,yname,mobile,password} = req.body;

    // const pid = await adminmodel.findOne({mobile:mobile});
    // const secPass=await bcrypt.hash(password,10);

    // if(!pid){
        let send = await adminmodel.create({
            id:id,
            yname:yname,
            mobile:mobile,
            password:password
        })

        if(send){
            res.status(200).json({'msg':'data inserted'})
        }
    //     else{
    //         res.status(400).json({'error':'Invalid Argu'})
    //     }
    // }
    else{
        res.status(400).json({"error":"This Phone number is already registerd"})
    }
    })

    //Admin Login
app.post("/adminLogin",async(req,res)=>{
    const{yname,password}=req.body;
 
    let login = await adminmodel.findOne({password:password})

    if(login){
        res.send(login);
}
    else{
        res.status(400).json({"error":"Wrong User"})
    }
})


//fetch Service detail
app.get("/fetchDetail",async(req,res)=>{

    let data = await bookingmodel.find();
    
res.send(data);
})

//multer npm
var multer = require('multer');
const bikeAdd = require('./bikeAdd')
// const dRegister = require('./dRegister')

let storage= multer.diskStorage({
    destination:function(req,file,cb){
    cb(null,'attach')
    },

    filename:function(req,file,cb){
        cb(null,file.fieldname+ '-'+Date.now()+'.'+file.originalname.split('.')
		[file.originalname.split('.').length-1])
       }


});
let upload = multer({storage:storage}).single('attachment');

//Add your bike
app.post('/adding',async(req,res)=>{

    upload(req,res,async(err)=>{

        if(err){
            res.status(400).json({"error":"Error in Image Uploading"})
        }
        else{
            const{bname,mileage,description,price}=req.body;

            let send = baddmodel.create({
                "bname":bname,
                "mileage":mileage,
                "description":description,
                "price":price,
                "attachment":req.file.filename
            })
            if(send){
                res.status(200).json({"Success":"Your bike is Added"})
                }
                else{
                res.status(400).json({"error":"Bike is not added"})
                }
        }
})
})

//Fetching bike detail
app.get("/fetchBikedetail",async(req,res)=>{

    let data = await baddmodel.find();
    res.send(data);
})

app.listen(1234);