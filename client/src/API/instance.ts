import axios from 'axios'
import { baseUrl } from './baseUrl';

export const instance = axios.create({
  baseURL: baseUrl
})

instance.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${window.localStorage.getItem('token')}`

  return config
})