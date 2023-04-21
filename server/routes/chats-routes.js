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
router.delete('/:chatId', checkAuth, chatsController.deleteChat)
router.patch('/message/:messageId/read', checkAuth, chatsController.updateMessageToRead)
router.delete('/message/:messageId', checkAuth, chatsController.deleteMessage)
router.get('/message/like/:messageId', checkAuth, chatsController.likeMessage)
router.patch('/message', checkAuth, chatsController.editMessage)
router.get('/search/:userName', checkAuth, chatsController.getChatByUserName)

export default router