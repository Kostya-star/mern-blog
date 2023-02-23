import bcrypt from 'bcrypt';
import UserModel from '../models/user-model.js';
import tokenService from '../services/token-service.js';

const register = async (req, res) => {
  try {
    const { fullName, email, password, avatarUrl } = req.body

    const userDb = await UserModel.findOne({ email })
    if (userDb) {
      return res.status(400).json({
        message: 'This user already exists'
      })
    }

    const hashedPass = await bcrypt.hash(password, 5)

    const user = new UserModel({
      fullName,
      email,
      hashedPassword: hashedPass,
      avatarUrl
    })

    await user.save()

    const token = tokenService.generateToken({ _id: user._id })

    const { hashedPassword, ...userData } = user._doc

    res.json({
      ...userData,
      token
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error occured when registering'
    })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await UserModel.findOne({ email })
    if (!user) {
      return res.status(404).json({
        message: 'The user is not found'
      })
    }

    const isPassValid = await bcrypt.compare(password, user.hashedPassword)
    if (!isPassValid) {
      return res.status(400).json({
        message: 'Wrong login or password'
      })
    }

    const token = tokenService.generateToken({ _id: user._id })

    const { hashedPassword, ...userData } = user._doc

    res.json({
      ...userData,
      token
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error occured when logging in'
    })
  }
}

const getUser = async (req, res) => {
  try {
    const { userId } = req.body

    const user = await UserModel.findById(userId)

    if (!user) {
      return res.status(404).json({
        message: 'The user is not found'
      })
    }

    const { hashedPassword, ...userData } = user._doc

    res.json(userData)
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error occured when fetching a user'
    })
  }
}

export default {
  register,
  login,
  getUser
}