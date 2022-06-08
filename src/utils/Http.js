import axios from 'axios'

const $axios = axios.create({
  baseURL: 'http://localhost:4000/'
})

export const getPosts1 = () => {
  return $axios.get('posts1')
}