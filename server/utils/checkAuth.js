import tokenService from '../services/token-service.js'
import jwt from 'jsonwebtoken'

export const checkAuth = async (req, res, next) => {
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

// export const checkAuth = (req, res, next) => {
//   const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
//   if (token) {
//     try {
//       const decoded = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2Y3NTFjNzJlZjkzNzFjMThlYmFlYmQiLCJpYXQiOjE2NzczNjIyMjMsImV4cCI6MTY3NzM2NDAyM30.Hs1Yn08OgZbpD0ArIgDgRZtZQIVjY6Meg0XKeiMxk4I', process.env.SECRET_JWT);
      
//       console.log(decoded);
//       req.userId = decoded._id;
//       next();
//     } catch (e) {
//       return res.status(403).json({
//         message: 'Нет доступа',
//       });
//     }
//   } else {
//     return res.status(403).json({
//       message: 'Нет доступа',
//     });
//   }
// };