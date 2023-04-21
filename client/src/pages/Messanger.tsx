import { socket } from 'App';
import { ReactComponent as SendMessageSVG } from 'assets/send-message.svg';
import { ChatItem } from 'components/ChatItem/ChatItem';
import { ChatMessage } from 'components/ChatMessage/ChatMessage';
import { Button } from 'components/UI/Button/Button';
import { Input } from 'components/UI/Input/Input';
import { Loader } from 'components/UI/Loader/Loader';
import { TextArea } from 'components/UI/TextArea/TextArea';
import { useEffect, useState, useRef, ChangeEvent, useCallback } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { isAuthSelector } from 'redux/slices/auth';
import {
  accessChat,
  addMessage,
  clearMessangerState,
  deleteChat,
  deleteEmptyChats,
  deleteMessage,
  editMessage,
  getAllChats,
  getAllMessages,
  likeMessage,
  readAllChatsMessages,
  readMessage,
  removeChat,
  removeMessage,
  sendMessage,
  updateLatestMessage,
  updateMessage,
  updateMessageToRead,
  likeSms,
  getChatByUserName,
  addChat,
} from 'redux/slices/messanger';
import { IMessage } from 'types/IMessage';
import { extendTextAreaWhenTyping } from 'utils/extendTextAreaWhenTyping';
import { getUserOnlineStatus } from 'utils/getUserOnlineStatus';
import { scrollToBottom } from 'utils/scrollToBottom';
import { ReactComponent as AttachSVG } from 'assets/attach.svg';
import { ReactComponent as CloseSVG } from 'assets/close.svg';
import { ReactComponent as DeleteSVG } from 'assets/trash_bin.svg';
import { uploadFile } from 'redux/slices/files';
import { IEditMessageReq } from 'types/IEditMessageReq';
import _debounce from 'lodash.debounce';
import { IUser } from 'types/IUser';
import { createTimeSince } from 'utils/createTimeSince';

