import { CreatePost } from 'pages/CreatePost';
import { FullPost } from 'pages/FullPost';
import { Home } from 'pages/Home';
import { Login } from 'pages/Login';
import { Register } from 'pages/Register';
import { Route, Routes } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks';
import { isAuthSelector } from 'redux/slices/auth';
import { useEffect } from 'react'

export const AppRouter = () => {
  const isAuth = useAppSelector(isAuthSelector);

  let token = localStorage.getItem('token')

  useEffect(() => {
    // console.log(token);
    
  }, [token])
  

  return (
    <div className="app-body">
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />

          {(!isAuth) && (
            <>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </>
          )}

          {(isAuth) && (
            <>
              <Route path="/add-post" element={<CreatePost />} />
              <Route path="/posts/:id/edit" element={<CreatePost />} />
            </>
          )}

          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
};
