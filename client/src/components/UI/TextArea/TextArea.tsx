import React, { FC, ChangeEvent, FocusEvent } from 'react';

import s from './TextArea.module.scss'

interface ITextAreaProps {
  id?: string
  placeholder: string
  value: string
  name?: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void
  required?: boolean
}

export const TextArea:FC<ITextAreaProps> = ({ ...props }) => {
  return (
    <>
      <textarea { ...props }  className={s.textarea}></textarea>
    </>
  );
};
