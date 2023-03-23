import { Avatar } from 'components/Avatar/Avatar';
import { Button } from 'components/UI/Button/Button';
import { Loader } from 'components/UI/Loader/Loader';
import { FC } from 'react';
import { IFollowUnfollowPayload } from 'types/IFollowUnfollowPayload';
import { IUser } from 'types/IUser';
import s from './ProfileCard.module.scss';

interface IProfileCardProps {
  profileUser: IUser;
  isFollowed: boolean;
  isShowAvatarButtons: boolean;
  followStatus: string;
  onFollowUser: (val: IFollowUnfollowPayload) => void;
  onShowFollowers: (userId: string) => void;
  onShowFollowing: (userId: string) => void;
}

export const ProfileCard: FC<IProfileCardProps> = ({
  profileUser,
  isFollowed,
  isShowAvatarButtons,
  followStatus,
  onFollowUser,
  onShowFollowers,
  onShowFollowing,
}) => {
  return (
    <div className={s.profileCard} >
      <div className={s.profileCard__avatar} >
        <Avatar avatar={profileUser?.avatarUrl as string} />
        {isShowAvatarButtons && (
          <div className={s.profileCard__avatar__buttons}>
            {
              followStatus === 'loading' 
                ? <Loader className='loader_mini'/>
                :
                <Button
                  text={isFollowed ? 'Unfollow' : 'Follow'}
                  className={`button ${
                    isFollowed ? 'button_cancel' : 'button_follow'
                  }`}
                  // disabled={followStatus === 'loading'}
                  onClick={() => onFollowUser({ userId: profileUser._id })}
                />
            }
            {/* <Button text="Message" className="button button_follow" /> */}
          </div>
        )}
      </div>
      <div className={s.profileCard__data}>
        <h4>
          {profileUser?.fullName}{' '}
          {profileUser._id === '64010100736d71817f3d671f' && (
            <strong>ADMIN</strong>
          )}
        </h4>
        <div className={s.profileCard__data__statistics}>
          <div>
            <strong>{profileUser?.postsCreated}</strong> posts
          </div>
          <div
            onClick={() => onShowFollowers(profileUser._id)}
            className={s.followers}
          >
            <strong>{profileUser?.usersFollowed?.length}</strong> followers
          </div>
          <div
            onClick={() => onShowFollowing(profileUser._id)}
            className={s.following}
          >
            <strong>{profileUser?.usersFollowing?.length}</strong> following
          </div>
        </div>
      </div>
    </div>
  );
};
