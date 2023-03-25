import { Router } from 'express';
import commentsController from '../controllers/comments-controller.js';
import { checkAuth } from '../utils/checkAuth.js';
import multer from 'multer'
import { imageStorageCreator } from '../utils/imageStorageCreator.js';
// import { checkValidationErrors } from '../utils/checkValidationErrors.js';
// import { postValidator } from './../validations/post-validator.js';

const router = Router()

const upload = multer(imageStorageCreator(multer)) // multer({ storage })

// router.get('/:id', commentsController.getOneComment)
router.get('', commentsController.getComments)
router.get('/:postId', commentsController.getCommentsByPostId)
router.post('', upload.single('image'), checkAuth, commentsController.createComment)
router.patch('/:id', upload.single('image'), checkAuth, commentsController.updateComment)
router.delete('/:id', checkAuth, commentsController.deleteComment)

router.post('/like', checkAuth, commentsController.likeComment)


export default router