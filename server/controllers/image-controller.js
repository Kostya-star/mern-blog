import { uploadImageGoogleCloud } from "../utils/uploadImageGoogleCloud.js";

const uploadFile = async (req, res) => {
  try {
    const file = req.file

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
    })
  }
}

export default {
  uploadFile
}