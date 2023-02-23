export const imageStorageCreator = (multer) => {
  const storage = multer.diskStorage({
    destination: (_, __, cb) => {
      cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
      cb(null, file.originalname)
    },
  })

  return {
    storage
  }
}