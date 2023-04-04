import { FC } from 'react';
import s from './ChatItem.module.scss';
import { IChat } from 'types/IChat';
import { Avatar } from 'components/Avatar/Avatar';
import { createTimeSince } from 'utils/createTimeSince';

interface IChatItemProps {
  chat: IChat;
  currentUserId: string;
}

export const ChatItem: FC<IChatItemProps> = ({ chat, currentUserId }) => {
  const interlocutorUser = chat.participants.find(
    (user) => user._id !== currentUserId,
  );
  const creationTime = createTimeSince(new Date(chat.createdAt));

  return (
    <div className={s.chatItem}>
      <div className={s.chatItem__group}>
        <div className={s.chatItem__img}>
          <Avatar avatar={interlocutorUser?.avatarUrl as string} />
        </div>

        <div className={s.chatItem__body}>
          <span>
            {interlocutorUser?.fullName}
          </span>
          <p>{chat.latestMessage?.text}</p>
        </div>
      </div>

      <div className={s.chatItem__timestamp}>
        <span>{creationTime}</span>
        {/* <span>@</span> */}
      </div>
    </div>
  );
};
