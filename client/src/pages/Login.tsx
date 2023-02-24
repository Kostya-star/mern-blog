import { Button } from 'components/UI/Button/Button';
import { Input } from 'components/UI/Input/Input';
import React from 'react';

export const Login = () => {
  return (
    <div className="register">
      <div className="register__content">
        <h1>Log into your account</h1>
        <form>
          <Input type="email" placeholder="E-mail" />
          <Input type="password" placeholder="Password" />
          <Button
            text="Sign in"
            className="button_colored"
            style={{ width: '100%' }}
          />
        </form>
      </div>
    </div>
  );
};
