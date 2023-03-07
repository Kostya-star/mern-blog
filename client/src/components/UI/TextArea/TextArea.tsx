import React, { FC, ChangeEvent, FocusEvent, forwardRef, Ref, FormEvent } from 'react';

import s from './TextArea.module.scss'

interface ITextAreaProps {
  id?: string
  placeholder: string
  value: string
  name?: string
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void
  onInput?: (e: ChangeEvent<HTMLTextAreaElement>) => void
  required?: boolean
  ref?: Ref<HTMLTextAreaElement>
}

export const TextArea:FC<ITextAreaProps> = forwardRef((props, ref) => {
  return (
    <>
      <textarea { ...props } ref={ref}  className={s.textarea}></textarea>
    </>
  );
});
