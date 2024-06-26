// ------ 封装一个函数用于获取当前的时间，然后根据时间展示上午/下午/晚上 -------
export const getTime = () => {
  let message = ''
  // 通过内置的Date函数获取时间
  const hours = new Date().getHours()
  // 根据小时来展示上午/下午/晚上
  if (hours <= 9) message = '早上'
  else if (hours <= 14) message = '上午'
  else if (hours <= 18) message = '下午'
  else message = '晚上'

  return message
}
