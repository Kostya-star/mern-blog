import React from 'react';
import 'scss/all.scss';
import { ReactComponent as AvatarSVG } from 'assets/avatar.svg';
import { Input } from 'components/UI/Input/Input';
import { Button } from 'components/UI/Button/Button';

export const Register = () => {
  return (
    <div className="register">
      <div className="register__content">
        <h1>Create an account</h1>
        <AvatarSVG />
        <form>
        <Input type='text' placeholder='Name'/>
        <Input type='email' placeholder='E-mail'/>
        <Input type='password' placeholder='Password'/>
        <Button text='Sign up' className='button_colored' style={{width: '100%'}}/>
        </form>
      </div>
    </div>
  );
};
