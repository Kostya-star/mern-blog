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
router.get('/me', checkAuth, authController.getUser)

router.put('/update', updateUserValidator, checkValidationErrors, upload.single('image'), checkAuth, authController.updateUser)
router.delete('/delete', checkAuth, authController.deleteUser)


export default router