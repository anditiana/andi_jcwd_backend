const express = require('express');
const router = express.Router();
const userController = require('../controller/user');
const { verifyToken } = require('../midleware/auth');
const authlogin = require('../controller/keepLogin');
const { checkRegister, checkLogin, cCPass, vUname, vPhone, vEmail, vResPass, vContent, vCreate} = require('../midleware/validator');
const { multerUpload } = require('../midleware/multer');
const blogController = require('../controller/blog');



router.post('/register',checkRegister,userController.register);
router.patch('/auth/verify', verifyToken , userController.verification);
router.get('/keep', verifyToken ,authlogin.keeplogin);
router.patch('/auth/changePass', verifyToken, cCPass , userController.editPass);
router.patch('/auth/changeUser', verifyToken, vUname, userController.editUsername);
router.patch('/auth/changePhone', verifyToken, vPhone, userController.editPhone);
router.patch('/auth/changeEmail', verifyToken, vEmail,userController.editEmail);
router.put('/forgotPass',userController.forgotPassword);
router.patch('/auth/resetPass', verifyToken, vResPass, userController.resetPassword);
router.post('/auth/chFP', verifyToken, multerUpload('./public/profile', 'profile').single('file') , userController.upProfile);

router.post('/blog/create',verifyToken, multerUpload('./public/imgBlog', 'blog').single('file'),vCreate, blogController.create);
router.get('/blog/find', verifyToken, blogController.getBlog);
router.get('/blog/allCategory', blogController.allCategory);
router.post('/blog/like',verifyToken, blogController.like);
router.get('/blog/findByid',verifyToken,blogController.getBlogById);
router.get('/blog/likedBlog', verifyToken, blogController.likedBlogById);

// router.get('/blog/mostLike',verifyToken,blogController.getLike);
// router.post('/blog/delete',verifyToken, blogController.delete);


router.post('/login', userController.login);


module.exports = router;