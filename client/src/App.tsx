import { FullPost } from 'pages/FullPost';
import { Home } from 'pages/Home';
import { Login } from 'pages/Login';
import { Register } from 'pages/Register';
import { Navigation } from './components/UI/Navigation/Navigation';
import './scss/all.scss';

const App = () => {
  return (
    <div>
      <div className="container">
        <Navigation />
      </div>
      <div style={{ height: '100%', minHeight: '100vh', backgroundColor: '#f1f3f9' }}>
        <div className="container">
          {/* <Register /> */}
          {/* <Login/> */}
          {/* <Home /> */}
          <FullPost/>
        </div>
      </div>
    </div>
  );
};

export default App;
