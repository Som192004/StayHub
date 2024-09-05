const express = require('express') ;
const cors = require('cors') ;
const mongoose = require('mongoose')
const app = express() ;
const dotenv = require('dotenv') ;
const bcrypt = require('bcryptjs') ;
const User = require('./models/user.model.js')
const Booking = require('./models/booking.model.js')
const jwt = require('jsonwebtoken');
const CookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader') ;
const path = require('path') ;
const multer = require('multer') ;
const fs = require('fs') ;
const place = require('./models/place.model.js');

dotenv.config();
const secret = bcrypt.genSaltSync(10);
const jwtSecret = 'StayHub';
app.use(express.json())
app.use(CookieParser());
app.use('/uploads' , express.static(path.join(__dirname , 'uploads'))) ;
app.use(cors({
    credentials: true ,
    origin : 'http://localhost:5173' ,
})) ;


mongoose.connect(process.env.MONGO_URL) ;
 
const db = mongoose.connection  ; 

db.on('error' , () => {
    console.log('Error while connecting to the mongoDB . . . ') ; 
}) ;

db.once('open' , () => {
    console.log('Connected to the mongoDB . . . ') ; 
}) ;


app.post('/register' , async (req,res) => {
    const {name , email , password} = req.body ;

    try{
    const user = await User.create({
        name , 
        email,
        password: bcrypt.hashSync(password , secret) ,
    })

    res.json(user) ;

    }catch(err){
        res.status(422).json(err);
        
    }
})

app.post('/login' , async (req,res) => {    
    const {email , password} = req.body ;
    

    const user = await User.findOne({email : email}) ;
    if(user){
        const passOk = bcrypt.compareSync(password , user.password) ;
        if(passOk){
            jwt.sign({email : user.email , id : user._id } , 
            jwtSecret , {} , (err , token) => {
                if(err) throw err ;
                res.cookie('token',token).json(user) ;
            });
        }
        else{
            res.status(422).json('pass is not ok') ;
        }
    }else{
        res.status(422).json('not found') ;
    }

})

app.get('/profile' , (req,res) => {
    const {token} = req.cookies ;
    if(token){
        jwt.verify(token , jwtSecret , {}, async (err,user) => {
            if(err) throw err ;
            const {name , email , _id} = await User.findById(user.id);
            res.json({name , email , _id});
        })
    }else{
        res.json({}) ;
    }
    
})

app.post('/logout' , (req,res) => {
    res.cookie('token' , '').json(true) ;
})

app.post('/upload-by-link' , async (req,res) => {
    const {link} = req.body ; 

    const newName = Date.now() + '.jpg'
    try{
        await imageDownloader.image({
            url : link ,
            dest : path.join(__dirname , '/uploads' , newName),
            
        });
    
        res.json(`/uploads/${newName}`) ;
    }catch(err){
        console.error('Error downloading image:', err);
        res.status(500).send('Error downloading image');
    }
    

})

const photosMiddleware = multer({dest : 'uploads/'} ) ;
app.post('/upload' , photosMiddleware.array('files' , 100) ,(req,res) => {
    const uploadedFiles = [] ; 
    for(let i = 0;i<req.files.length ; i++){
        const {path , originalname} = req.files[i] ; 
        const parts = originalname.split('.') ;
        const ext = parts[parts.length-1] ;
        const newPath = path + '.' + ext ; 
        fs.renameSync(path , newPath);
        uploadedFiles.push(newPath.replace('uploads/' , '')) ;
    }
    res.json(uploadedFiles) ;
})

app.post('/place' , (req,res) => {
    const {token} = req.cookies ;
    const {title ,address , addedPhotos , description , perks , extraInfo , checkIn , checkOut , maxGuest , price} = req.body ;

    jwt.verify(token , jwtSecret , {}, async (err,user) => {
        if(err) throw err ;
        console.log('user id in post  : ',user.id);
        const placeDoc = await place.create({
            owner : user.id ,
            title : title , 
            address : address , 
            photos : addedPhotos ,
            description : description ,
            perks : perks ,
            extraInfo : extraInfo ,
            checkIn : Number(checkIn) ,
            checkOut : Number(checkOut) ,
            maxGuests : Number(maxGuest) , 
            price : Number(price) ,
        })

        res.json(placeDoc); 
    })
    
})

app.get('/places' , (req,res) => {
    const {token} = req.cookies ;
    jwt.verify(token , jwtSecret , {} , async(err , user) => {
        const {id} = user ; 
        res.json(await place.find({owner : id})) ;
    })
})

app.get('/places/:id' , async( req,res) => {
    const {id} = req.params ; 
    res.json(await place.findById(id)) ;
})

app.put('/places' , async (req,res) => {
    const {token} = req.cookies ;

    const {title ,address , addedPhotos , description , perks , extraInfo , checkIn , checkOut , maxGuests ,id ,price} = req.body ;
    
    jwt.verify(token , jwtSecret , {} , async(err , user) => {
        if(err) throw err ;
        const placeDoc = await place.findById(id) ;
        
        if(user.id === placeDoc.owner.toString()){
            console.log(typeof price);
            placeDoc.set({title ,address , photos : addedPhotos , description , perks , extraInfo , checkIn , checkOut , maxGuests , price})
            await placeDoc.save() ;
            res.json('ok');
        }
    })

})

app.get('/all-places' , async (ree,res) => {
    res.json(await place.find()) ;
})

app.post('/bookings', async (req, res) => {
    try {
        const {checkIn, checkOut, numberOfGuests, nameOfGuest, phoneNum, place, price} = req.body;
        const {token} = req.cookies;

        jwt.verify(token, jwtSecret, {}, async (err, user) => {
            if (err) return res.status(401).json({error: "Unauthorized"});

            const booking = await Booking.create({
                bookingplace : place, checkIn, checkOut, numberOfGuests, nameOfGuest, phoneNum, price, user: user.id
            });

            res.json(booking);
        });
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});

app.get('/all-bookings', async (req, res) => {
    try {
        const {token} = req.cookies;

        jwt.verify(token, jwtSecret, {}, async (err, user) => {
            if (err) return res.status(401).json({error: "Unauthorized"});

            const bookings = await Booking.find({user: user.id}).populate('bookingplace');
            // console.log(bookings) ;
            res.json(bookings);
            
        });
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});


app.get('/' , (req,res) => {
    res.send('Welcome to the server of the StayHub')
})



app.listen(8080 , () => {
    console.log('Server is running . . .') ;
}) ;
