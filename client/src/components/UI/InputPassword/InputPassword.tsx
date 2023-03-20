import { ChangeEvent, FC, FocusEvent, useState } from 'react';
import s from './InputPassword.module.scss';
import { ReactComponent as EyeOpenSVG } from 'assets/eye.svg';
import { ReactComponent as EyeClosedSVG } from 'assets/eye-closed.svg';

interface InputPasswordProps {
  placeholder?: string;
  id?: string;
  name?: string;
  value?: string;
  required?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
}

export const InputPassword: FC<InputPasswordProps> = ({ ...props }) => {
  const [isShowPassword, setShowPassword] = useState(false);

  return (
    <div className={s.inputPassword}>
      <input {...props} type={isShowPassword ? 'text' : 'password'} />
      <span onClick={() => setShowPassword((val) => !val)}>
        {isShowPassword ? <EyeOpenSVG /> : <EyeClosedSVG />}
      </span>
    </div>
  );
};
