import { ReactComponent as SendMessageSVG } from 'assets/send-message.svg';
import { ChatItem } from 'components/ChatItem/ChatItem';
import { ChatMessage } from 'components/ChatMessage/ChatMessage';
import { Input } from 'components/UI/Input/Input';
import { Loader } from 'components/UI/Loader/Loader';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import {
  accessChat,
  getAllChats,
  getChatMessages,
  sendMessage,
} from 'redux/slices/messanger';

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
  } = useAppSelector(({ messanger, auth }) => ({
    chats: messanger.chats,
    chatMessages: messanger.messages,
    currentUserId: auth.data?._id,
    getAllChatsStatus: messanger.chatStatus,
    getMessagesStatus: messanger.messagesStatus,
  }));

  const currentChat = chats?.find((chat) =>
    chat.participants.some((user) => user._id === id),
  );
  const currentChatInterlocutor = currentChat?.participants.find(
    (user) => user._id === id,
  );

  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (id) {
      (async () => {
        await dispatch(accessChat(id));
        await dispatch(getAllChats());
      })();
    }
  }, []);

  useEffect(() => {
    if (currentChat) {
      dispatch(getChatMessages(currentChat._id));
    }
  }, [currentChat]);

  const onSendMessage = () => {
    const message = {
      chat: currentChat?._id as string,
      text: newMessage,
      imageUrl: '',
    };
    dispatch(sendMessage(message));
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

                return (
                  <Link
                    to={`/messanger/${selectedInterlocutorId}`}
                    key={chat._id}
                  >
                    <ChatItem
                      chat={chat}
                      isActiveChat={isActiveChat}
                      currentUserId={currentUserId as string}
                    />
                  </Link>
                );
              })
            ) : (
              <div>NO CHATS</div>
            ))}
        </div>
      </div>

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
                const isMyMessage = message.sender._id === currentUserId
                // const isFirstUserMessage = message.sender._id !== chatMessages[ind - 1]?.sender._id
                // const isSameUserMessage = message.sender._id === chatMessages[ind - 1]?.sender._id

                const isSameSender = ind < chatMessages.length - 1 &&
                (chatMessages[ind + 1].sender._id !== message.sender._id ||
                  chatMessages[ind + 1].sender._id === undefined) &&
                  chatMessages[ind].sender._id !== currentUserId

                  const isLastMessage = ind === chatMessages.length - 1 &&
                  chatMessages[chatMessages.length - 1].sender._id !== currentUserId &&
                  Boolean(chatMessages[chatMessages.length - 1].sender._id)

                return (
                  <ChatMessage
                    key={message._id}
                    message={message}
                    isMyMessage={isMyMessage}
                    // isFirstUserMessage={isFirstUserMessage}
                    // isSameUserMessage={isSameUserMessage}
                    isSameSender={isSameSender}
                    isLastMessage={isLastMessage}
                  />
                );
              })
            ) : (
              <div>NO MESSAGES</div>
            ))}
        </div>

        <div className="currentChat__footer">
          <Input
            type="text"
            placeholder="type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <SendMessageSVG onClick={onSendMessage} />
          <span>Attach svg</span>
        </div>
      </div>
    </div>
  );
};
