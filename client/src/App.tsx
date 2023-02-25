import { CreatePost } from 'pages/CreatePost';
import { FullPost } from 'pages/FullPost';
import { Home } from 'pages/Home';
import { Login } from 'pages/Login';
import { Register } from 'pages/Register';
import { Route, Routes } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks';
import { isAuthSelector } from 'redux/slices/auth';
import { Navigation } from './components/UI/Navigation/Navigation';
import './scss/all.scss';

const App = () => {
  const isAuth = useAppSelector(isAuthSelector);

  return (
    <div>
      <Navigation />
      <div className="app-body">
        <div className="container">
          <Routes>
            {!isAuth && (
              <>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/posts/:id" element={<FullPost />} />
              </>
            )}

            {isAuth && (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/posts/:id" element={<FullPost />} />
                <Route path="/add-post" element={<CreatePost />} />
              </>
            )}
            <Route path="*" element={<Login />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
