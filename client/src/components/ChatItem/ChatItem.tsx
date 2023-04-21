import { FC } from 'react';
import s from './ChatItem.module.scss';
import { IChat } from 'types/IChat';
import { Avatar } from 'components/Avatar/Avatar';
import { createTimeSince } from 'utils/createTimeSince';
import { OnlineOfflineCircle } from 'components/OnlineOfflineCircle/OnlineOfflineCircle';
import { IUser } from 'types/IUser';

interface IChatItemProps {
  chat?: IChat;
  user?: IUser;
  isActiveChat?: boolean;
  isUserOnline: boolean;
  selectedInterlocutor?: IUser;
  chatUnreadMessagesCount?: number;
  creationTime?: string;
  typing?: { isTyping: boolean; chatId: string };
}

export const ChatItem: FC<IChatItemProps> = ({
  chat,
  user,
  isActiveChat,
  isUserOnline,
  chatUnreadMessagesCount,
  typing,
  creationTime,
  selectedInterlocutor,
}) => {
  // IF CHAT
  return chat ? (
    <div className={`${s.chatItem} ${isActiveChat && s.chatItem_active}`}>
      <div className={s.chatItem__group}>
        <div className={s.chatItem__img}>
          <Avatar avatar={selectedInterlocutor?.avatarUrl as string} />
        </div>

        <div className={s.chatItem__body}>
          <span>
            {selectedInterlocutor?.fullName}
            <OnlineOfflineCircle isOnline={isUserOnline} />
          </span>
          <p>
            {typing?.chatId && typing.chatId === chat._id ? (
              <span className={s.chatItem__body__typing}>typing...</span>
            ) : (
              <span className={s.chatItem__body__lastMessage}>
                {chat.latestMessage?.imageUrl && (
                  <img src={chat.latestMessage.imageUrl} />
                )}
                {chat.latestMessage?.text}
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
  ) : (
    // IF USER (WHEN SEARCHING FOR SUERS TO START A NEW CHAT)
    <div className={s.chatItem}>
      <div className={s.chatItem__group}>
        <div className={s.chatItem__img}>
          <Avatar avatar={user?.avatarUrl as string} />
        </div>

        <div className={s.chatItem__body}>
          <span>{user?.fullName}</span>
          {isUserOnline && <OnlineOfflineCircle isOnline={isUserOnline} />}
        </div>
      </div>
    </div>
  );
};
