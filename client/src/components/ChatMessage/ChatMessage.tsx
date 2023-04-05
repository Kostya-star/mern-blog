import { Avatar } from 'components/Avatar/Avatar';
import { FC } from 'react';
import { IMessage } from 'types/IMessage';
import { createTimeSince } from 'utils/createTimeSince';
import s from './ChatMessage.module.scss';

interface IChatMessageProps {
  message: IMessage;
  isMyMessage: boolean;
  // isFirstUserMessage: boolean
  // isSameUserMessage: boolean
  isSameSender: boolean
  isLastMessage: boolean
}

export const ChatMessage: FC<IChatMessageProps> = ({
  message,
  isMyMessage,
  // isFirstUserMessage,
  // isSameUserMessage
  isSameSender, 
  isLastMessage
}) => {
  const creationTime = createTimeSince(new Date(message.createdAt));

  // let isLastMessage; // if message.sender.id !== message.chat.latestMessage.sender.id
  // let isSameMessage; // if message.sender.id === message.chat.latestMessage.sender.id

  // const isFirstUserMessage = message.sender._id !== message.chat.latestMessage?.sender._id
  // const isSameUserMessage = message.sender._id === message.chat.latestMessage?.sender._id
  // console.log('isLastMessage', isFirstUserMessage);
  // console.log('isSameMessage', isSameUserMessage);
  

  return (
    <div className={`${s.message} ${isMyMessage && s.message_myMessage}`}>
      {/* if its the last message or it is the message of the same user then show the avatar */}
      <div className={`${s.message__img} ${!isSameSender && !isLastMessage && !isMyMessage && s.message__img_paddingLeft}`} >
      {!isMyMessage && (isSameSender || isLastMessage) && (
          <Avatar avatar={message.sender.avatarUrl as string} />
          )}
          </div>

      <div className={s.message__body}>
        <p className={`${!isMyMessage ? s.bubble_left : s.bubble_right}`}>{message.text}</p>
        <span>{creationTime}</span>
      </div>
    </div>
  );
};
