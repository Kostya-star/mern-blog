import 'scss/all.scss';
import 'scss/buttons.scss';
import { Button } from '../Button/Button';
import s from './Navigation.module.scss';

export const Navigation = () => {
  return (
    <>
      <div className={s.navigation}>
        <div className={s.navigation__content}>
          <div className={s.navigation__logo}>Constantin Blog</div>
          <div className={s.navigation__buttons}>
            <Button text="Log in" className="button button_transparent" />
            <Button
              text="Create an account"
              className=" button button_colored"
            />
          </div>
        </div>
      </div>
      <div className={s.navigation_fake}></div>
    </>
  );
};
