import React from 'react'
import { Input } from 'components/UI/Input/Input';
import { ChatItem } from 'components/ChatItem/ChatItem';

export const Messanger = () => {
  return (
    <div className="messanger">
      {/* CHATS */}
      <div className="chats">
        <div className="chats__search">
          <Input type="text" placeholder="Search" />
        </div>
        <div className="chats__list">
          <ChatItem />
          <ChatItem />
          <ChatItem />
          <ChatItem />
          <ChatItem />
        </div>
      </div>

      {/* CURRENT CHAT */}
      <div className="currentChat">
        <div className="currentChat__heading">
          <span>Ivan Danilov</span>
          <span>Delete svg</span>
        </div>

        <div className="currentChat__body">MAIN CHAT with ivan</div>

        <div className="currentChat__footer">
          <Input type='text' placeholder='type a message'/>
          <span>Attach svg</span>
        </div>
      </div>
    </div>
  );
}
