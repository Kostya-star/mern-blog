import fs from 'fs'

export const getBase64 = (image) => {
  const buffer = {
    data: fs.readFileSync(image.path),
    contentType: image.mimetype
  }
  const base64Image = Buffer.from(buffer.data).toString('base64');
  const imageUrl = `data:${buffer.contentType};base64,${base64Image}`;

  return imageUrl
}