const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/profile', protect, async (req,res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json({user:{id:user._id,name:user.name,email:user.email,phone:user.phone,role:user.role}});
});

router.get('/cart', protect, async (req,res) => {
  const user = await User.findById(req.user._id).populate('cart.productId');
  const cart = user.cart.filter(i=>i.productId).map(i=>({ ...i.productId.toObject(), qty:i.quantity }));
  res.json(cart);
});
router.post('/cart', protect, async (req,res) => {
  const { productId, quantity=1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({message:'Product not found'});
  const user = await User.findById(req.user._id);
  const item = user.cart.find(i=>String(i.productId)===String(productId));
  if (item) item.quantity += Number(quantity);
  else user.cart.push({productId, quantity:Number(quantity)});
  await user.save();
  res.json({message:'Cart updated'});
});
router.put('/cart/:productId', protect, async (req,res) => {
  const qty=Number(req.body.quantity);
  const user=await User.findById(req.user._id);
  const item=user.cart.find(i=>String(i.productId)===req.params.productId);
  if(!item) return res.status(404).json({message:'Cart item not found'});
  if(qty<=0) user.cart=user.cart.filter(i=>String(i.productId)!==req.params.productId); else item.quantity=qty;
  await user.save(); res.json({message:'Cart updated'});
});
router.delete('/cart/:productId', protect, async (req,res) => {
  await User.findByIdAndUpdate(req.user._id, {$pull:{cart:{productId:req.params.productId}}});
  res.json({message:'Item removed'});
});

router.get('/wishlist', protect, async (req,res) => {
  const user=await User.findById(req.user._id).populate('wishlist');
  res.json(user.wishlist.filter(Boolean));
});
router.post('/wishlist/:productId', protect, async (req,res) => {
  const user=await User.findById(req.user._id);
  const exists=user.wishlist.some(id=>String(id)===req.params.productId);
  if(exists) user.wishlist.pull(req.params.productId); else user.wishlist.push(req.params.productId);
  await user.save(); res.json({added:!exists});
});
router.delete('/wishlist/:productId', protect, async (req,res) => {
  await User.findByIdAndUpdate(req.user._id, {$pull:{wishlist:req.params.productId}});
  res.json({message:'Removed from wishlist'});
});
module.exports=router;
