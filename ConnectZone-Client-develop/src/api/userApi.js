import axiosClient from './axiosClient'

const userApi = {
  getUser: (id) => {
    return axiosClient.get(`/user/${id}`)
  },
  updateUser: (data) => {
    return axiosClient.put(`/user`, data)
  },
  changePassword: (data) => {
    return axiosClient.put(`/user/change-password`, data)
  },
  updateAvatar: (data) => {
    return axiosClient.put(`/user/update-avatar`, data)
  },
  updateBackground: (data) => {
    return axiosClient.put(`/user/update-background`, data)
  },
  searchUser: (searchValue) => {
    return axiosClient.post('/user/search', searchValue)
  },
  searchListFriend: (data) => {
    return axiosClient.post('/user/search-list-friend', data)
  },
  sendFriendRequest: (data) => {
    return axiosClient.post('/user/send-friend-request', data)
  },
  cancelFriendRequest: (data) => {
    return axiosClient.post('/user/cancel-friend-request', data)
  },
  sendFriendAccept: (data) => {
    return axiosClient.post('/user/send-friend-accept', data)
  },
  deleteFriend: (data) => {
    return axiosClient.post('/user/delete-friend', data)
  },
  getListFriendSuggestion: (params) => {
    return axiosClient.get('/user/list-friend-suggestion', params)
  },
  getAllListFriend: (params) => {
    return axiosClient.get('/user/list-friend', params)
  },
  readAllNotifications: () => {
    return axiosClient.post('/user/read-all-notifications')
  },
}
export default userApi
