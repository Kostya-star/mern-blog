import { Storage } from '@google-cloud/storage'
// import keys from './keys.json' assert { type: "json" };
import dotenv from'dotenv'
dotenv.config()

const storage = new Storage({
  credentials: {
    // client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    // private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY
    // client_email: keys.client_email,
    // private_key: keys.private_key
    client_email: "mern-blog@mern-blog-381912.iam.gserviceaccount.com",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDJLXjliSZR80Rk\n6W/QeNqiwcN/A1f4F0xPD2JxhkUURb5ZCuscxgBWN9oQn1yaR1eq16PkOoOqRWXP\nXSEvK3yLp/Q5q8h/lD60DiqOPizCfirwWmD7xf9Y51IHkoIX/X0KtUqh3ahYx930\nedOy2JjrT6oiERX34w3DwJu4T1ZUMAKQKE3QqaTLoRz6yukx51u/3ottgi6p9e0D\n01XGjQZ9h7EJBYHKMzucDFtUqgV9gkDGoMZRGR6jEf87NwOati4S4w8oLn6fGV14\ngnDc4GYMf63JGGOxYo7BKtQDAmKgGq3ZG6T81A1uRnjPeQn64g16PxUFdZhrZexB\n+vFMXdBhAgMBAAECggEAAgwQYLfRUfnOytmgd0mOX5P3SNuToj2uCM3gjdnzT1CY\nE7FxjTd6Cgvk7Yi6cJ5AQFJ+nM+VfsK4iuxnoQ0ig2HAjFMPpKXJUJlLrfVjEhvg\n/4pQZgR6AngItYT0VeFDfnu+o5nhClhRkBOlU6K6NYwIDciLfxGDxqpXEqWhnInT\nlmBTGuD3q7safykybEYBBZbsIHsF5gusQ8NyWDiu7z1rD/vLpkGU61xkcHXYhfXG\neqSOON0y1BFnKHf/Yt5IGMAHZtjnTXg/nbH3R0HdrHIIdVW8ULJWuyFJmXRRhcz5\n6PZON7eErD7+iULj9tXKainupwTfN7mTfP5DMizFQQKBgQD+0JomFtIHCRU6eeGx\nVaJ6kKd/P8SP4kpVzzV/K52Vbg0iiDlSaIZ1fHc6UJt3skjgDyRjPKSUwAgfs3wE\nGJo25ZHleQLNIX3ETjp41+BBilnGJAQAZRuocyBpoYSHoRTSovpXRjJUz335VM3d\n1d3Win6fBbSmyjKW5iiRWgcdwQKBgQDKHQGj9ovn8oubAGD5hjSSU454xrynqqwd\nhZrVcvUsACb98bso2xgjp5swDS4thBfCnLB7V8J1iw8ALDmGNidZ66Ffy0a3A3XT\nZlFmX6S3E6UcsK1nbj0ZQIm70TXjTLnO72YGI+nMxKSBYWKV7maHyJJJYmdqEq62\nClMBAX6aoQKBgQCdo6+5oKSOdbAMXRqi+rdp29PDhU+1M+mI7IfMBM+Yglzd4CiW\nMtP8GuQnz3Zeto0fED8SpZGr9KER+5fdcNr2209HB3YUMYP8zeieme7CnTSsv9s5\n41MZAyAqOSIkRiL7rJfzJho9HaBxf2Vct9Jlx4hOGNmJ1c02TW0LfwaoAQKBgQCe\nbqBzk/dVyeYvidt6nf4l2gPrnvYRhJNIzQtzWJrhc/kcxVnOC/jfMipPP3W8TjiF\n4GfjOAcCNxB6NTCeiWLNdQzZ17HGEptRLHqQglbPAEJEvCYh1uNkIRgWt0fDtshM\nc5MJKyvBzT+a/+jU2L1coRgzGEUyfBSiNHOebTp+IQKBgCfOp6xM5jTaULa0Z2dw\n+aRv+KA5xupML4S4w9tVkqAajoNIK/p7ueCNDVULO3qVcWhwEAgGYtGA7lNGdnBj\nLO5eQZvULL9bCiCDjHNc+/m5aus8PBeXop4TGHQnUnl9QcxsoF2V1wdx7kBaKzqp\nt1qnhf1Ay21WtMwTqhDUkkua\n-----END PRIVATE KEY-----\n"
  },
  projectId: 'mern-blog-381912'
})

export default storage