import { validationResult } from 'express-validator';

const register = (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array())
  }

  res.json({
    success: true
  })
}
export default {
  register
}