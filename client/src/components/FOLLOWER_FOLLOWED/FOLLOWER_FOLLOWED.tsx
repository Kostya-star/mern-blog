import { Button } from 'components/UI/Button/Button';
import React, { FC, ReactNode } from 'react';
import { ReactComponent as PlusSVG } from 'assets/plus.svg';
import { IUser } from 'types/IUser';
import s from './FOLLOWER_FOLLOWED.module.scss';
import { useNavigate } from 'react-router-dom';
import { Avatar } from 'components/Avatar/Avatar';
import { IFollowUnfollowPayload } from 'types/IFollowUnfollowPayload';
import { Loader } from 'components/UI/Loader/Loader';

interface IFOLLOWER_FOLLOWEDProps {
  user: IUser;
  children: ReactNode;
  // isFollowerFollowed: boolean;
  currentUserId: string;
  followStatus: string;
  onFollowUser: (val: IFollowUnfollowPayload) => void;
}

export const FOLLOWER_FOLLOWED: FC<IFOLLOWER_FOLLOWEDProps> = ({
  children,
  user,
  // isFollowerFollowed,
  currentUserId,
  followStatus,
  onFollowUser,
}) => {
  const navigate = useNavigate();
  const onRedirectAboutProfile = () => {
    navigate(`/profile/about/${user._id}`);
  };

  const isFollowerFollowed = user.usersFollowed.includes(currentUserId);


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
          (followStatus === 'loading' ?(
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

      <div>{children}</div>
    </div>
  );
};
