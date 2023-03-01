import { Router } from 'express';
import commentsController from '../controllers/comments-controller.js';
import { checkAuth } from '../utils/checkAuth.js';
// import { checkValidationErrors } from '../utils/checkValidationErrors.js';
// import { postValidator } from './../validations/post-validator.js';

const router = Router()

// router.get('/:id', commentsController.getOneComment)
router.get('', commentsController.getAllComments)
router.post('', checkAuth, commentsController.createComment)
// router.patch('/:id', checkAuth, postsController.updatePost)
// router.delete('/:id', checkAuth, commentsController.deleteComment)


export default router