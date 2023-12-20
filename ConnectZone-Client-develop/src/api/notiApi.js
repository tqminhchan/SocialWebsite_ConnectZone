import axiosClient from './axiosClient'
const notiApi = {
  createNoti: () => {
    return axiosClient.post('/notification/create-noti')
  },
  getAllNotification: () => {
    return axiosClient.get('/notification')
  },
  readNotification: (params) => {
    return axiosClient.post('/notification/read-notification', params)
  },
}

export default notiApi
