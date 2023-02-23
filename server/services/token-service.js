import jwt from 'jsonwebtoken'

const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.SECRET_JWT, { expiresIn: '30m' })
  
  return token
}

const checkIsValidToken = (token) => {
  const decodedToken = jwt.verify(token, process.env.SECRET_JWT)

  return decodedToken
}

export default {
  generateToken,
  checkIsValidToken
}