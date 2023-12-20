import React, {useContext} from 'react'
import {useParams} from 'react-router-dom'
import {AuthContext} from '../../contexts/AuthContext'
import OtherProfile from './components/OtherProfile'
import MyProfile from './components/MyProfile'

const Profile = () => {
  const {id} = useParams()
  const {user} = useContext(AuthContext)

  return <div>{user.id === id ? <MyProfile /> : <OtherProfile />}</div>
}

export default Profile
