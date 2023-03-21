import { FC } from 'react';
import s from './Loader.module.scss';

interface ILoaderProps {
  className: 'loader_big' | 'loader_mini';
}

export const Loader: FC<ILoaderProps> = ({ className }) => {
  return <div className={`${s.loader} ${s[className]}`}></div>;
};
