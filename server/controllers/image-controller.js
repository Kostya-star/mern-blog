const uploadImage = (req, res) => {
  try {
    res.json({
      url: `/uploads/${req.file.originalname}`
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error when uploading the image'
    })
  }
}

export default {
  uploadImage
}