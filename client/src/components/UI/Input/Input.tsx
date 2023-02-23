import React, { FC } from 'react';
import s from './Input.module.scss'

interface InputProps {
  placeholder: string
  type: string
}

export const Input:FC<InputProps> = ({ ...props }) => {
  return (
    <>
      <input {...props} className={s.input}/>
    </>
  );
};
