import { ReactComponent as AvatarDefaultSVG } from 'assets/avatar.svg';
import { FC } from 'react';
import s from './Avatar.module.scss'

interface IAvatarProps {
  avatar: string;
}

export const Avatar: FC<IAvatarProps> = ({ avatar }) => {
  return (
    <div className={s.avatar}>
      {avatar ? (
        <img src={`http://localhost:5000${avatar}`} alt="avatar" />
      ) : (
        <AvatarDefaultSVG />
      )}
    </div>
  );
};
