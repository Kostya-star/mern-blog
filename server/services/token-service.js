import jwt from 'jsonwebtoken'

const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.SECRET_JWT, { expiresIn: '30d' })
  
  return token
}

export default {
  generateToken
}