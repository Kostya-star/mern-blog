import { Storage } from '@google-cloud/storage'
import dotenv from'dotenv'
dotenv.config();

const storage = new Storage({
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY
  },
  projectId: 'mern-blog-381912',
})

export default storage