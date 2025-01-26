const axios = require('axios');
const { addPending, removePending } = require('./pending.js')

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
  method: 'POST',
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
    if(res.status === 200) {
      return res.data
    } else {
      return res
    }
  })
}

module.exports = request
