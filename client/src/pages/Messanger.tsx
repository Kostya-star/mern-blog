import { baseUrl } from 'API/baseUrl';
import { socket } from 'App';
import { ReactComponent as SendMessageSVG } from 'assets/send-message.svg';
import { ChatItem } from 'components/ChatItem/ChatItem';
import { ChatMessage } from 'components/ChatMessage/ChatMessage';
import { Button } from 'components/UI/Button/Button';
import { Input } from 'components/UI/Input/Input';
import { Loader } from 'components/UI/Loader/Loader';
import { TextArea } from 'components/UI/TextArea/TextArea';
import { useEffect, useState, useRef, ChangeEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { isAuthSelector } from 'redux/slices/auth';
import {
  accessChat,
  addMessage,
  clearMessangerState,
  deleteEmptyChats,
  getAllChats,
  getAllMessages,
  sendMessage,
  updateLatestMessage,
  updateMessageToRead,
} from 'redux/slices/messanger';
import { IMessage } from 'types/IMessage';
import { extendTextAreaWhenTyping } from 'utils/extendTextAreaWhenTyping';
import { getUserOnlineStatus } from 'utils/getUserOnlineStatus';
import { scrollToBottom } from 'utils/scrollToBottom';

export const Messanger = () => {
  // const [searchChatsVal, setSearchChatsVal] = useState('');

  // const debounceSearchChats = useCallback(
  //   _debounce((userName) => getChatsByUserName(userName), 700),
  //   [],
  // );

  // const getChatsByUserName = async (userName: string) => {
  //   const resp = await instance.get(`chats/${userName}`)

  //   console.log(resp);
  // }

  // const onSearchChatsHandle = (e: ChangeEvent<HTMLInputElement>) => {
  //   setSearchChatsVal(e.target.value);
  //   debounceSearchChats(e.target.value);
  // };

  const dispatch = useAppDispatch();
  const { id } = useParams();

  const {
    chats,
    chatMessages,
    currentUserId,
    getAllChatsStatus,
    getMessagesStatus,
    usersOnline,
  } = useAppSelector(({ messanger, auth }) => ({
    chats: messanger.chats,
    chatMessages: messanger.messages,
    currentUserId: auth.data?._id,
    getAllChatsStatus: messanger.chatStatus,
    getMessagesStatus: messanger.messagesStatus,
    usersOnline: auth.onlineUsers,
  }));

  const isAuth = useAppSelector(isAuthSelector)

  const currentChat = chats?.find((chat) =>
    chat.participants.some((user) => user._id === id),
  );
  const currentChatInterlocutor = currentChat?.participants.find(
    (user) => user._id === id,
  );

  const [newMessage, setNewMessage] = useState('');

  const lastChatMessageRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);


  useEffect(() => {
    socket.on('receive message', async (newMessage: IMessage) => {
      dispatch(updateLatestMessage(newMessage));
      const isCurrentChat = currentChat?._id === newMessage.chat._id;
      if (isCurrentChat) {
        await dispatch(updateMessageToRead(newMessage._id))
        await dispatch(addMessage(newMessage));
        scrollToBottom(lastChatMessageRef);
      }
    });

    return () => {
      socket.off('receive message');
    };
  }, [socket, currentChat]);

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
      dispatch(clearMessangerState());
    };
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     if (currentChat) {
  //       // await dispatch(getChatMessages(currentChat._id));
  //       scrollToBottom(lastChatMessageRef);
  //     }
  //   })();
  // }, [currentChat?._id]);

  const onSendMessage = async () => {
    const message = {
      chat: currentChat?._id as string,
      text: newMessage,
      imageUrl: '',
    };
    setNewMessage('');
    const createdMessage = await dispatch(sendMessage(message)).unwrap();
    socket.emit('send message', { createdMessage, recipientId: id});
    await dispatch(addMessage(createdMessage));
    scrollToBottom(lastChatMessageRef);
    dispatch(updateLatestMessage(createdMessage));
    // const isRecipientOnline = usersOnline.some(user => user?.userId === id)
    // const isCurrentChat = createdMessage.chat._id === currentChat?._id
    // console.log(isCurrentChat);
    
    // if(!isRecipientOnline) {
    //   await dispatch(updateMessageToUnread(newMessage._id))
    // }

    messageInputRef.current?.focus();

    if (messageInputRef.current) {
      messageInputRef.current.style.height = 'auto';
    }
  };

  const onTypingMessageHandle = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    extendTextAreaWhenTyping(e);

    // user is typing message real time indicator
  };


  return (
    <div className="messanger">
      {/* CHATS */}
      <div className="chats">
        <div className="chats__search">
          <Input
            type="text"
            placeholder="Search"
            // value={searchChatsVal}
            // onChange={onSearchChatsHandle}
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
            (chats?.length ? (
              chats.map((chat) => {
                const isActiveChat = chat.participants.some(
                  (p) => p._id === id,
                );
                const selectedInterlocutorId = chat.participants.find(
                  (p) => p._id !== currentUserId,
                )?._id;

                const isUserOnline = getUserOnlineStatus(
                  usersOnline,
                  selectedInterlocutorId,
                );

                const unreadChatMessagesCount = chatMessages?.filter(
                  (mess) =>
                    !mess?.isRead &&
                    mess.chat._id === chat._id &&
                    mess.sender._id !== currentUserId,
                )?.length;

                return (
                  <Link
                    to={`/messanger/${selectedInterlocutorId}`}
                    key={chat._id}
                  >
                    <ChatItem
                      chat={chat}
                      isActiveChat={isActiveChat}
                      currentUserId={currentUserId as string}
                      isUserOnline={isUserOnline}
                      chatUnreadMessagesCount={unreadChatMessagesCount}
                    />
                  </Link>
                );
              })
            ) : (
              <div>NO CHATS</div>
            ))}
        </div>
      </div>

      {id ? (
        <div className="currentChat">
          <div className="currentChat__heading">
            <span>{currentChatInterlocutor?.fullName}</span>
            <span>Delete svg</span>
          </div>

          {/* CHAT MESSAGES */}
          <div className="currentChat__messages">
            {getMessagesStatus === 'loading' && (
              <div className="loader_center">
                <Loader className="loader_big" />
              </div>
            )}
            {getMessagesStatus === 'success' &&
              (chatMessages?.length ? (
                chatMessages.map((message, ind) => {
                  const isMyMessage = message.sender._id === currentUserId;

                  const isLastUserMessage =
                    chatMessages[ind + 1]?.sender._id !== message.sender._id ||
                    chatMessages[ind + 1].sender._id === undefined;

                  const isSameUserMessage =
                    ind < chatMessages.length - 1 &&
                    chatMessages[ind + 1].sender._id === message.sender._id;

                  return (
                    <ChatMessage
                      key={message._id}
                      message={message}
                      isMyMessage={isMyMessage}
                      isSameUserMessage={isSameUserMessage}
                      isLastUserMessage={isLastUserMessage}
                      messageRef={lastChatMessageRef}
                    />
                  );
                })
              ) : (
                <div>NO MESSAGES</div>
              ))}
          </div>

          <div className="currentChat__footer">
            <TextArea
              placeholder="Type your message here"
              value={newMessage}
              onChange={onTypingMessageHandle}
              ref={messageInputRef}
            />
            {newMessage && (
              <Button
                onClick={onSendMessage}
                className="button button_colored"
                text=""
                disabled={!newMessage.trim()}
              >
                <SendMessageSVG />
              </Button>
            )}
            {/* <span>Attach svg</span> */}
          </div>
        </div>
      ) : (
        <div className="chats__emptyBlock">
          <h1>
            SELECT A CHAT FROM THE EXISTED OR CREATE A NEW CHAT(button for
            creating a new chat)
          </h1>
        </div>
      )}
    </div>
  );
};
