import { Router } from 'express'
import authController from '../controllers/auth-controller.js'
import { checkAuth } from '../utils/checkAuth.js'
import { checkValidationErrors } from '../utils/checkValidationErrors.js'
import { registerValidator, loginValidator, updateUserValidator } from '../validations/auth-validator.js'
import multer from 'multer'
import { imageStorageCreator } from '../utils/imageStorageCreator.js';

const router = Router()

const upload = multer(imageStorageCreator(multer)) // multer({ storage })

router.post('/register', upload.single('image'), registerValidator, checkValidationErrors, authController.register)
router.post('/login', loginValidator, checkValidationErrors, authController.login)
router.get('/me', checkAuth, authController.getMe)
router.get('/:id', authController.getUser)

router.put('/update', upload.single('image'), updateUserValidator, checkValidationErrors, checkAuth, authController.updateMe)
router.delete('/delete', checkAuth, authController.deleteMe)

router.post('/follow', checkAuth, authController.follow_unfollow)

export default router