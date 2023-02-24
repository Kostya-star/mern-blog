import { CreatePost } from 'pages/CreatePost';
import { FullPost } from 'pages/FullPost';
import { Home } from 'pages/Home';
import { Login } from 'pages/Login';
import { Register } from 'pages/Register';
import { Navigation } from './components/UI/Navigation/Navigation';
import './scss/all.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <Navigation />
      <div className="app-body">
        <div className="container">
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
              <Route path="/posts/:id" element={<FullPost />} />
              <Route path="/add-post" element={<CreatePost />} />
            </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
