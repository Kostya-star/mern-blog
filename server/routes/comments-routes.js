import { Router } from 'express';
import commentsController from '../controllers/comments-controller.js';
import { checkAuth } from '../utils/checkAuth.js';
// import { checkValidationErrors } from '../utils/checkValidationErrors.js';
// import { postValidator } from './../validations/post-validator.js';

const router = Router()

// router.get('/:id', commentsController.getOneComment)
router.get('', commentsController.getComments)
router.get('/:postId', commentsController.getCommentsByPostId)
router.post('', checkAuth, commentsController.createComment)
router.patch('/:id', checkAuth, commentsController.updateComment)
router.delete('/:id', checkAuth, commentsController.deleteComment)


export default router