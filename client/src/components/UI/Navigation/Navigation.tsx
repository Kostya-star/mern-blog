import { Avatar } from 'components/Avatar/Avatar';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { isAuthSelector, logout } from 'redux/slices/auth';
import 'scss/all.scss';
import 'scss/buttons.scss';
import { Button } from '../Button/Button';
import s from './Navigation.module.scss';
import { ReactComponent as ArrowDownSVG } from 'assets/arrow-down.svg';
import { ReactComponent as UserEditSVG } from 'assets/user-edit.svg';
import { ReactComponent as UserAboutSVG } from 'assets/about-profile.svg';
import { ReactComponent as SignOutSVG } from 'assets/sign-out.svg';
import { useRef, useState, useEffect } from 'react';

export const Navigation = () => {
  const dispatch = useAppDispatch();

  const isAuth = useAppSelector(isAuthSelector);
  const token = window.localStorage.getItem('token');

  const [isShowDropdown, setShowDropdown] = useState(false);

  const dropDownRef = useRef<HTMLDivElement>(null);

  const { userPhoto, userName } = useAppSelector(({ auth }) => ({
    userPhoto: auth.data?.avatarUrl,
    userName: auth.data?.fullName,
  }));

  useEffect(() => {
    const onOutsideDropDownClick = (e: Event) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', onOutsideDropDownClick);

    return () => {
      document.removeEventListener('mousedown', onOutsideDropDownClick);
    };
  }, [dropDownRef]);

  const onLogoutHandle = () => {
    setShowDropdown(false);
    window.localStorage.removeItem('token');
    dispatch(logout());
  };

  return (
    <>
      <div className={s.navigation}>
        <div className={s.navigation__content}>
          <Link to="/" className={s.navigation__logo}>
            <div>Go home</div>
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
                <div
                  className={s.navigation__profile}
                  onClick={() => setShowDropdown(!isShowDropdown)}
                >
                  <p>
                    <span>{userName}</span> <ArrowDownSVG />
                  </p>
                  <Avatar avatar={userPhoto as string} />
                </div>
                {isShowDropdown && (
                  <div
                    className={s.navigation__profile__dropdown}
                    ref={dropDownRef}
                  >
                    <ul>
                      <Link to='/profile/about'>
                        <li>
                          About me <UserAboutSVG />
                        </li>
                      </Link>
                      <Link to='/profile/edit'>
                        <li>
                          Edit me<UserEditSVG />
                        </li>
                      </Link>
                    <Link to="/login">
                      <li onClick={onLogoutHandle}>
                        Sign out <SignOutSVG />
                      </li>
                  </Link>
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
