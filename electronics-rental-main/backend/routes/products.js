const express = require('express');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req,res) => {
  try {
    const q = {};
    if (req.query.category && req.query.category !== 'All') q.category = req.query.category;
    if (req.query.search) q.$or = [
      {name:{$regex:req.query.search,$options:'i'}},
      {desc:{$regex:req.query.search,$options:'i'}},
      {category:{$regex:req.query.search,$options:'i'}}
    ];
    const products = await Product.find({...q, active:true}).sort({legacyId:1});
    res.json(products);
  } catch { res.status(500).json({message:'Could not load products'}); }
});
router.get('/:id', async (req,res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({message:'Product not found'});
    res.json(product);
  } catch { res.status(400).json({message:'Invalid product id'}); }
});
router.post('/', protect, adminOnly, async (req,res) => {
  try { res.status(201).json(await Product.create(req.body)); } catch(e){res.status(400).json({message:e.message});}
});
router.put('/:id', protect, adminOnly, async (req,res) => {
  try { res.json(await Product.findByIdAndUpdate(req.params.id, req.body, {new:true,runValidators:true})); } catch(e){res.status(400).json({message:e.message});}
});
router.delete('/:id', protect, adminOnly, async (req,res) => {
  try { res.json(await Product.findByIdAndUpdate(req.params.id,{active:false},{new:true})); } catch(e){res.status(400).json({message:e.message});}
});
module.exports = router;
