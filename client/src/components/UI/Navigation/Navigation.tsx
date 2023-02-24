import { Link } from 'react-router-dom';
import 'scss/all.scss';
import 'scss/buttons.scss';
import { Button } from '../Button/Button';
import s from './Navigation.module.scss';

export const Navigation = () => {
  return (
    <>
      <div className={s.navigation}>
        <div className={s.navigation__content}>
          <Link to="/">
            <div className={s.navigation__logo}>Constantin Blog</div>
          </Link>
          <div className={s.navigation__buttons}>
            <Link to="/login">
              <Button text="Log in" className="button button_transparent" />
            </Link>
            <Link to="/register">
              <Button
                text="Create an account"
                className=" button button_colored"
              />
            </Link>
          </div>
        </div>
      </div>
      <div className={s.navigation_fake}></div>
    </>
  );
};
