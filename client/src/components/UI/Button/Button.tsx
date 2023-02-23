import {  CSSProperties, FC } from "react"
// import s from './Button.module.scss'

interface IButtonProps {
  text: string
  className: string
  style?: CSSProperties
}

export const Button: FC<IButtonProps> = ({ text, ...props }) => {
  return (
    <button {...props}>{text}</button>
  )
}
