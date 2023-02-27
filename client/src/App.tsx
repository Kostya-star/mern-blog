import { AppRouter } from 'components/AppRouter';
import { useEffect, useState } from 'react';
import { onAuthMeThunk } from 'redux/slices/auth';
import { Navigation } from './components/UI/Navigation/Navigation';
import { useAppDispatch } from './redux/hooks';
import './scss/all.scss';

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (window.localStorage.getItem('token')) {
      dispatch(onAuthMeThunk());
    }
  }, []);

  return (
    <div>
      <Navigation />
      <AppRouter />
    </div>
  );
};

export default App;
