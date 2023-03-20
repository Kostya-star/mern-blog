import { Avatar } from 'components/Avatar/Avatar';
import { Button } from 'components/UI/Button/Button';
import { FC } from 'react';
import { IUser } from 'types/IUser';
import s from './ProfileCard.module.scss';

interface IProfileCardProps {
  browsedUser: IUser;
  isFollowed: boolean;
  isShowAvatarButtons: boolean;
  onFollowUser: (userId: string) => void;
}

export const ProfileCard: FC<IProfileCardProps> = ({
  browsedUser,
  isFollowed,
  isShowAvatarButtons,
  onFollowUser,
}) => {

  return (
    <div className={s.profileCard}>
      <div className={s.profileCard__avatar}>
        <Avatar avatar={browsedUser?.avatarUrl as string} />
        {isShowAvatarButtons && (
          <div className={s.profileCard__avatar__buttons}>
            <Button
              text={isFollowed ? 'Unfollow' : 'Follow'}
              className={`button ${
                isFollowed ? 'button_cancel' : 'button_follow'
              }`}
              onClick={() => onFollowUser(browsedUser._id)}
            />
            {/* <Button text="Message" className="button button_follow" /> */}
          </div>
        )}
      </div>
      <div className={s.profileCard__data}>
        <h4>
          {browsedUser?.fullName}{' '}
          {browsedUser._id === '64010100736d71817f3d671f' && (
            <strong>ADMIN</strong>
          )}
        </h4>
        <div className={s.profileCard__data__statistics}>
          <div>{browsedUser?.postsCreated} posts</div>
          <div>{browsedUser?.usersFollowed?.length} followers</div>
          <div>{browsedUser?.usersFollowing?.length} following</div>
        </div>
      </div>
    </div>
  );
};
