require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/user');
const bookingRoutes = require('./routes/bookings');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({limit:'1mb'}));
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));

app.get('/api/health', (req,res)=>res.json({status:'ok',service:'Gadgets4U API',database:mongoose.connection.readyState===1?'connected':'disconnected'}));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);

app.use(express.static(path.join(__dirname,'..')));
app.get('*',(req,res)=>{
  if(req.path.startsWith('/api/')) return res.status(404).json({message:'API endpoint not found'});
  res.sendFile(path.join(__dirname,'..','index.html'));
});

async function start(){
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
    app.listen(PORT,()=>console.log(`Gadgets4U running at http://localhost:${PORT}`));
  }catch(err){
    console.error('MongoDB connection failed:',err.message);
    process.exit(1);
  }
}
start();
