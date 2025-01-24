import axios from 'axios'
import { addPending, removePending } from './pending.js'

const handleResponse = () => { }

const handleError = (res) => {
  if (!res) {
    return
  }
}

const instance = axios.create({
  baseURL: 'http://18.143.169.0:5000',
  timeout: 500000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  method: 'GET',
})

instance.interceptors.request.use(
  (config) => {
    removePending(config)
    addPending(config)
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

instance.interceptors.response.use(
  (response) => {
    // const data: GlobalRequest.Response<any> = response.data;
    removePending(response)
    handleResponse()
    return response
  },
  (err) => {
    handleError(err.response)
    return Promise.reject(err)
  }
)

async function request(config) {
  return instance.request(config).then((res) => {
    if (res.data?.ret === 1) {
      return res.data?.data
    } else {
      return Promise.reject(res.data)
    }
  })
}

export default request
