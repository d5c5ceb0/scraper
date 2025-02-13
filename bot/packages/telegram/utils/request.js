const axios = require('axios');
const { addPending, removePending } = require('./pending.js')

const handleResponse = () => { }

const handleError = (res) => {
  if (!res) {
    return
  }
}

const instance = axios.create({
  baseURL: 'http://scraper:5000',
  timeout: 500000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  method: 'POST',
})

const instance2 = axios.create({
  baseURL: 'https://test.nftkash.xyz',
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
    if (res.status === 200) {
      return res.data
    } else {
      return res
    }
  })
}

async function request2(config) {
  return instance2.request(config).then((res) => {
    if (res.status === 200) {
      return res.data
    } else {
      return res
    }
  })
}

module.exports = {
  request,
  request2
}
