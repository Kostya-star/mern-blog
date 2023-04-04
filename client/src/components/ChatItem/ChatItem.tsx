import React from 'react'
import s from './ChatItem.module.scss'

export const ChatItem = () => {
  return (
    <div className={s.chatItem}>
      <div className={s.chatItem__img}>
        <img src="https://storage.googleapis.com/mern-blog/ID::6425d36419c6cfee21802309::ID-ivan.jpg" alt="" />
      </div>

      <div className={s.chatItem__body}>
        <span><b>Ivan Danilov</b></span>
        <p>My last message in the chat</p>
      </div>

      <div className={s.chatItem__timestamp}>
        <span>9:13</span>
        <span>@</span>
      </div>
    </div>
  )
}
