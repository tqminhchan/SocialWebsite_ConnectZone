import axiosClient from './axiosClient'
const hobbyApi = {
  getAllHobby: () => {
    return axiosClient.get('/hobby/get-all-hobby')
  },
  updateHobbiesUser: (listHobbyId) => {
    return axiosClient.put(`/hobby/update-hobbies-user`, listHobbyId)
  },
  getHobbiesUser: (params) => {
    return axiosClient.get(`/hobby/get-hobby-user`, params)
  },
}

export default hobbyApi
