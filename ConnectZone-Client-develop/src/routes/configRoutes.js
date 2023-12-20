import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import Home from '../pages/Home/Home'
import SuggestFriends from '../pages/SuggestFriends/SuggestFriends'
import Messenger from '../pages/Messenger/Messenger'
import Profile from '../pages/Profile/Profile'
import ListFriend from '../pages/ListFriend/ListFriend'
import ShowPost from '../pages/ShowPost/ShowPost'
import DetailPost from '../pages/DetailPost/DetailPost'
import AuthLayout from '../layouts/AuthLayout/AuthLayout'
import MainLayout from '../layouts/MainLayout/MainLayout'
import SliderLayout from '../layouts/SliderLayout/SliderLayout'
import MessengerLayout from '../layouts/MessengerLayout/MessengerLayout'
import NoSidebar from '../layouts/NoSidebar/NoSidebar'
import config from '../config'
import MyInfo from '../pages/MyInfo'
import ChangePassword from '../pages/ChangePassword'

const routes = [
  {path: config.routes.login, component: Login, layout: AuthLayout, protected: false},
  {path: config.routes.register, component: Register, layout: AuthLayout, protected: false},

  {path: config.routes.home, component: Home, layout: MainLayout, protected: true},
  {path: config.routes.messenger, component: Messenger, layout: MessengerLayout, protected: true},

  {path: config.routes.profile, component: Profile, layout: NoSidebar, protected: true},
  {path: config.routes.listFriend, component: ListFriend, layout: NoSidebar, protected: true},

  {path: config.routes.suggestFriends, component: SuggestFriends, layout: NoSidebar, protected: true},

  {path: config.routes.me, component: MyInfo, layout: MainLayout, protected: true},
  {path: config.routes.changePassword, component: ChangePassword, layout: MainLayout, protected: true},

  {path: config.routes.showPost, component: ShowPost, layout: SliderLayout, protected: true},
  {path: config.routes.detailPost, component: DetailPost, layout: NoSidebar, protected: true},
]
export default routes
