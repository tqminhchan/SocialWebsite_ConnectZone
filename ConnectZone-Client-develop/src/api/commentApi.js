import axiosClient from './axiosClient'

const commentApi = {
  createComment: (data) => {
    return axiosClient.post('/comment/create-comment', data)
  },
  getCommentById: (id) => {
    return axiosClient.get(`/comment/get-comment-by-id/${id}`)
  },
  uploadMultimediaFiles: (formdata) => {
    return axiosClient.post('/comment/upload-media-files', formdata)
  },
  deleteComment: (id) => {
    return axiosClient.delete(`/comment/delete-comment/${id}`)
  },
}
export default commentApi
