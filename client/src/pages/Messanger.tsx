import { instance } from 'API/instance';
import { ChatItem } from 'components/ChatItem/ChatItem';
import { Input } from 'components/UI/Input/Input';
import _debounce from 'lodash/debounce';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { accessChat, getAllChats } from 'redux/slices/messanger';

export const Messanger = () => {
  // const [searchChatsVal, setSearchChatsVal] = useState('');

  // const debounceSearchChats = useCallback(
  //   _debounce((userName) => getChatsByUserName(userName), 700),
  //   [],
  // );

  // const getChatsByUserName = async (userName: string) => {
  //   const resp = await instance.get(`chats/${userName}`)

  //   console.log(resp);
  // }

  // const onSearchChatsHandle = (e: ChangeEvent<HTMLInputElement>) => {
  //   setSearchChatsVal(e.target.value);
  //   debounceSearchChats(e.target.value);
  // };

  const dispatch = useAppDispatch()
  const { id } = useParams()

  const { chats, currentUserId} = useAppSelector(({ messanger, auth }) => ({
    chats: messanger.chats,
    currentUserId: auth.data?._id
  }))

  useEffect(() => {
    if(id) {
      (async () => {
        await dispatch(accessChat(id))
      })()
    }
  }, [])

  useEffect(() => {
    dispatch(getAllChats())
  }, [])
  
  return (
    <div className="messanger">
      {/* CHATS */}
      <div className="chats">
        <div className="chats__search">
          <Input
            type="text"
            placeholder="Search"
            // value={searchChatsVal}
            // onChange={onSearchChatsHandle}
          />
        </div>
        <div className="chats__list">
          {
            chats?.length 
            ? chats.map(chat => {
              return (
                <ChatItem key={chat._id} chat={chat} currentUserId={currentUserId as string}/>
              )
            })
            :
            <div>NO CHATS</div>
          }
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
