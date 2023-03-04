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

  const token = window.localStorage.getItem('token');
  return (
    <>
      <div className={s.navigation}>
        <div className={s.navigation__content}>
          <Link to="/" className={s.navigation__logo}>
            <div>Constantin Blog</div>
          </Link>
          <h3 style={{ color: 'tomato', textDecoration: 'underline' }}>
            IF SOMETHING IS NOT WORKING AS EXPECTED, KEEP IN MIND THAT THE APP
            IS STILL IN DEVELOPMENT MODE!
          </h3>
          <div className={s.navigation__buttons}>
            {!isAuth && !token ? (
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
              <Link to="/login">
                <Button
                  text="Log out"
                  className="button button_delete"
                  onClick={onLogoutHandle}
                />
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className={s.navigation_fake}></div>
    </>
  );
};
