import { FullPost } from 'pages/FullPost';
import { Home } from 'pages/Home';
import { Login } from 'pages/Login';
import { Register } from 'pages/Register';
import { Navigation } from './components/UI/Navigation/Navigation';
import './scss/all.scss';
import { CreatePost } from 'pages/CreatePost';

const App = () => {
  return (
    <div>
        <Navigation />
      <div className='app-body' >
        <div className="container">
          {/* <Register /> */}
          {/* <Login/> */}
          {/* <Home /> */}
          {/* <FullPost/> */}
          {/* <CreatePost/> */}
        </div>
      </div>
    </div>
  );
};

export default App;
