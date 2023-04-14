import { Avatar } from 'components/Avatar/Avatar';
import { FC, LegacyRef } from 'react';
import { IMessage } from 'types/IMessage';
import { createTimeSince } from 'utils/createTimeSince';
import s from './ChatMessage.module.scss';

interface IChatMessageProps {
  message: IMessage;
  isMyMessage: boolean;
  isSameUserMessage: boolean;
  isLastUserMessage: boolean;
  messageRef: LegacyRef<HTMLDivElement>
}

export const ChatMessage: FC<IChatMessageProps> = ({
  message,
  isMyMessage,
  isSameUserMessage,
  isLastUserMessage,
  messageRef
}) => {
  const creationTime = createTimeSince(new Date(message.createdAt));
  

  return (
    <div className={`${s.message} ${isMyMessage && s.message_myMessage}`} ref={messageRef}>
      <div
        className={`${s.message__img} ${
          isSameUserMessage &&
          !isLastUserMessage &&
          !isMyMessage &&
          s.message__img_paddingLeft
        }`}
      >
        {!isMyMessage && (!isSameUserMessage || isLastUserMessage) && (
          <Avatar avatar={message.sender.avatarUrl as string} />
        )}
      </div>

      <div className={s.message__body}>
        <p className={`${!isMyMessage ? s.bubble_left : s.bubble_right}`}>
          <span>
            {message.text}
          </span>
          {
            message.imageUrl && (
              <img src={message.imageUrl} alt="message img" />
            )
          }
        </p>
        <span>{creationTime}</span>
      </div>
    </div>
  );
};
