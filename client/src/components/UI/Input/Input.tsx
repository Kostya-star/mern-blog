import React, { ChangeEvent, FC, FocusEvent } from 'react';
import s from './Input.module.scss'
import { CSSProperties } from 'react';

interface InputProps {
  placeholder?: string
  id?: string
  type: string
  name?: string
  value?: string
  style?: CSSProperties 
  required?: boolean
  pattern?: string
  title?: string
  checked?: boolean
  disabled?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void
}

export const Input:FC<InputProps> = ({ ...props }) => {
  return (
    <>
      <input {...props} className={s.input}/>
    </>
  );
};
