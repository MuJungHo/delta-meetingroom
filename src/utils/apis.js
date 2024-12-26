import axios from 'axios';
// const md5 = require("md5");

const host = process.env.NODE_ENV === 'production' ? "" : `http://${process.env.REACT_APP_HOST}`;

// let errorCount = 0;

export const instance = axios.create({
  baseURL: `${host}/api`,
  timeout: 30000,
  // headers: {
  //   "Authorization": localStorage.getItem("token") || undefined
  // }
});

const token = localStorage.getItem("token");

if (token) instance.defaults.headers.common['Authorization'] = token;

const _api = () => {
  const promise_ = (instance_) => {
    return new Promise((response, reject) => {
      instance_
        .then((res) => {
          response(res.data);
        })
        .catch((error) => {
          reject(error);
        })
    })
  }
  return {
    postAuthLogin: ({ data }) => promise_(instance.post('/auth/login', { ...data })),
    
    getUserList: ({ ...rest }) => promise_(instance.get('/user/list', { params: { ...rest } })),
    postCreateUser: ({ data }) => promise_(instance.post('/user/create', { ...data })),
    putUpdateUser: ({ data, ...rest }) => promise_(instance.put('/user/update', { ...data }, { params: { ...rest } })),
    deleteUser: ({ ...rest }) => promise_(instance.delete('/user/delete', { params: { ...rest } })),

    getRoomList: ({ ...rest }) => promise_(instance.get('/room/list', { params: { ...rest } })),
    postCreateRoom: ({ data }) => promise_(instance.post('/room/create', { ...data })),
    putUpdateRoom: ({ data, ...rest }) => promise_(instance.put('/room/update', { ...data }, { params: { ...rest } })),
    deleteRoom: ({ ...rest }) => promise_(instance.delete('/room/delete', { params: { ...rest } })),

    getBookingList: ({ ...rest }) => promise_(instance.get('/booking/list', { params: { ...rest } })),
    postCreateBooking: ({ data }) => promise_(instance.post('/booking/create', { ...data })),
    putUpdateBooking: ({ data, ...rest }) => promise_(instance.put('/booking/update', { ...data }, { params: { ...rest } })),
    deleteBooking: ({ ...rest }) => promise_(instance.delete('/booking/delete', { params: { ...rest } })),
  }
}

export const api = _api()