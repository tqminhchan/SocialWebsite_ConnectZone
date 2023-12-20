import React, { useContext, useState, useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import BackgroundMyProfile from '../Profile/components/BackgroundMyProfile'
import BackgroundOtherProfile from '../Profile/components/BackgroundOtherProfile'
import { AuthContext } from '../../contexts/AuthContext'
import userApi from '../../api/userApi'
import Search from '../../components/Search/Search'
import { AiOutlineSearch } from 'react-icons/ai'
import Avatar from '../../components/Avatar/Avatar'
import Button from '../../components/Button/Button'
import Tippy from '@tippyjs/react/headless'
import useDebouned from '../../hook/useDebouned'

const ListFriend = () => {
  const params = useParams()
  const { user } = useContext(AuthContext)
  const [currentUser, setCurrentUser] = useState({})
  const [listFriend, setListFriend] = useState([])
  const [currentUserIdHover, setCurrentUserIdHover] = useState('')
  const [isLoadingCalculateMutualFriends, setIsLoadingCalculateMutualFriends] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [friendsSearch, setFriendsSearch] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const debouned = useDebouned(searchValue, 500)
  const fetchUser = async () => {
    const res = await userApi.getUser(params?.id)
    setCurrentUser(res?.data?.user)
  }
  const fetchListFriend = async () => {
    const res = await userApi.getAllListFriend({
      params: {
        userId: params?.id
      }
    })
    console.log(res)
    setListFriend(res?.data?.users)
  }
  useEffect(() => {
    fetchUser()
    fetchListFriend()
  }, [params?.id])

  const myMutualFriends = useMemo(() => {
    if (!currentUser.friends) {
      return []
    }
    if (currentUser.id === user.id) {
      return []
    }
    const mutualFriends = []
    if (currentUser && user) {
      for (const myFriend of user.friends) {
        for (const yourFriend of currentUser?.friends) {
          if (myFriend.id === yourFriend.id) {
            mutualFriends.push(myFriend)
          }
        }
      }
    }

    return mutualFriends
  }, [currentUser])

  const mutualFriends = useMemo(() => {
    setIsLoadingCalculateMutualFriends(true)
    const newMutualFriends = []
    if (currentUser.friends) {
      const currentFriend = currentUser.friends.find((friend) => friend.id === currentUserIdHover)
      if (currentFriend) {
        for (const userIdFriend of currentFriend.friends) {
          for (const myFriend of currentUser.friends) {
            if (userIdFriend === myFriend.id) {
              newMutualFriends.push(myFriend)
            }
          }
        }
      }
    }
    setIsLoadingCalculateMutualFriends(false)
    return newMutualFriends
  }, [currentUserIdHover, currentUser])

  const handleChangeSearch = (e) => {
    const searchValue = e.target.value
    setSearchValue(searchValue)
    if (searchValue === '') {
      setFriendsSearch([])
    }
  }
  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    if (!searchValue.trim()) {
      setFriendsSearch([])
      return
    }
    try {
      const res = await userApi.searchListFriend({ searchValue: debouned, userId: params?.id })
      console.log(res)
      setFriendsSearch(res?.data?.users)
    } catch (error) {
      setUsers([])
    }
    setIsLoading(false)
  }
  useEffect(() => {
    handleSearch()
  }, [debouned])


  return (
    <div className="flex justify-center flex-col w-full tablet:w-3/5 mx-auto overflow-auto">
      <div>{user?.id === params?.id ? <BackgroundMyProfile /> : <BackgroundOtherProfile currentUser={currentUser} />}</div>
      <div className="p-5 border border-borderColor rounded-2xl bg-white">
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <b className="text-2xl">Bạn bè</b>
            <form onSubmit={(e) => handleSearch(e)} className="flex items-center bg-bgColor px-3 py-1.5 rounded-3xl">
              <AiOutlineSearch fontSize={20} />
              <input
                placeholder="Tìm kiếm"
                className="outline-none px-2 py-1.5 bg-bgColor"
                type="text"
                value={searchValue}
                onChange={(e) => handleChangeSearch(e)}
              />
              <input type="submit" className='hidden' />
              <Button className='text-black px-3 py-1.5 rounded-xl hover:bg-hoverColor'>Tìm</Button>
            </form>
          </div>
          {friendsSearch.length > 0 ? (
            isLoading ? (
              <ClipLoader />
            ) : (
              <div className="grid grid-cols-2 gap-5 mt-10">
                {friendsSearch.length > 0 && friendsSearch.map((item, index) => (
                  <div key={item?.id} className="flex items-center px-5 py-7 border border-borderColor rounded-2xl ">
                    <img className="w-24 h-24 rounded-md object-cover cursor-pointer" src={item?.avatar?.url} />
                    <div>
                      <Link to={`/profile/${item?.id}`}>
                        <h1 className="text-xl font-semibold ml-5 cursor-pointer hover:underline">{item?.fullName}</h1>
                      </Link>

                    </div>

                  </div>
                ))}
              </div>
            )
          ) : (
            <>
              <div className="grid grid-cols-2 gap-5 mt-10">
                {listFriend.length > 0 && listFriend.map((item, index) => (
                  <div key={item?.id} className="flex items-center px-5 py-7 border border-borderColor rounded-2xl ">
                    <img className="w-24 h-24 rounded-md object-cover cursor-pointer" src={item?.avatar?.url} />
                    <Link to={`/profile/${item?.id}`}>
                      <h1 className="text-xl font-semibold ml-5 cursor-pointer hover:underline">{item?.fullName}</h1>
                    </Link>
                    {item?.id !== user?.id && myMutualFriends && myMutualFriends.length > 0 && (
                      <p className="ml-1.5">
                        {'('} {myMutualFriends.length} Bạn chung {')'}
                      </p>
                    )}
                  </div>
                ))}
              </div>

            </>
          )}



        </div>
      </div>
    </div>
  )
}

export default ListFriend