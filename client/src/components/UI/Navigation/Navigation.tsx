import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { isAuthSelector, logout } from 'redux/slices/auth';
import 'scss/all.scss';
import 'scss/buttons.scss';
import { Button } from '../Button/Button';
import s from './Navigation.module.scss';

export const Navigation = () => {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(isAuthSelector);

  const onLogoutHandle = () => {
    window.localStorage.removeItem('token');
    dispatch(logout());
  };
  return (
    <>
      <div className={s.navigation}>
        <div className={s.navigation__content}>
          <Link to="/">
            <div className={s.navigation__logo}>Constantin Blog</div>
          </Link>
          <div className={s.navigation__buttons}>
            {!isAuth ? (
              <>
                <Link to="/login">
                  <Button text="Log in" className="button button_transparent" />
                </Link>
                <Link to="/register">
                  <Button
                    text="Create an account"
                    className=" button button_colored"
                  />
                </Link>
              </>
            ) : (
              <>
                <Link to="/add-post">
                  <Button
                    text="Create post"
                    className="button button_colored"
                  />
                </Link>
                <Link to="/login">
                  <Button
                    text="Log out"
                    className="button button_delete"
                    onClick={onLogoutHandle}
                  />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className={s.navigation_fake}></div>
    </>
  );
};
