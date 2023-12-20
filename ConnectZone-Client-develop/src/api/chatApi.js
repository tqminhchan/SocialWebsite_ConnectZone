import axiosClient from './axiosClient'

const chatApi = {
  createChat: (data = {}) => {
    return axiosClient.post(`/chat`, data)
  },
  getAllChat: () => {
    return axiosClient.get('/chat')
  },
  getChatByChatId: (chatId) => {
    return axiosClient.get(`/chat/${chatId}`)
  },
  getChatByUserId: (params) => {
    return axiosClient.get('/chat/get-chat-by-userId', params)
  },
  createGroupChat: () => {
    return axiosClient.post(`/chat/createGroupChat`)
  },
  updateNameGroupChat: (groupChatId) => {
    return axiosClient.put(`/chat/updateNameGroupChat/${groupChatId}`)
  },
  removeUserFromGroup: () => {
    return axiosClient.post(`/chat/removeUserFromGroup`)
  },
  leaveGroupChat: () => {
    return axiosClient.post(`/chat/leaveGroupChat`)
  },
  addUsersToGroup: () => {
    return axiosClient.post(`/chat/addUsersToGroup`)
  },
}
export default chatApi
