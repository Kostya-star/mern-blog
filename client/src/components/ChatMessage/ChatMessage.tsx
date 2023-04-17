import { Avatar } from 'components/Avatar/Avatar';
import { FC, LegacyRef } from 'react';
import { IMessage } from 'types/IMessage';
import { createTimeSince } from 'utils/createTimeSince';
import s from './ChatMessage.module.scss';
// import { ReactComponent as MessageDetailsSVG } from 'assets/three_dots.svg'
import { ReactComponent as EditMessageSVG } from 'assets/edit.svg'
import { ReactComponent as DeleteMessageSVG } from 'assets/close.svg'

interface IChatMessageProps {
  message: IMessage;
  isMyMessage: boolean;
  isSameUserMessage: boolean;
  isLastUserMessage: boolean;
  messageRef: LegacyRef<HTMLDivElement>
  deleteMessage: (messId: string) => void
  onEditMessage: (mess: IMessage) => void
}

export const ChatMessage: FC<IChatMessageProps> = ({
  message,
  isMyMessage,
  isSameUserMessage,
  isLastUserMessage,
  messageRef,
  deleteMessage,
  onEditMessage
}) => {
  const creationTime = createTimeSince(new Date(message.createdAt));
  

  return (
    <div
      className={`${s.message} ${isMyMessage && s.message_myMessage}`}
      ref={messageRef}
    >
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
          <span>{message.text}</span>
          {message.imageUrl && <img src={message.imageUrl} alt="message img" />}
        </p>
        <span>{creationTime}</span>
        {/* <div className={`${s.message__details} ${isMyMessage ? s.message__details__mySms : s.message__details__notMySms}`}>
          <MessageDetailsSVG />
        </div> */}

        {
          isMyMessage && (
            <div className={s.message__details}>
              <EditMessageSVG onClick={() => onEditMessage(message)} />
              <DeleteMessageSVG onClick={() => deleteMessage(message._id)} />
            </div>
          )
        }
      </div>
    </div>
  );
};
