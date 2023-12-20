import React, { useState, useEffect } from 'react'
import { ClipLoader } from 'react-spinners'
import { AiOutlineArrowLeft, AiOutlineSearch } from 'react-icons/ai'
import HeadLess from '@tippyjs/react/headless'
import { Link } from 'react-router-dom'
import Avatar from '../Avatar/Avatar'
import userApi from '../../api/userApi'
import useDebouned from '../../hook/useDebouned'
import OutsideClickWrapper from '../OutsideClickWrapper'

const SearchMobile = ({ setShowInputMessage }) => {
  const [searchValue, setSearchValue] = useState('')
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const debouned = useDebouned(searchValue, 500)

  const handleChangeSearch = (e) => {
    const searchValue = e.target.value
    setSearchValue(searchValue)
    if (searchValue === '') {
      setUsers([])
    }
  }
  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setUsers([])
      return
    }
    setIsLoading(true)
    try {
      const res = await userApi.searchUser({ searchValue: debouned })
      setUsers(res?.data?.users)
    } catch (error) {
      setUsers([])
    }
    setIsLoading(false)
  }
  useEffect(() => {
    handleSearch()
  }, [debouned])

  const handleCloseSearch = () => {
    setShowInputMessage((prev) => !prev)
  }

  return (
    <OutsideClickWrapper onClickOutside={() => setShowResult(false)}>
      <div className="relative flex items-center justify-between px-4 py-3 bg-white w-full ">
        {/* the in put search */}
        <div className="flex items-center w-full">
          <span className="p-2 rounded-full cursor-pointer" onClick={handleCloseSearch}>
            <AiOutlineArrowLeft fontSize={24} />
          </span>
          <input
            type="text"
            className="outline-none ml-1.5 w-full text-lg bg-bgColor py-2 px-2.5 rounded-3xl"
            alt=""
            value={searchValue}
            onChange={(e) => handleChangeSearch(e)}
            onFocus={() => setShowResult(!showResult)}
            placeholder="Tìm kiếm người dùng"
          />
        </div>
        {/* ket qua search */}
        {showResult && (
          <div className={`absolute top-14 right-0 left-0 bg-white rounded-xl shadow-[0px_0px_3px_rgba(3,102,214,0.3)] p-2.5 w-full`} >
            {!isLoading &&
              users.length > 0 &&
              users.map((user) => (
                <Link
                  key={user?.id}
                  to={`/profile/${user?.id}`}
                  className="flex items-center p-2 cursor-pointer hover:bg-hoverSidebar rounded-xl"
                >
                  <Avatar user={user} alt="" className="w-12 h-12 mr-2.5" />
                  <span className="text-lg font-medium">{user.fullName}</span>
                </Link>
              ))}

            {isLoading && (
              <div className="flex items-center justify-center">
                <ClipLoader color="#36d7b7" />
              </div>
            )}

            {debouned && searchValue && !isLoading && users.length === 0 && (
              <div className="px-[18px]">
                <p>Không tìm thấy người dùng </p>
              </div>
            )}

            <div className="p-[18px] flex items-center text-primary rounded-xl hover:bg-hoverSidebar cursor-pointer ">
              <AiOutlineSearch className="mr-2" color="black" />
              <span className="mr-1 text-black">Tìm kiếm </span>
              {'  '}
              {searchValue}
            </div>
          </div>
        )}
      </div>
    </OutsideClickWrapper>
  )
}

export default SearchMobile
