import { Storage } from '@google-cloud/storage'
import dotenv from'dotenv'
import CommentsModel from '../models/comments-model.js'
import PostModel from '../models/post-model.js'
import UserModel from '../models/user-model.js'
dotenv.config()

const storage = new Storage({
  credentials: {
    // client_email: env_config.GOOGLE_CLOUD_CLIENT_EMAIL,
    // private_key: env_config.GOOGLE_CLOUD_PRIVATE_KEY
    // client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    // private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY
    client_email: "mern-blog@mern-blog-381912.iam.gserviceaccount.com",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDJLXjliSZR80Rk\n6W/QeNqiwcN/A1f4F0xPD2JxhkUURb5ZCuscxgBWN9oQn1yaR1eq16PkOoOqRWXP\nXSEvK3yLp/Q5q8h/lD60DiqOPizCfirwWmD7xf9Y51IHkoIX/X0KtUqh3ahYx930\nedOy2JjrT6oiERX34w3DwJu4T1ZUMAKQKE3QqaTLoRz6yukx51u/3ottgi6p9e0D\n01XGjQZ9h7EJBYHKMzucDFtUqgV9gkDGoMZRGR6jEf87NwOati4S4w8oLn6fGV14\ngnDc4GYMf63JGGOxYo7BKtQDAmKgGq3ZG6T81A1uRnjPeQn64g16PxUFdZhrZexB\n+vFMXdBhAgMBAAECggEAAgwQYLfRUfnOytmgd0mOX5P3SNuToj2uCM3gjdnzT1CY\nE7FxjTd6Cgvk7Yi6cJ5AQFJ+nM+VfsK4iuxnoQ0ig2HAjFMPpKXJUJlLrfVjEhvg\n/4pQZgR6AngItYT0VeFDfnu+o5nhClhRkBOlU6K6NYwIDciLfxGDxqpXEqWhnInT\nlmBTGuD3q7safykybEYBBZbsIHsF5gusQ8NyWDiu7z1rD/vLpkGU61xkcHXYhfXG\neqSOON0y1BFnKHf/Yt5IGMAHZtjnTXg/nbH3R0HdrHIIdVW8ULJWuyFJmXRRhcz5\n6PZON7eErD7+iULj9tXKainupwTfN7mTfP5DMizFQQKBgQD+0JomFtIHCRU6eeGx\nVaJ6kKd/P8SP4kpVzzV/K52Vbg0iiDlSaIZ1fHc6UJt3skjgDyRjPKSUwAgfs3wE\nGJo25ZHleQLNIX3ETjp41+BBilnGJAQAZRuocyBpoYSHoRTSovpXRjJUz335VM3d\n1d3Win6fBbSmyjKW5iiRWgcdwQKBgQDKHQGj9ovn8oubAGD5hjSSU454xrynqqwd\nhZrVcvUsACb98bso2xgjp5swDS4thBfCnLB7V8J1iw8ALDmGNidZ66Ffy0a3A3XT\nZlFmX6S3E6UcsK1nbj0ZQIm70TXjTLnO72YGI+nMxKSBYWKV7maHyJJJYmdqEq62\nClMBAX6aoQKBgQCdo6+5oKSOdbAMXRqi+rdp29PDhU+1M+mI7IfMBM+Yglzd4CiW\nMtP8GuQnz3Zeto0fED8SpZGr9KER+5fdcNr2209HB3YUMYP8zeieme7CnTSsv9s5\n41MZAyAqOSIkRiL7rJfzJho9HaBxf2Vct9Jlx4hOGNmJ1c02TW0LfwaoAQKBgQCe\nbqBzk/dVyeYvidt6nf4l2gPrnvYRhJNIzQtzWJrhc/kcxVnOC/jfMipPP3W8TjiF\n4GfjOAcCNxB6NTCeiWLNdQzZ17HGEptRLHqQglbPAEJEvCYh1uNkIRgWt0fDtshM\nc5MJKyvBzT+a/+jU2L1coRgzGEUyfBSiNHOebTp+IQKBgCfOp6xM5jTaULa0Z2dw\n+aRv+KA5xupML4S4w9tVkqAajoNIK/p7ueCNDVULO3qVcWhwEAgGYtGA7lNGdnBj\nLO5eQZvULL9bCiCDjHNc+/m5aus8PBeXop4TGHQnUnl9QcxsoF2V1wdx7kBaKzqp\nt1qnhf1Ay21WtMwTqhDUkkua\n-----END PRIVATE KEY-----\n"
  },
  projectId: 'mern-blog-381912'
})

export default storage

// CLEANUP FUNCTION TO CLEAN ORPHENED IMAGES ON THE GOOGLE CLOUD
async function cleanUpUnusedImages() {
  const bucketName = 'mern-blog';

  // Получаем список всех файлов в бакете
  const [files] = await storage.bucket(bucketName).getFiles();

  // Создаем массивы для хранения ссылок на изображения и имен файлов
  const imageUrls = [];
  const fileNames = [];

  // Проходимся по всем постам и комментариям в базе данных, собираем ссылки на изображения
  const postsImagesUrl = await PostModel.find().select('imageUrl');;
  const commentsImagesUrl = await CommentsModel.find().select('imageUrl');;
  const userAvatarsUrl = await UserModel.find().select('avatarUrl')
  
  postsImagesUrl.forEach(p => {
    imageUrls.push(p.imageUrl);
  });

  commentsImagesUrl.forEach(c => {
    imageUrls.push(c.imageUrl)
  });

  userAvatarsUrl.forEach(u => {
    imageUrls.push(u.avatarUrl)
  })

  // Проходимся по списку файлов в бакете, собираем имена файлов
  files.forEach(file => {
    fileNames.push(file.name);
  });

  // Находим все имена файлов, которые не соответствуют ссылкам на изображения в базе данных
  const unusedFiles = fileNames.filter(fileName => !imageUrls.includes(fileName));

  // console.log(fileNames);

  // Удаляем все неиспользуемые файлы с бакета
  // unusedFiles.forEach(async fileName => {
  //   const file = storage.bucket(bucketName).file(fileName);
  //   await file.delete();
  //   console.log(`Deleted file ${fileName}`);
  // });
}

// Вызываем функцию каждые 2 часа
// setInterval(cleanUpUnusedImages, 2 * 60 * 60 * 1000);

cleanUpUnusedImages()