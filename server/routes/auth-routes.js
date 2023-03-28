import { Router } from 'express'
import authController from '../controllers/auth-controller.js'
import { checkAuth } from '../utils/checkAuth.js'
import { checkValidationErrors } from '../utils/checkValidationErrors.js'
import { registerValidator, loginValidator, updateUserValidator } from '../validations/auth-validator.js'

const router = Router()


router.post('/register', registerValidator, checkValidationErrors, authController.register)
router.post('/login', loginValidator, checkValidationErrors, authController.login)
router.get('/me', checkAuth, authController.getMe)

router.put('/update', updateUserValidator, checkValidationErrors, checkAuth, authController.updateMe)
router.delete('/delete', checkAuth, authController.deleteMe)

export default router