import { Router } from 'express'
import imageController from '../controllers/image-controller.js'
import { checkAuth } from '../utils/checkAuth.js'

const router = Router()

router.post('/file', checkAuth, imageController.uploadFile)

export default router