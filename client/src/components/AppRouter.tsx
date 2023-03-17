import { CreatePost } from 'pages/CreatePost';
import { Home } from 'pages/Home';
import { Login } from 'pages/Login';
import { ProfileAbout } from 'pages/ProfileAbout';
import { ProfileEdit } from 'pages/ProfileEdit';
import { Register } from 'pages/Register';
import { Tags } from 'pages/Tags';
import { Route, Routes } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks';
import { isAuthSelector } from 'redux/slices/auth';

export const AppRouter = () => {
  const isAuth = useAppSelector(isAuthSelector);

  return (
    <div className="app-body">
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/posts/:id" element={<FullPost />} /> */}
          <Route path="/tags/:tag" element={<Tags />} />
          <Route path="/profile/about/:id" element={<ProfileAbout />} />

          {!isAuth && (
            <>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </>
          )}

          {isAuth && (
            <>
              <Route path="/add-post" element={<CreatePost />} />
              <Route path="/posts/:id/edit" element={<CreatePost />} />
              <Route path="/profile/about" element={<ProfileAbout />} />
              <Route path="/profile/edit" element={<ProfileEdit />} />
            </>
          )}

          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
};
