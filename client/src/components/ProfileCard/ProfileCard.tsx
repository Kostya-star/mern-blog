import { Avatar } from 'components/Avatar/Avatar';
import { Button } from 'components/UI/Button/Button';
import { Loader } from 'components/UI/Loader/Loader';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { IFollowUnfollowPayload } from 'types/IFollowUnfollowPayload';
import { IUser } from 'types/IUser';
import s from './ProfileCard.module.scss';
import { ReactComponent as UserEditSVG } from 'assets/user-edit.svg';


interface IProfileCardProps {
  profileUser: IUser;
  isFollowed: boolean;
  followStatus: string;
  currentUserId: string
  onFollowUser: (val: IFollowUnfollowPayload) => void;
  onShowFollowers: (userId: string) => void;
  onShowFollowing: (userId: string) => void;
}

export const ProfileCard: FC<IProfileCardProps> = ({
  profileUser,
  isFollowed,
  followStatus,
  currentUserId,
  onFollowUser,
  onShowFollowers,
  onShowFollowing,
}) => {
  return (
    <div className={s.profileCard}>
      <div className={s.profileCard__avatar}>
        <Avatar avatar={profileUser?.avatarUrl as string} />
      </div>
      <div className={s.profileCard__data}>
        <div className={s.profileCard__data__top}>
          <h4>
            {profileUser?.fullName}{' '}
            {profileUser._id === '64010100736d71817f3d671f' && (
              <strong>ADMIN</strong>
            )}
          </h4>
          {profileUser._id !== currentUserId &&
            (followStatus === 'loading' ? (
              <Loader className="loader_mini" />
            ) : (
              <>
                <Button
                  text={isFollowed ? 'Unfollow' : 'Follow'}
                  className={`button ${
                    isFollowed ? 'button_cancel' : 'button_follow'
                  }`}
                  onClick={() => onFollowUser({ userId: profileUser._id })}
                />
              </>
            ))}
            {
              profileUser._id !== currentUserId && (
                <Link to={`/messanger/${profileUser._id}`}>
                  <Button text="Message" className="button button_follow" />
                </Link>
              )
            }
            {
              profileUser._id === currentUserId && (
                <Link to='/profile/edit'>
                <Button text='Edit profile' className='button button_cancel' />
              </Link>

              )
            }
        </div>
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
