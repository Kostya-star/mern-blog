import { ReactComponent as AvatarDefaultSVG } from 'assets/avatar.svg';
import { FC } from 'react';
import { base64ToFile } from 'utils/base64ToFile';
import s from './Avatar.module.scss';

interface IAvatarProps {
  avatar: string;
}

export const Avatar: FC<IAvatarProps> = ({ avatar }) => {
  const file = base64ToFile(avatar);
  return (
    <div className={s.avatar}>
      {file ? (
        <img src={URL.createObjectURL(file)} alt="avatar" />
      ) : (
        <AvatarDefaultSVG />
      )}
    </div>
  );
};
