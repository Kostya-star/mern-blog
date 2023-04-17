import { Avatar } from 'components/Avatar/Avatar';
import { FC, LegacyRef } from 'react';
import { IMessage } from 'types/IMessage';
import { createTimeSince } from 'utils/createTimeSince';
import s from './ChatMessage.module.scss';
// import { ReactComponent as MessageDetailsSVG } from 'assets/three_dots.svg'
import { ReactComponent as EditMessageSVG } from 'assets/edit.svg'
import { ReactComponent as DeleteMessageSVG } from 'assets/close.svg'
import { ReactComponent as HeartUncoloredSVG } from 'assets/heart-uncolored.svg'
import { ReactComponent as HeartColoredSVG } from 'assets/heart-colored.svg'

interface IChatMessageProps {
  message: IMessage;
  isMyMessage: boolean;
  isSameUserMessage: boolean;
  isLastUserMessage: boolean;
  messageRef: LegacyRef<HTMLDivElement>
  deleteMessage: (messId: string) => void
  onEditMessage: (mess: IMessage) => void
  onLikeMessage: (messId: string) => void
}

export const ChatMessage: FC<IChatMessageProps> = ({
  message,
  isMyMessage,
  isSameUserMessage,
  isLastUserMessage,
  messageRef,
  deleteMessage,
  onEditMessage,
  onLikeMessage
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

        {
          isMyMessage && (
            <div className={s.message__details}>
              <EditMessageSVG onClick={() => onEditMessage(message)} />
              <DeleteMessageSVG onClick={() => deleteMessage(message._id)} />
            </div>
          )
        }

        {
          !isMyMessage && (
            <span className={s.message__like} onClick={() => onLikeMessage(message._id)}>
              {
                message.isLiked
                ? <HeartColoredSVG/>
                :
                <HeartUncoloredSVG/>
              }
            </span>
          )
        }

        {
          isMyMessage && message.isLiked && (
            <span className={s.message__liked}>
              <HeartColoredSVG/>
            </span>
          )
        }
      </div>
    </div>
  );
};
