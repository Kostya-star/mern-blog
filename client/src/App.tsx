import { AppRouter } from 'components/AppRouter';
import { useEffect, useRef, useState } from 'react';
import {
  isAuthSelector,
  onAuthMeThunk,
  setOnlineUsers,
} from 'redux/slices/auth';
import { Navigation } from './components/UI/Navigation/Navigation';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import './scss/all.scss';
import io, { Socket } from 'socket.io-client';
import { baseUrl } from 'API/baseUrl';

export const socket = io(baseUrl);

const App = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  const { currentUser } = useAppSelector(({ auth }) => ({
    currentUser: auth.data,
  }));

  const isAuth = useAppSelector(isAuthSelector);

  useEffect(() => {
    (async () => {
      try {
        await dispatch(onAuthMeThunk());
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (isAuth && currentUser && !loading) {
      socket.connect();

      socket.emit('add new user', currentUser._id);
      socket.on('getOnlineUsers', (users) => {
        dispatch(setOnlineUsers(users));
      });
    } else if (!isAuth && !loading) {
      socket.disconnect();
      socket.on('getOnlineUsers', (users) => {
        dispatch(setOnlineUsers(users));
      });
    }

    return () => {
      socket.off('getOnlineUsers');
    };
  }, [currentUser, isAuth, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navigation />
      <AppRouter />
    </div>
  );
};

export default App;
