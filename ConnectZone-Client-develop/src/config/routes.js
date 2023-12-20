const routes = {
  login: '/dang-nhap',
  register: '/dang-ki',
  home: '/',
  messenger: '/nhan-tin/:id',
  profile: '/profile/:id/*',
  forgotPassword: '/quen-mat-khau',
  showPost: '/photo/:id',
  detailPost: '/chi-tiet-bai-viet/:id',
  me: '/me',
  changePassword: '/me/doi-mat-khau',
  suggestFriends: 'ket-ban',
  listFriend: '/profile/:id/friends',
}

export default routes
