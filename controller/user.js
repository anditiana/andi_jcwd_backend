const db = require('../models');
const user = db.account;
const jwt = require('jsonwebtoken');
const enkrip = require('bcrypt');
const { Op } = require('sequelize');
const  transporter  = require('../midleware/etransporter');
const { response } = require('express');
const fs = require('fs');
const handlebars = require('handlebars');

const userController = {
  register : async (req, res) => {
    try {
      const { username, email, phone,  password } = req.body;
      const checkData = await user.findOne({
        where : {
          [Op.or] : [
            {username},
            {email},
            {phone}
          ]
        }
      });
      if (checkData == null) {
        const salt = await enkrip.genSalt(10);
        const hashPassword = await enkrip.hash(password, salt);
        const result = await user.create({ username, email,phone, password : hashPassword });
        const token = jwt.sign({ username, email, phone, password }, process.env.KEY_TOKEN_CREDENTIAL, {expiresIn :'1h'});
        
        const template = fs.readFileSync('./template/mail.html', 'utf-8');
        const compileData = await handlebars.compile(template);
        const tempResult = compileData({username : username});

        await transporter.sendMail({
          from : process.env.MAIL_TRANSPORT,
          to : email,
          subject : 'Verify Register Account',
          html : tempResult
        })

        res.status(200).send({
          status : true,
          message : 'success',
          data : result,
          token
        });
      }else{
        if (checkData.username == username) {throw({message:`Username must be unique`})}
        if (checkData.email == email) {throw({message:`Email must be unique`})}
        if (checkData.phone == phone) {throw({message:`Phone must be unique`})}
        res.send('failed')
      }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
  },
  verification : async (req, res) => {
    try {
      const {newEmail} = req.user;
      if (newEmail == undefined) {
        const result = await user.update(
          {isVerified : true},
          {where :{
            username : req.user.username
          }});
        
      }else{
        const result = await user.update(
          {isVerified : true,
           email : newEmail 
          },
          {where :{
            username : req.user.username
          }});
      }
      res.status(200).send({
        status : 'Success',
        message : 'Account verified successfully'
      });
    } catch (error) {
        res.status(400).send(error);
    } 
  },
  login : async (req, res)=> {
    try {
      const {username, email, phone, password } = req.body;
      if (!username && !email && !phone) {throw({message:'Username or email or phone cannot be empty'})}
      if (!password)  {throw({message:'Password is required'})}
      const data = await user.findOne({
        where : {
          [Op.or] : [
            {username},
            {email},
            {phone}
          ]
        }
      });
      if (data == null) {throw({message : 'Account not found'})}
      if (!data.isVerified) {throw({message : 'Please verified your account first'})}
      const isValid = await enkrip.compare(password, data.password);
      if (!isValid) {throw({message:"Wrong Password"})}
      const payLoad = {
        id: data.id,
        username:data.username,
        phone:data.phone,
        email:data.email,
        imgURL: data.imgURL
      }
      const token = jwt.sign(payLoad, process.env.KEY_TOKEN_CREDENTIAL);
      res.status(200).send({
        message : 'Login Success',
        data,
        token : token
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  editPass : async (req, res) =>{
    try {
      const {currentPassword, newPassword, confirmPassword} = req.body;
      const getData = await user.findOne({where : {id : req.user.id}})
      const checkPass = await enkrip.compare(currentPassword ,getData.password);
      if (checkPass == false) {
        throw({message : "Wrong Current Password"})
      }
      if (newPassword !== confirmPassword) {
        throw({message : "Password doesnt match!!"})
      }
      const salt = await enkrip.genSalt(10);
      const hashPassword = await enkrip.hash(newPassword, salt);
      const setData = await user.update(
        {password : hashPassword},
        {where :{
          id : req.user.id
        }});
      res.status(200).send({
        message : 'Password has been changed successfully, please login again'
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  editUsername : async (req, res)=>{
    try {
      const {username, newUsername} = req.body;
      if (username !== req.user.username) {
        {throw({message:`Wrong Username`})}
      }
      const isUserExist = await user.findOne({
        where : {
          id : req.user.id
        }
      });
      console.log(isUserExist.email);

      const statusMain = await transporter.sendMail({
        from : process.env.MAIL_TRANSPORT,
        to : isUserExist.email,
        subject : 'Change Username',
        html :`<h1> Success {${isUserExist.email}} </h1>`
      });

      const updt = await user.update(
        {username : newUsername},
        {where : {id : req.user.id}}
        );
      res.status(200).send({
        message : 'Username successfully changed, please login again'
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  editPhone : async (req, res)=>{
    try {
      const {phone, newPhone} = req.body;
      if (phone !== req.user.phone) {
        {throw({message:`Wrong Phone Number`})}
      }
      const isUserExist = await user.findOne({
        where : {
          id : req.user.id
        }
      });
      const updt = await user.update(
        {phone : newPhone},
        {where : {id : req.user.id}}
        );

      const statusMain = await transporter.sendMail({
        from : process.env.MAIL_TRANSPORT,
        to : isUserExist.email,
        subject : 'Change Username',
        html :`<h1> Success ${isUserExist.email} </h1>`
      });

      res.status(200).send({
        message : 'Phone successfully changed, please login again'
      });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
  },
  editEmail : async (req, res)=>{
    try {
      const {email, newEmail} = req.body;
      console.log(req.body, req.user.email);
      if (email!== req.user.email) {
        {throw({message:`Wrong Email`})}
      }
      const isEmailExist = await user.findOne({
        where : {
          email : newEmail
        }
      });
      const {username, phone} = req.user;
      if (isEmailExist == null) {

        const result = await user.update(
          {isVerified : false},
          {where : {id : req.user.id}}
          );

        const token = jwt.sign({username, email, newEmail, phone }, process.env.KEY_TOKEN_CREDENTIAL, {expiresIn :'1h'});
        await transporter.sendMail({
          from : process.env.MAIL_TRANSPORT,
          to : email,
          subject : 'Change Email',
          html :'<h1> Success </h1>'
        })

        res.status(200).send({
          message : 'Please check your old email to re-verification',
          token
        });
      }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
  },
  forgotPassword : async (req,res)=>{
    try {
      const {email} = req.body;
      const isEmailExist = await user.findOne({
        where : {
          email : email
        }
      });
      if (isEmailExist !== null) {
        const {id, username, email} = isEmailExist;
        const token = jwt.sign({id, username, email}, process.env.KEY_TOKEN_CREDENTIAL);
        await transporter.sendMail({
          from : process.env.MAIL_TRANSPORT,
          to : email,
          subject : 'Forgot Password',
          html :'<h1> Forgot Password </h1>'
        })
        res.status(200).send({
          message : 'Please check your email to reset the password',
          token
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  resetPassword : async(req, res) =>{
    try {
      const salt = await enkrip.genSalt(10);
      const hashPassword = await enkrip.hash(req.body.newPassword, salt);
      const setData = await user.update(
        {password : hashPassword},
        {where :{
          id : req.user.id
        }});
      res.status(200).send({
        message : 'Password successfully changed, please login again'
      });
    } catch (error) {
      console.log(error);
      res.status(200).send(error);
    }
  },
  upProfile : async (req, res)=>{
    try {
      if (req.file == undefined) {
        throw({message : 'Photo Cannot be empty'});
      }
      const {destination, filename} = req.file;
      const isExist = await user.findOne({
        where : {id : req.user.id}
      });
      if (isExist.imgURL !== null) {
        fs.unlinkSync(`${destination}/${isExist.imgURL}`);
      }
      const setData = await user.update(
        {imgURL : filename},
        {where :{
          id : req.user.id
      }});
      res.status(200).send({
        message : 'Photo Upload Successfully'
      });
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

module.exports = userController;