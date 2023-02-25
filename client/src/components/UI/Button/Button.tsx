import {  CSSProperties, FC, MouseEvent } from "react"
// import s from './Button.module.scss'

interface IButtonProps {
  text: string
  className: string
  style?: CSSProperties
  disabled?: boolean
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
}

export const Button: FC<IButtonProps> = ({ text, ...props }) => {
  return (
    <button {...props}>{text}</button>
  )
}
