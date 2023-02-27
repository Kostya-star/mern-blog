import { CreatePost } from 'pages/CreatePost';
import { FullPost } from 'pages/FullPost';
import { Home } from 'pages/Home';
import { Login } from 'pages/Login';
import { Register } from 'pages/Register';
import { Route, Routes } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks';
import { isAuthSelector } from 'redux/slices/auth';

export const AppRouter = () => {
  const isAuth = useAppSelector(isAuthSelector);

  const token = window.localStorage.getItem('token');

  return (
    <div className="app-body">
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />

          {(!token) && (
            <>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </>
          )}

          {(token) && (
            <>
              <Route path="/add-post" element={<CreatePost />} />
            </>
          )}

          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
};
