import { AppRouter } from 'components/AppRouter';
import { useEffect, useState } from 'react';
import { onAuthMeThunk } from 'redux/slices/auth';
import { Navigation } from './components/UI/Navigation/Navigation';
import { useAppDispatch } from './redux/hooks';
import './scss/all.scss';

const App = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // setLoading(true)
    // if (window.localStorage.getItem('token')) {
      (async () => {
        try {
          await dispatch(onAuthMeThunk())
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false)
        }
      })()
    // }
  }, []);

  if(loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Navigation />
      <AppRouter />
    </div>
  );
}

export default App;
