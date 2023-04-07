import s from './OnlineOfflineCircle.module.scss'
import { FC } from 'react';

interface IOnlineOfflineCircleProps {
  isOnline: boolean
}

export const OnlineOfflineCircle: FC<IOnlineOfflineCircleProps> = ({ isOnline }) => {
  return (
    <span title={isOnline ? 'online' : 'offline'} className={isOnline ? s.status_online : s.status_offline}></span>
  )
}