export const Messanger = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation()

  const {
    chats,
    messages,
    currentUserId,
    getAllChatsStatus,
    getMessagesStatus,
    usersOnline,
  } = useAppSelector(({ messanger, auth }) => ({
    chats: messanger.chats,
    messages: messanger.messages,
    currentUserId: auth.data?._id,
    getAllChatsStatus: messanger.chatStatus,
    getMessagesStatus: messanger.messagesStatus,
    usersOnline: auth.onlineUsers,
  }));

  const [searchChatsVal, setSearchChatsVal] = useState('');
  const [searchedUsers, setSearchedUsers] = useState<IUser[]>([]);
  const [isSearchLoading, setSearchLoading] = useState(false);

  const debounceSearchChats = useCallback(
    _debounce(async (userName) => {
      const users = await dispatch(getChatByUserName(userName)).unwrap();
      setSearchedUsers(users);
      setSearchLoading(false)
    }, 700),
    []
    );
    
    const onSearchChatsHandle = (e: ChangeEvent<HTMLInputElement>) => {
      const userName = e.target.value;
      setSearchChatsVal(userName);
      if (userName.trim()) {
      setSearchLoading(true)
      debounceSearchChats(userName.trim());
    }
  };

  const currentChat = chats?.find((chat) =>
    chat.participants.some((user) => user._id === id)
  );
  const currentChatInterlocutor = currentChat?.participants.find(
    (user) => user._id === id
  );

  const [message, setMessage] = useState({
    text: '',
    imageUrl: '',
    isEditing: false,
    id: '',
  });
  const [typing, setTyping] = useState({ isTyping: false, chatId: '' });
  const [typingTimeoutId, setTypingTimeoutId] = useState<NodeJS.Timeout | null>(
    null
  );

  const lastChatMessageRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const inputFile = useRef<HTMLInputElement>(null);

  // GET ALL CHATS AND MESSAGES
  useEffect(() => {
    (async () => {
      if (id) {
        await dispatch(accessChat(id));
      }
      await dispatch(getAllChats());
      await dispatch(getAllMessages());
    })();

    return () => {
      dispatch(deleteEmptyChats());
      // dispatch(clearMessangerState());
    };
  }, []);

  // LOGIC FOR CREATING A NEW CHAT WHEN USER IS SEARCHING FOR CHATS
  useEffect(() => {
    if (id && searchChatsVal) {
      (async () => {
        const chat = await dispatch(accessChat(id)).unwrap();

        const isChatExists = chats.some(c => c._id === chat._id)
        if (!isChatExists) {
          await dispatch(addChat(chat))
        }
        setSearchChatsVal('')
        setSearchedUsers([])
      })();
    }
  }, [location]);

  // REAL TIME COOPERATION
  useEffect(() => {
    const sendSms = async (newMessage: IMessage) => {
      const isCurrentChat = currentChat?._id === newMessage.chat._id;

      if (isCurrentChat) {
        const messId = await dispatch(
          updateMessageToRead(newMessage._id)
        ).unwrap();
        await dispatch(readMessage(messId));
        scrollToBottom(lastChatMessageRef);
      }
    };

    const onStartTyping = (currentChatId: string) => {
      setTyping({ ...typing, chatId: currentChatId });
      if (currentChatId === currentChat?._id) {
        setTyping({ chatId: currentChatId, isTyping: true });
      }
    };

    const onStopTyping = () => {
      setTyping({ chatId: '', isTyping: false });
    };

    const onDeleteMessage = (messId: string) => {
      dispatch(removeMessage(messId));
    };

    const onEditMessage = (editedMess: IEditMessageReq) => {
      dispatch(updateMessage(editedMess));
    };

    const onDeleteChat = (chatId: string) => {
      dispatch(removeChat(chatId));

      const isCurrentChat = currentChat?._id === chatId;
      if (isCurrentChat) {
        navigate('/messanger');
      }
    };

    const onLikeMessage = (messId: string) => {
      dispatch(likeSms(messId));
    };

    socket.on('receive message', sendSms);
    socket.on('typing', onStartTyping);
    socket.on('stop typing', onStopTyping);
    socket.on('delete message', onDeleteMessage);
    socket.on('edit message', onEditMessage);
    socket.on('delete chat', onDeleteChat);
    socket.on('like message', onLikeMessage);

    return () => {
      socket.off('receive message', sendSms);
      socket.off('typing', onStartTyping);
      socket.off('stop typing', onStopTyping);
      socket.off('delete message', onDeleteMessage);
      socket.off('edit message', onEditMessage);
      socket.off('delete chat', onDeleteChat);
      socket.off('like message', onLikeMessage);
    };
  });

  // Always scroll to the bottom whenever the page refreshes or the chat is switched
  useEffect(() => {
    if (getMessagesStatus === 'success' && currentChat) {
      scrollToBottom(lastChatMessageRef);
      setTyping({ ...typing, isTyping: false });
      if (currentChat.latestMessage?.sender?._id !== currentUserId) {
        dispatch(readAllChatsMessages(currentChat?._id));
      }
    }
  }, [getMessagesStatus, currentChat?._id]);

  const onSendMessage = async () => {
    socket.emit('stop typing', { recipientId: id });
    const mess = {
      chat: currentChat?._id as string,
      text: message.text,
      imageUrl: message.imageUrl,
    };

    if (!message.isEditing) {
      const sms = await dispatch(sendMessage(mess)).unwrap();

      socket.emit('send message', { sms, recipientId: id });
      await dispatch(addMessage(sms));
      scrollToBottom(lastChatMessageRef);
      dispatch(updateLatestMessage(sms));
    } else if (message.isEditing && message.id) {
      await dispatch(editMessage(message)).unwrap();

      dispatch(updateMessage(message));
      socket.emit('edit message', { ...message, recipientId: id });
    }

    setMessage({ id: '', isEditing: false, text: '', imageUrl: '' });
    messageInputRef.current?.focus();

    if (messageInputRef.current) {
      messageInputRef.current.style.height = 'auto';
    }
  };

  const onTypingMessageHandle = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage({ ...message, text: e.target.value });
    extendTextAreaWhenTyping(e);

    if (!typing.isTyping) {
      socket.emit('typing', {
        currentChatId: currentChat?._id,
        recipientId: id,
      });
    }

    if (typingTimeoutId !== null) {
      clearTimeout(typingTimeoutId);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 1500;

    const onTypingHandle = setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength) {
        socket.emit('stop typing', { recipientId: id });
      }
    }, timerLength);

    setTypingTimeoutId(onTypingHandle);
  };

  const onImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const resp = await dispatch(uploadFile(formData)).unwrap();
      if (resp) {
        setMessage({ ...message, imageUrl: resp.url });
      }
    }
  };

  const onDeleteMessage = async (messId: string) => {
    await dispatch(deleteMessage(messId));
    socket.emit('delete message', { messId, recipientId: id });
    dispatch(removeMessage(messId));
  };

  const onEditMessage = (mess: IMessage) => {
    setMessage({
      isEditing: true,
      id: mess._id,
      text: mess.text as string,
      imageUrl: mess.imageUrl as string,
    });
  };

  const onDeleteChat = async () => {
    if (
      window.confirm(
        'Do you really want to delete this chat? Note: all of the chat messages will be permanently deleted!'
      )
    ) {
      await dispatch(deleteChat(currentChat?._id as string));
      dispatch(removeChat(currentChat?._id as string));
      socket.emit('delete chat', { chatId: currentChat?._id, recipientId: id });
      navigate('/messanger/');
    }
  };

  const onLikeMessage = (messId: string) => {
    dispatch(likeMessage(messId));
    dispatch(likeSms(messId));
    socket.emit('like message', { messId, recipientId: id });
  };

  return (
    <div className="messanger">
      {/* CHATS */}
      <div className="chats">
        <div className="chats__search">
          <Input
            type="text"
            placeholder="Search"
            value={searchChatsVal}
            onChange={onSearchChatsHandle}
          />
        </div>

        {/* ALL CHATS */}
        <div className="chats__list">
          {getAllChatsStatus === 'loading' && (
            <div className="loader_center">
              <Loader className="loader_big" />
            </div>
          )}
          {getAllChatsStatus === 'success' &&
          searchChatsVal ? (
            !isSearchLoading ?
            (
           searchedUsers.length  ? (
            searchedUsers.map((user) => {
              const isUserOnline = getUserOnlineStatus(usersOnline, user._id);
 
              return (
                <Link to={`/messanger/${user._id}`} key={user._id}>
                  <ChatItem
                    user={user}
                    isUserOnline={isUserOnline}
                  />
                </Link>
              );
            })
          ) 
           :
            <div className='loader_center'>
              <h2>No users found 😥</h2>
            </div>
           )
            :
            <div className='loader_center'>
              <Loader className='loader_big'/>
            </div>
          )
          : chats?.length ? (
            chats.map((chat) => {
              const isActiveChat = chat.participants.some((p) => p._id === id);
              const selectedInterlocutor = chat.participants.find(
                (p) => p._id !== currentUserId
              );

              const isUserOnline = getUserOnlineStatus(
                usersOnline,
                selectedInterlocutor?._id
              );

              const unreadChatMessagesCount = messages?.filter(
                (mess) =>
                  !mess?.isRead &&
                  mess.chat?._id === chat?._id &&
                  mess.sender?._id !== currentUserId
              )?.length;

              const creationTime = createTimeSince(new Date(chat.createdAt));

              return (
                <Link
                  to={`/messanger/${selectedInterlocutor?._id}`}
                  key={chat._id}
                >
                  <ChatItem
                    chat={chat}
                    isActiveChat={isActiveChat}
                    isUserOnline={isUserOnline}
                    selectedInterlocutor={selectedInterlocutor as IUser}
                    chatUnreadMessagesCount={unreadChatMessagesCount}
                    creationTime={creationTime}
                    typing={typing}
                  />
                </Link>
              );
            })
          ) : (
            <div>NO CHATS</div>
          )}
        </div>
      </div>

      {id ? (
        <div className="currentChat">
          <div className="currentChat__heading">
            <div>
              <span>{currentChatInterlocutor?.fullName}</span>
              {typing.isTyping && (
                <span className="currentChat__heading__typing">
                  is typing...
                </span>
              )}
            </div>
            <span className="currentChat__heading__deleteSvg">
              Delete chat <DeleteSVG onClick={onDeleteChat} />
            </span>
          </div>

          {/* CHAT MESSAGES */}
          <div className="currentChat__messages">
            {getMessagesStatus === 'loading' && (
              <div className="loader_center">
                <Loader className="loader_big" />
              </div>
            )}
            {getMessagesStatus === 'success' &&
              (messages?.length ? (
                messages.map((message, ind) => {
                  const isMyMessage = message.sender._id === currentUserId;

                  const isLastUserMessage =
                    messages[ind + 1]?.sender._id !== message.sender._id ||
                    messages[ind + 1].sender._id === undefined;

                  const isSameUserMessage =
                    ind < messages.length - 1 &&
                    messages[ind + 1].sender._id === message.sender._id;

                  return (
                    message.chat?._id === currentChat?._id && (
                      <ChatMessage
                        key={message._id}
                        message={message}
                        isMyMessage={isMyMessage}
                        isSameUserMessage={isSameUserMessage}
                        isLastUserMessage={isLastUserMessage}
                        messageRef={lastChatMessageRef}
                        deleteMessage={onDeleteMessage}
                        onEditMessage={onEditMessage}
                        onLikeMessage={onLikeMessage}
                      />
                    )
                  );
                })
              ) : (
                <div>NO MESSAGES</div>
              ))}
          </div>

          <div className="currentChat__footer">
            <div className="currentChat__footer__textarea">
              <TextArea
                placeholder="Type your message here"
                value={message.text}
                onChange={onTypingMessageHandle}
                ref={messageInputRef}
              />
              {(message.text || message.imageUrl) && (
                <div>
                  <Button
                    onClick={onSendMessage}
                    className="button button_colored"
                    text=""
                    disabled={!message.text.trim() && !message.imageUrl}
                  >
                    <SendMessageSVG />
                  </Button>
                </div>
              )}
              <span
                className="attachSvg"
                onClick={() => inputFile.current?.click()}
              >
                <AttachSVG />
              </span>
              <input
                key={message.text}
                type="file"
                ref={inputFile}
                onChange={onImageUpload}
                hidden
              />
            </div>
            {message.imageUrl && (
              <div className="currentChat__footer__image">
                <img src={message.imageUrl} alt="" />
                <CloseSVG
                  onClick={() => setMessage({ ...message, imageUrl: '' })}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="chats__emptyBlock">
          <h1>
          ↖️SELECT A CHAT FROM THE EXISTED OR SEARCH FOR PEOPLE TO CHAT WITH
          </h1>
        </div>
      )}
    </div>
  );
};
