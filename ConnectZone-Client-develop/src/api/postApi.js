import axiosClient from './axiosClient'

const postApi = {
  createPost: (data) => {
    return axiosClient.post('/post/create-post', data)
  },
  deletePost: (id) => {
    return axiosClient.delete(`/post/delete-post/${id}`)
  },
  deleteMultipleImages: (params) => {
    return axiosClient.delete('/post/delete-media-files', params)
  },
  deleteSingleFile: (postId, fileId) => {
    return axiosClient.delete(`/post/delete-single-file/${postId}/${fileId}`)
  },
  updateSinglePost: (postId, data) => {
    return axiosClient.put(`/post/update-a-post/${postId}`, data)
  },
  uploadMultipleImages: (formdata) => {
    return axiosClient.post('/post/upload-multiple-images', formdata)
  },
  uploadMultipleVideos: (formdata) => {
    return axiosClient.post('/post/upload-multiple-videos', formdata)
  },
  uploadMultimediaFiles: (formdata) => {
    return axiosClient.post('/post/upload-media-files', formdata)
  },
  getAllProfilePost: (params) => {
    return axiosClient.get(`/post/get-all-profile-posts`, params)
  },
  getFriendsPost: (params) => {
    return axiosClient.get('/post/get-friends-post', params)
  },
  getAPostById: (id) => {
    return axiosClient.get(`/post/get-a-post-by-id/${id}`)
  },
}
export default postApi
