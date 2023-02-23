import { Router } from 'express'
import controller from '../controllers/auth-controller.js'
import { checkAuth } from '../utils/checkAuth.js'
import { registerValidator } from '../validations/auth-validator.js'

const router = Router()

router.post('/register', registerValidator, controller.register)
router.post('/login', controller.login)
router.get('/me', checkAuth, controller.getUser)

export default router