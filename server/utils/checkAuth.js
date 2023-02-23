import tokenService from '../services/token-service.js'

export const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]

    if (!token) {
      throw Error
    }

    const decodedToken = tokenService.checkIsValidToken(token)

    if (!decodedToken) {
      throw Error
    }

    req.body.userId = decodedToken._id
    next()
  } catch (error) {
    res.status(401).json({
      message: 'Unauthorized'
    })
  }
}