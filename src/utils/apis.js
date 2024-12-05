import axios from 'axios';
// const md5 = require("md5");

const host = process.env.NODE_ENV === 'production' ? "" : `http://${process.env.REACT_APP_HOST}`;

// let errorCount = 0;

export const instance = axios.create({
  baseURL: `${host}/api`,
  timeout: 30000,
  headers: {
    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzMzMzc5ODA3LCJleHAiOjE3MzMzODM0MDd9.DOn0Eq90dvY04PGUrZ3ZFaq_zPT9Zqa7X_2yO9SNxUM"
  }
});

export const api = () => {
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
    getUserList: () => promise_(instance.get('/user/findAll')),
    postUser: ({ data }) => promise_(instance.post('/user/create', { ...data })),
    putUser: ({ data, ...rest }) => promise_(instance.put('/user/update', { ...data }, { params: { ...rest } })),
    deleteUser: ({ ...rest }) => promise_(instance.delete('/user/delete', { params: { ...rest } })),
  }
}