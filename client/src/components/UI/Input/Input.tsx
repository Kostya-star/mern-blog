import React, { FC } from 'react';
import s from './Input.module.scss'
import { CSSProperties } from 'react';

interface InputProps {
  placeholder: string
  type: string
  style?: CSSProperties 
}

export const Input:FC<InputProps> = ({ ...props }) => {
  return (
    <>
      <input {...props} className={s.input}/>
    </>
  );
};
