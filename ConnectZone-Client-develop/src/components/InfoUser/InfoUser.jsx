import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AiTwotoneHome, AiTwotoneHeart, AiOutlineClose } from 'react-icons/ai'
import { MdLocationOn, MdRssFeed } from 'react-icons/md'
import { FaUserAlt } from 'react-icons/fa'
import { BsGlobeAmericas, BsClockFill } from 'react-icons/bs'
import { BiWorld } from 'react-icons/bi'
import Button from '../Button/Button'
import { AuthContext } from '../../contexts/AuthContext'
import MyModal from '../MyModal/MyModal'
import Image from '../Image/Image'
import bgHobby from '../../assets/imgs/bgHobby.png'
import hobbyApi from '../../api/hobbyApi'
const InfoUser = ({ currentUser }) => {
  const [bio, setBio] = useState()
  const [isOpenModalAddHobbies, setIsOpenModalAddHobbies] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [listHobbies, setListHobbies] = useState([])
  const [listHobbyChoosen, setListHobbyChoosen] = useState([])
  const [hobbyUser, setHobbyUser] = useState([])
  const { user } = useContext(AuthContext)
  const params = useParams()
  const handleAddBio = () => {
    setShowMenu((prev) => !prev)
  }
  const handleAddHobbies = () => {
    setIsOpenModalAddHobbies((prev) => !prev)
  }
  const handleCloseModalAddHobbies = () => {
    setIsOpenModalAddHobbies((prev) => !prev)
  }
  const fetchAllHobby = async () => {
    const res = await hobbyApi.getAllHobby()
    setListHobbies(res?.data?.hobbies)
  }
  const handleAddBobby = (hId) => {
    if (!listHobbyChoosen.includes(hId)) {
      setListHobbyChoosen((prev) => [...prev, hId])
    } else {
      const newIsChoose = listHobbyChoosen.filter((item) => item !== hId)
      setListHobbyChoosen(newIsChoose)
    }
  }
  const fetchHobbyUser = async () => {
    const res = await hobbyApi.getHobbiesUser({
      params: {
        userId: params.id,
      },
    })
    setHobbyUser(res?.data?.listHobby)
  }
  const handleSaveMyHobbies = async () => {
    const res = await hobbyApi.updateHobbiesUser(listHobbyChoosen)
    setHobbyUser(res?.data?.hobbies)
    setIsOpenModalAddHobbies((prev) => !prev)
  }
  useEffect(() => {
    fetchAllHobby()
    fetchHobbyUser()
  }, [])
  const date = new Date(currentUser.createdAt)
  return (
    <div className="flex flex-col px-5 py-5 bg-white border rounded-none tablet:rounded-2xl border-borderColor">
      <strong className="text-[26px] font-semibold ">Giới thiệu</strong>

      {showMenu ? (
        <div className="mt-5">
          <label>
            <textarea
              className="outline-none border-[1px] border-primary text-lg w-full rounded-lg
               text-center  px-4 py-2"
              rows="4"
              cols="50"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            >
              {user?.user?.bio}
            </textarea>
          </label>
          <div className="text-right">
            <span className="text-base text-hoverBlueLighter">Tối thiểu 87 kí tự</span>
          </div>
          <div className="flex items-center justify-between py-2 mt-2">
            <div className="flex items-center text-lg">
              <BiWorld fontSize={23} />
              <span className="py-2 ml-2 font-medium">Công khai</span>
            </div>
            <div className="flex mt-2 text-lg">
              <Button
                onClick={() => {
                  setShowMenu((prev) => !prev)
                }}
                className="font-medium text-black rounded-lg bg-borderColor"
              >
                Huỷ
              </Button>
              <Button className="bg-borderColor text-black font-medium rounded-lg ml-2.5">Lưu</Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center">
            <span className="pt-1 text-lg font-normal text-center">{user?.user?.bio}</span>
            {currentUser?.id === user?.id && (
              <Button
                className="justify-center w-full mt-3 text-lg font-semibold text-black rounded-lg bg-borderColor "
                onClick={handleAddBio}
              >
                Thêm tiểu sử
              </Button>
            )}
          </div>
        </>
      )}

      <ul className="mt-5">
        <li className="flex items-center px-4 mt-2">
          <FaUserAlt className="" fontSize={23} />
          <span className="ml-3 text-lg font-normal">
            Giới tính: {currentUser?.gender === 'male' ? 'Nam' : currentUser?.gender === 'female' ? 'Nữ' : 'Khác'}
          </span>
        </li>
        {/* <li className="flex items-center px-4 mt-2">
          <MdLocationOn className="" fontSize={23} />
          <span className="ml-3 text-lg font-normal">Đến từ: Hà Nội</span>
        </li> */}

        <li className="flex items-center px-4 mt-2">
          <BsClockFill className="" fontSize={23} />
          <span className="ml-3 text-lg font-normal">
            Tham gia từ tháng {date.getMonth() + 1} năm {date.getFullYear()}
          </span>
        </li>
        <li className="flex px-4 mt-2">
          {hobbyUser.map((item) => (
            <div key={item?.id} className="mr-3 px-3 py-1.5 m-1.5 rounded-3xl border border-borderColor">
              {item?.content}
            </div>
          ))}
        </li>
      </ul>

      {currentUser?.id === user?.id && (
        <div>
          <Button
            className="justify-center w-full mt-3 text-lg font-semibold text-black rounded-lg bg-borderColor "
            onClick={handleAddHobbies}
          >
            Thêm sở thích
          </Button>
        </div>
      )}

      <MyModal isOpen={isOpenModalAddHobbies} handleClose={handleCloseModalAddHobbies}>
        <div className="relative w-[700px]">
          <div className="">
            <Image src={bgHobby} className="w-full border-0 rounded-none" />
          </div>
          <div className="flex flex-col items-center pb-6 mt-3 mb-6 border-b border-borderColor">
            <h1 className="text-2xl font-medium">Thêm sở thích</h1>
            <p className="text-lg">Bạn thích làm gì? Hãy chọn các sở thích phổ biến dưới đây nhé.</p>
          </div>
          <div className="mb-4">
            <span>Sở thích được đề xuất</span>
            <ul className="flex flex-wrap justify-center">
              {listHobbies &&
                listHobbies.length > 0 &&
                listHobbies.map((item) => (
                  <li
                    key={item?.id}
                    className={`px-3 py-1.5 m-1.5 rounded-3xl border ${listHobbyChoosen.includes(item?._id) ? 'border-primary' : 'border-borderColor'
                      }  cursor-pointer hover:bg-hoverColor`}
                    onClick={() => handleAddBobby(item?._id)}
                  >
                    {item?.content}
                  </li>
                ))}
            </ul>
          </div>
          <div className="flex items-center justify-between mt-7 pb-7">
            <div className="flex items-center">
              <span className="mr-3">
                <BsGlobeAmericas />
              </span>
              <p>Sở thích hiển thị công khai</p>
            </div>
            {listHobbyChoosen.length > 0 && (
              <div className="flex items-center ">
                <Button
                  className="text-black bg-borderColor rounded-xl"
                  onClick={() => {
                    setListHobbyChoosen([])
                  }}
                >
                  Huỷ
                </Button>
                <Button className="ml-3 bg-primary rounded-xl" onClick={handleSaveMyHobbies}>
                  Lưu
                </Button>
              </div>
            )}
          </div>
          <div className="absolute top-5 right-5">
            <span
              onClick={handleCloseModalAddHobbies}
              className="flex items-center justify-center p-3 rounded-full cursor-pointer hover:bg-hoverColor bg-bgColor"
            >
              <AiOutlineClose />
            </span>
          </div>
        </div>
      </MyModal>
    </div>
  )
}

export default InfoUser
