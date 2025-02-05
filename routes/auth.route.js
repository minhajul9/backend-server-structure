import express from 'express'
import { adminLogin, changePassword, changeProfilePhoto, deletePhoto, forgetPassword, getUser, login, resetPassword, signup, updateUser, verifyEmail } from '../controllers/auth.controller.js';
import { verifyJWT } from '../jwt/protectRoute.js';
import { upload } from '../multer/uploadImage.js';

const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.post('/adminLogin', adminLogin);
router.put('/setting/:id', verifyJWT, updateUser);
router.get('/user', verifyJWT, getUser)
router.put('/changePassword/:id', verifyJWT, changePassword)
router.put('/resetPassword/:id', verifyJWT, resetPassword);
router.put('/user/:folder/:id', verifyJWT, upload.single('image'), changeProfilePhoto);
router.patch('/forgetPassword', forgetPassword);
router.get('/verify/:uuid', verifyEmail);
router.delete('/image/:id', verifyJWT, deletePhoto);


export default router