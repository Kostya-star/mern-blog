import axios from 'axios'

export const instance = axios.create({
  baseURL: 'http://localhost:5000'
  // baseURL: process.env.REACT_APP_API_URL
  // baseURL: 'https://mern-blog99.herokuapp.com/' - obsolete & not used anymore
})

instance.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${window.localStorage.getItem('token')}`

  return config
})