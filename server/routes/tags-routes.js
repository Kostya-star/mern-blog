import { Router } from 'express'
import tagsController from '../controllers/tags-controller.js'

const router = Router()

router.get('', tagsController.getLastTags)

export default router