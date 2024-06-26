// 封装本地存储数据与读取数据的方法
export const SET_TOKEN = (token: string) => localStorage.setItem('TOKEN', token)
export const GET_TOKEN = () => localStorage.getItem('TOKEN')
