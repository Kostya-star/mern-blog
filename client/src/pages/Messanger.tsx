import { instance } from 'API/instance';
import { ChatItem } from 'components/ChatItem/ChatItem';
import { Input } from 'components/UI/Input/Input';
import _debounce from 'lodash/debounce';
import { ChangeEvent, useCallback, useState } from 'react';

export const Messanger = () => {
  const [searchChatsVal, setSearchChatsVal] = useState('');

  const debounceSearchChats = useCallback(
    _debounce((userName) => getChatsByUserName(userName), 700),
    [],
  );

  const getChatsByUserName = async (userName: string) => {
    const resp = await instance.get(`chats/${userName}`)

    console.log(resp);
  }

  const onSearchChatsHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchChatsVal(e.target.value);
    debounceSearchChats(e.target.value);
  };
  
  return (
    <div className="messanger">
      {/* CHATS */}
      <div className="chats">
        <div className="chats__search">
          <Input
            type="text"
            placeholder="Search"
            value={searchChatsVal}
            onChange={onSearchChatsHandle}
          />
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
          <Input type="text" placeholder="type a message" />
          <span>Attach svg</span>
        </div>
      </div>
    </div>
  );
};
