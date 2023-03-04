import { ReactComponent as AvatarDefaultSVG } from 'assets/avatar.svg';
import { FC } from 'react';
import s from './Avatar.module.scss'
import { base64ToFile } from 'utils/base64ToFile';

interface IAvatarProps {
  avatar: string;
}


export const Avatar: FC<IAvatarProps> = ({ avatar }) => {
  const file = base64ToFile(avatar)
  return (
    <div className={s.avatar}>
      {file ? (
        <img src={URL.createObjectURL(file)} alt="avatar" />
        // <img src={`http://localhost:5000${avatar}`} alt="avatar" />
        // <img src={`${process.env.REACT_APP_API_URL}${avatar}`} alt="avatar" />
      ) : (
        <AvatarDefaultSVG />
      )}
    </div>
  );
};
