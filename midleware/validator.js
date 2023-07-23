const { body, validationResult } = require('express-validator');
const fs = require('fs');

module.exports ={
  checkRegister : async(req, res, next) => {
    try {
      await body('username').trim().notEmpty().isLength({min: 5, max: 15}).withMessage('Username must be 5 - 15 characters long').run(req);
      // await body('email').trim().notEmpty().isEmail().matches(/@(gmail|yahoo|rocketmail)\.com$/i).withMessage('Email must be gmail, yahoo and rocketmail').run(req);
      await body('email').trim().notEmpty().isEmail().run(req);
      await body('phone').trim().notEmpty().isLength({max:14, min:12}).withMessage('Minimum phone number 10 - 14 numbers').run(req);
      await body('password').trim().notEmpty().isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers : 1,
        minSymbols : 1
      }).withMessage('Password must be a combination of 1 uppercase, 1 number and 1 symbol').run(req);
      const validation = validationResult(req);
      
      if (validation.isEmpty()) {
        next();
      }else{
          res.status(400).send({
          status : false,
          message : 'Validation Invalid',
          error : validation.array()
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  cCPass: async (req, res, next) => {
    try {
      await body('currentPassword').trim().notEmpty().withMessage('Current password cannot be empty').run(req);
      await body('newPassword').trim().notEmpty().withMessage('New password cannot be empty').run(req);
      await body('newPassword').trim().notEmpty().isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers : 1,
        minSymbols : 1
      }).withMessage('Password must be a combination of 1 uppercase, 1 number and 1 symbol').run(req);
      await body('confirmPassword').trim().notEmpty().equals(req.body.newPassword).withMessage("Password not match").run(req);
      const validation = validationResult(req);
      
      if (validation.isEmpty()) {
        next();
      }else{
          res.status(400).send({
          status : false,
          message : 'Validation Invalid',
          error : validation.array()
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  vUname : async (req, res, next) =>{
    await body('username').trim().notEmpty().isLength({min:4, max:15}).withMessage('Username must be 4 - 15 characters long').run(req);
    await body('newUsername').trim().notEmpty().isLength({min:4, max:15}).withMessage('Username must be 4 - 15 characters long').run(req);
    const validation = validationResult(req);
      
    if (validation.isEmpty()) {
      next();
    }else{
        res.status(400).send({
        status : false,
        message : 'Validation Invalid',
        error : validation.array()
      });
    }
  },
  vPhone : async (req, res, next) =>{
    await body('phone').trim().notEmpty().isNumeric().isLength({min:11, max:14}).run(req);
    await body('newPhone').trim().notEmpty().isLength({min:11, max:14}).withMessage('Nomor Telpon min : 12, max : 14').run(req);
    const validation = validationResult(req);
      
    if (validation.isEmpty()) {
      next();
    }else{
        res.status(400).send({
        status : false,
        message : 'Validation Invalid',
        error : validation.array()
      });
    }
  },
  vEmail: async (req, res, next) =>{
    await body('email').trim().notEmpty().isEmail().withMessage('Format Email Salah').run(req);
    await body('newEmail').trim().notEmpty().isEmail().withMessage('Format Email Salah').run(req);
    const validation = validationResult(req);
      
    if (validation.isEmpty()) {
      next();
    }else{
        res.status(400).send({
        status : false,
        message : 'Validation Invalid',
        error : validation.array()
      });
    }
  },
  vResPass : async (req, res, next) =>{
    await body('newPassword').trim().notEmpty().isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers : 1,
      minSymbols : 1}).withMessage('Password must be a combination of 1 uppercase, 1 number and 1 symbol').run(req);
    await body('confirmPassword').trim().notEmpty().equals(req.body.newPassword).withMessage("password not match").run(req);

    const validation = validationResult(req);
    if (validation.isEmpty()) {
      next();
    }else{
        res.status(400).send({
        status : false,
        message : 'Validation Invalid',
        error : validation.array()
      });
    }
  },
  vCreate : async (req, res, next) =>{
      try {
        if (!req.file) {
          throw ({
            status : 'failed to upload',
            message : 'File tidak boleh kosong'
          });
        }
        await body('title').trim().notEmpty().withMessage('Title Harus diisi').run(req);
        await body('content').trim().notEmpty().isLength({max:500}).withMessage('Maksimal karakter adalah 500 karakter').run(req);
        await body('category').trim().notEmpty().withMessage('Kategori Harus diisi').run(req);
        await body('country').trim().notEmpty().withMessage('Negara Harus diisi').run(req);
        await body('keywords').trim().notEmpty().withMessage('Keyword Harus diisi').run(req);
        const validation = validationResult(req);
        let newError;
        // console.log(validation);
        if (validation.isEmpty()) {
          next();
        }else{
            if (req.file !== undefined) {
              const {filename, destination} = req.file; 
              fs.unlinkSync(`${destination}/${filename}`);
              newError = validation.array();
            }else{
              newError = 'File Tidak Boleh Kosong!!';
            }
  
            res.status(400).send({
              status : false,
              message : 'Validation Invalid',
              error : newError
            });
        }
      } catch (error) {
        console.log(error);
        res.status(400).send(error);
      }
  }
}