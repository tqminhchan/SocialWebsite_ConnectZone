import axiosClient from './axiosClient'

const messageApi = {
  createMessage: (data = {}) => {
    return axiosClient.post('/message', data)
  },
  getMessageByChatId: (params) => {
    return axiosClient.get('/message', params)
  },
  uploadSingleFile: (data) => {
    return axiosClient.post('/message/upload-single-file', data)
  },
  deleteMessageById: (id) => {
    return axiosClient.delete(`/message/${id}`)
  },
}
export default messageApi
