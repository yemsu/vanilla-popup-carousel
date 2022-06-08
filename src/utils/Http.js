import axios from 'axios'

const $axios = axios.create({
  baseURL: 'http://localhost:4000/'
})

export const getPosts = (path) => {
  return $axios.get(path)
}