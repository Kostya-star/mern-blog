import { CSSProperties, FC, MouseEvent, ReactNode, ButtonHTMLAttributes } from 'react';
// import s from './Button.module.scss'

interface IButtonProps {
  text: string;
  className: string;
  style?: CSSProperties;
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode
  type?: "button" | "reset" | "submit" 
  title?: string
}

export const Button: FC<IButtonProps> = ({ children, text, ...props }) => {
  return <button {...props}>{text}{children}</button>;
};
