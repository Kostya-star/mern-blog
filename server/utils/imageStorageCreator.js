import fs from 'fs'

export const imageStorageCreator = (multer) => {
  const storage = multer.diskStorage({
    destination: (_, __, cb) => {
      if(!fs.existsSync('uploads')) {
        fs.mkdirSync('uploads')
      }
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