import { ReactComponent as PlusSVG } from 'assets/plus.svg';
import { Avatar } from 'components/Avatar/Avatar';
import { Button } from 'components/UI/Button/Button';
import { Loader } from 'components/UI/Loader/Loader';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { IFollower } from 'types/IFollower';
import { IFollowersModal } from 'types/IFollowersModal';
import { IFollowUnfollowPayload } from 'types/IFollowUnfollowPayload';
import s from './FOLLOWER_FOLLOWED.module.scss';

interface IFOLLOWER_FOLLOWEDProps {
  user: IFollower;
  modal: IFollowersModal | null;
  currentUserId: string;
  followStatus: string;
  profileUserId: string;
  onFollowUser: (val: IFollowUnfollowPayload) => void;
  onRemoveFollower: (userId: string) => void;
}

export const FOLLOWER_FOLLOWED: FC<IFOLLOWER_FOLLOWEDProps> = ({
  user,
  currentUserId,
  followStatus,
  modal,
  profileUserId,
  onFollowUser,
  onRemoveFollower,
}) => {
  const navigate = useNavigate();

  const onRedirectAboutProfile = () => {
    navigate(`/profile/about/${user._id}`);
  };

  const isFollowerFollowed = user.usersFollowed.includes(currentUserId);

  const isRemoveBtn = modal?.followers && profileUserId === currentUserId;
  const isFollowingBtn =
    modal?.followings && user.usersFollowed.includes(currentUserId);

  return (
    <div className={s.user}>
      <div className={s.user__data}>
        <div className={s.user__data__avatar}>
          <Avatar
            avatar={user.avatarUrl as string}
            onClick={onRedirectAboutProfile}
          />
        </div>
        <span className={s.user__data__name} onClick={onRedirectAboutProfile}>
          {user.fullName}
        </span>
        {!isFollowerFollowed &&
          currentUserId !== user._id &&
          (user.isFollowLoading ? (
            <Loader className="loader_mini" />
          ) : (
            <Button
              text="Follow"
              className="button_follow_mini"
              onClick={() =>
                onFollowUser({ userId: user._id, isFollowersModal: true })
              }
            >
              <PlusSVG />
            </Button>
          ))}
      </div>

      <div className={s.user__buttons}>
        {isRemoveBtn && (
          <Button
            text="Remove"
            className="button button_cancel"
            disabled={followStatus === 'loading'}
            onClick={() => onRemoveFollower(user._id)}
          />
        )}
        {isFollowingBtn &&
          (user?.isFollowLoading ? (
            <Loader className="loader_mini" />
          ) : (
            <Button
              text="Following"
              className="button button_cancel"
              onClick={() =>
                onFollowUser({ userId: user._id, isFollowersModal: true })
              }
            />
          ))}
      </div>
    </div>
  );
};
