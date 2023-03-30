import util from 'util'
import gc from '../googleCloudConfig/index.js'
import { format } from 'url';
import { mongoose } from 'mongoose';

const bucket = gc.bucket('mern-blog') // should be your bucket name

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

export const uploadImageGoogleCloud = (file) => new Promise((resolve, reject) => {
  const { originalname, buffer } = file

  const imageId = new mongoose.Types.ObjectId()

  const blob = bucket.file(`ID::${imageId}::ID-${originalname}`)

  const blobStream = blob.createWriteStream({
    resumable: false
  })
  blobStream.on('finish', async () => {
    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`

    resolve(imageUrl)
  })
  .on('error', () => {
    reject(`Unable to upload image, something went wrong`)
  })
  .end(buffer)
})