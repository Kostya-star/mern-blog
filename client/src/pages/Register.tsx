import React from 'react';
import 'scss/all.scss';
import { ReactComponent as AvatarSVG } from 'assets/avatar.svg';
import { Input } from 'components/UI/Input/Input';
import { Button } from 'components/UI/Button/Button';

export const Register = () => {
  return (
    <div className="auth">
      <div className="auth__content">
        <h1>Create an account</h1>
        <AvatarSVG />
        <form>
          <div className="input">
            <Input type="text" placeholder="Name" />
          </div>
          <div className="input">
            <Input type="email" placeholder="E-mail" />
          </div>
          <div className="input">
            <Input type="password" placeholder="Password" />
          </div>
          <Button
            text="Sign up"
            className="button button_colored"
            style={{ width: '100%' }}
          />
        </form>
      </div>
    </div>
  );
};
