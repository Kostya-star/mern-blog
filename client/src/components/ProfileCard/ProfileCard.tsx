import { Avatar } from 'components/Avatar/Avatar';
import { FC } from 'react';
import { IUser } from 'types/IUser';
import s from './ProfileCard.module.scss';

interface IProfileCardProps {
  browsedUser: IUser;
}

export const ProfileCard: FC<IProfileCardProps> = ({ browsedUser }) => {
  const accountCreationDate = new Date(
    browsedUser?.createdAt as string,
  ).toLocaleDateString();

  return (
    <div className={s.profileCard}>
      <Avatar avatar={browsedUser?.avatarUrl as string} />
      <div className={s.profileCard__data}>
        <div>
          Name: {browsedUser?.fullName}{' '}
          {browsedUser._id === '64010100736d71817f3d671f' && (
            <strong>ADMIN</strong>
          )}
        </div>
        {/* <div>Email: {browsedUser?.email}</div> */}
        <div>Created: {accountCreationDate}</div>
        <div>Posts created: {browsedUser?.postsCreated}</div>
      </div>
    </div>
  );
};
