import { uploadImageGoogleCloud } from "../utils/uploadImageGoogleCloud.js";

const uploadFile = async (req, res) => {
  try {
    const file = req.file

    if(file.size > 10 * 1024 * 1024) {
      return res.status(400).json({
        message: "File can't be larger than 10MB"
      })
    }
    
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return res.status(400).json({
        message: 'Only images are allowed'
      })
    }
    if(!file) {
      return res.json({
        message: 'File is not found'
      })
    }

  const url = await uploadImageGoogleCloud(file)

  res.json({
    url
  })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error when uploading the file'
      // message: error.message
    })
  }
}

export default {
  uploadFile
}