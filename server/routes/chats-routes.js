import { Router } from 'express';
import chatsController from '../controllers/chats-controller.js';
import { checkAuth } from '../utils/checkAuth.js';

const router = Router()

router.get('', checkAuth, chatsController.getAllChats)

// router.get('/:chatId/messages', checkAuth, chatsController.getChatMessages)
router.get('/messages', checkAuth, chatsController.getAllMessages)
router.patch('/:chatId/messages/readAll', checkAuth, chatsController.readAllChatMessages)
router.get('/:interlocutorId', checkAuth, chatsController.accessChat) // if there is the chat then it is returned, otherwise the chat is created and returned(but not saved in the DB)
router.post('/message', checkAuth, chatsController.sendMessage)
router.delete('/empty', checkAuth, chatsController.deleteEmptyChats)
router.patch('/message/:messageId/read', chatsController.updateMessageToRead)
router.delete('/message/:messageId', chatsController.deleteMessage)
router.patch('/message', chatsController.editMessage)
// router.delete('/chatId', checkAuth, chatsController.deleteUnusedChats)
// router.post('', checkAuth, postsController.createPost)
// router.patch('/:postId', checkAuth, postsController.updatePost)
// router.delete('/:id', checkAuth, postsController.deletePost)

// router.post('/like', checkAuth, postsController.likePost)
// router.get('/user/:id', postsController.getPostsByUserId)


export default router