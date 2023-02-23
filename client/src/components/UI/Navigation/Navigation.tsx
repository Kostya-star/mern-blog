import { Button } from '../Button/Button';
import s from './Navigation.module.scss';
import 'scss/buttons.scss';
import 'scss/all.scss'

export const Navigation = () => {
  return (
    <div className={s.navigation}>
      {/* <div className="container"> */}
      <div className={s.navigation__content}>
        <div className={s.navigation__logo}>Constantin Blog</div>
        <div className={s.navigation__buttons}>
          <Button text="Log in" className="button_transparent" />
          <Button className="button_colored" text="Create an account" />
        </div>
      </div>

      {/* </div> */}
    </div>
  );
};
