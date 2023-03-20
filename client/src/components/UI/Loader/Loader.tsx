import s from './Loader.module.scss'
import { FC, CSSProperties } from 'react';

interface ILoaderProps {
  style?: CSSProperties
}

export const Loader:FC<ILoaderProps> = ({ ...props }) => {
  return (
    <div {...props} className={s.loader}></div>
  )
}
