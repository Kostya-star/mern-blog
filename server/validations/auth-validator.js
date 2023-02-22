import { body } from 'express-validator'

export const registerValidator = [
  body('fullName', 'User name must be greater than 2 symbols').isLength({ min: 2 }),
  body('email', 'Invalid email format').isEmail(),
  body('password', 'Password must be greater than 5 symbols').isLength({ min: 5 }),
  body('avatarUrl', 'Wrong avatar link').optional().isURL(),
]