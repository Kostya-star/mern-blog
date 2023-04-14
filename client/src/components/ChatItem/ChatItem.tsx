import { FC } from 'react';
import s from './ChatItem.module.scss';
import { IChat } from 'types/IChat';
import { Avatar } from 'components/Avatar/Avatar';
import { createTimeSince } from 'utils/createTimeSince';
import { OnlineOfflineCircle } from 'components/OnlineOfflineCircle/OnlineOfflineCircle';

interface IChatItemProps {
  chat: IChat;
  currentUserId: string;
  isActiveChat: boolean;
  isUserOnline: boolean;
  chatUnreadMessagesCount?: number;
  typing: { isTyping: boolean; chatId: string };
}

export const ChatItem: FC<IChatItemProps> = ({
  chat,
  currentUserId,
  isActiveChat,
  isUserOnline,
  chatUnreadMessagesCount,
  typing,
}) => {
  const interlocutorUser = chat.participants.find(
    (user) => user._id !== currentUserId,
  );
  const creationTime = createTimeSince(new Date(chat.createdAt));

  return (
    <div className={`${s.chatItem} ${isActiveChat && s.chatItem_active}`}>
      <div className={s.chatItem__group}>
        <div className={s.chatItem__img}>
          <Avatar avatar={interlocutorUser?.avatarUrl as string} />
        </div>

        <div className={s.chatItem__body}>
          <span>
            {interlocutorUser?.fullName}
            <OnlineOfflineCircle isOnline={isUserOnline} />
          </span>
          <p>
            {typing.chatId && typing.chatId === chat._id ? (
              <span className={s.chatItem__body__typing}>typing...</span>
            ) : (
              <span className={s.chatItem__body__lastMessage}>
                {
                  chat.latestMessage?.imageUrl && <img src={chat.latestMessage.imageUrl}/>
                }
                {
                  chat.latestMessage?.text
                }
              </span>
            )}
          </p>
        </div>
      </div>

      <div className={s.chatItem__timestamp}>
        <span>{creationTime}</span>
        {chatUnreadMessagesCount ? (
          <span className={s.unreadMessages}>{chatUnreadMessagesCount}</span>
        ) : null}
      </div>
    </div>
  );
};
