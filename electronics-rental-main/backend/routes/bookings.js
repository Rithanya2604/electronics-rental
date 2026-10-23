const express = require('express');
const Booking = require('../models/Booking');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const router=express.Router();

function makeRef(){ return 'G4U-' + Date.now().toString().slice(-8) + Math.floor(Math.random()*90+10); }

router.post('/', protect, async (req,res)=>{
  try{
    const {productId,name,email,phone,start,duration,address}=req.body;
    const product=await Product.findById(productId);
    if(!product) return res.status(404).json({message:'Product not found'});
    if(product.stock<1) return res.status(409).json({message:'This product is currently unavailable'});
    const booking=await Booking.create({
      reference:makeRef(), user:req.user._id, product:product._id, productName:product.name,
      name,email:email.toLowerCase(),phone,start,duration,address,
      rentalPrice:product.price,securityDeposit:product.deposit,status:'Confirmed'
    });
    await Product.findByIdAndUpdate(product._id, {$inc:{stock:-1}});
    res.status(201).json(booking);
  }catch(e){res.status(400).json({message:e.message||'Booking failed'});}
});
router.get('/mine', protect, async (req,res)=>{
  const bookings=await Booking.find({user:req.user._id}).populate('product').sort({createdAt:-1});
  res.json(bookings);
});
router.patch('/:id/cancel', protect, async(req,res)=>{
  const b=await Booking.findOne({_id:req.params.id,user:req.user._id});
  if(!b) return res.status(404).json({message:'Booking not found'});
  if(['Completed','Cancelled'].includes(b.status)) return res.status(400).json({message:'Booking cannot be cancelled'});
  b.status='Cancelled'; await b.save(); await Product.findByIdAndUpdate(b.product,{$inc:{stock:1}});
  res.json(b);
});
router.get('/', protect, adminOnly, async(req,res)=>res.json(await Booking.find().populate('user','name email phone').populate('product').sort({createdAt:-1})));
router.patch('/:id/status', protect, adminOnly, async(req,res)=>{
  const b=await Booking.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true});
  if(!b) return res.status(404).json({message:'Booking not found'}); res.json(b);
});
module.exports=router;
