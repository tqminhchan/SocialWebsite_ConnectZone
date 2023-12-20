import {format, render, cancel, register} from 'timeago.js'

const vi = (number, index, totalSec) => {
  return [
    ['vừa xong', 'một lúc'],
    ['vừa xong', 'một lúc'],
    ['1 phút trước', 'trong 1 phút'],
    ['%s phút trước', 'trong %s phút'],
    ['1 giờ trước', 'trong 1 giờ'],
    ['%s giờ trước', 'trong %s giờ'],
    ['1 ngày trước', 'trong 1 ngày'],
    ['%s ngày trước', 'trong %s ngày'],
    ['1 tuần trước', 'trong 1 tuần'],
    ['%s tuần trước', 'trong %s tuần'],
    ['1 tháng trước', 'trong 1 tháng'],
    ['%s tháng trước', 'trong %s tháng'],
    ['1 năm trước', 'trong 1 năm'],
    ['%s năm trước', 'trong %s năm'],
  ][index]
}
register('vi', vi)

export default vi
