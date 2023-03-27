import util from 'util'
import gc from '../googleCloudConfig/index.js'
import { format } from 'url';

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
  // const blob = bucket.file(originalname.replace(/ /g, "_"))
  const blob = bucket.file(originalname)
  blob.de
  const blobStream = blob.createWriteStream({
    resumable: false
  })
  blobStream.on('finish', () => {
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    )
    resolve(publicUrl)
  })
  .on('error', () => {
    reject(`Unable to upload image, something went wrong`)
  })
  .end(buffer)
})