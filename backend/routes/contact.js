const express=require('express');
const Contact=require('../models/Contact');
const {protect,adminOnly}=require('../middleware/auth');
const router=express.Router();
router.post('/',async(req,res)=>{try{const {name,email,subject,message}=req.body;if(!name||!email||!message)return res.status(400).json({message:'Name, email and message are required'});res.status(201).json(await Contact.create({name,email,subject,message}));}catch(e){res.status(400).json({message:'Could not send message'});}});
router.get('/',protect,adminOnly,async(req,res)=>res.json(await Contact.find().sort({createdAt:-1})));
router.patch('/:id/status',protect,adminOnly,async(req,res)=>res.json(await Contact.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true})));
module.exports=router;
