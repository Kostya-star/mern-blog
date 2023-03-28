import { Router } from 'express';
import commentsController from '../controllers/comments-controller.js';
import { checkAuth } from '../utils/checkAuth.js';

const router = Router()

// router.get('/:id', commentsController.getOneComment)
router.get('', commentsController.getComments)
router.get('/:postId', commentsController.getCommentsByPostId)
router.post('', checkAuth, commentsController.createComment)
router.patch('/:id', checkAuth, commentsController.updateComment)
router.delete('/:id', checkAuth, commentsController.deleteComment)

router.post('/like', checkAuth, commentsController.likeComment)


export default router