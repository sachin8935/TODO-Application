const express=require('express');
const router= express.Router();
const userEmailCheck= require('../middleware/signupHandler');
const userSignUp= require('../controller/signup');
router.post('/signup',userEmailCheck,userSignUp);
router.post('/login',)
module.exports=router;