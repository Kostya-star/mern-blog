import { body } from 'express-validator'

export const postValidator = [
  body('title', 'Title must be greater than 3 symbols').isLength({ min: 3 }).isString(),
  body('text', 'Text must be greater than 3 symbols').isLength({ min: 3 }).isString(),
  body('tags', 'Invalid tags format (array is needed)').optional(),
  body('imageUrl', 'Wrong image link').optional().isString(),
]