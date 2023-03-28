import { ReactComponent as AvatarDefaultSVG } from 'assets/avatar.svg';
import { FC } from 'react';
import s from './Avatar.module.scss';

interface IAvatarProps {
  avatar: string;
  onClick?: () => void
}

export const Avatar: FC<IAvatarProps> = ({ avatar, onClick }) => {
  return (
    <div className={`${s.avatar} ${onClick && s.isClickable}`} onClick={onClick}>
      {avatar ? (
        <img src={avatar} alt="avatar" />
      ) : (
        <AvatarDefaultSVG />
      )}
    </div>
  );
};
