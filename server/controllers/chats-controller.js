import UserModel from "../models/user-model.js"

const getChatByUserName = async (req, res) => {
  try {
    const { userName } = req.params

    const users = await UserModel.find({ fullName: userName })

    res.json(users)
    console.log(users);

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Error when fetching the chats'
    })
  }
}


export default {
  getChatByUserName,
}