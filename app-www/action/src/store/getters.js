const getters = {

  token: state => state.user.token,
  person: state => state.user.person,

  isAdmin: state => state.user.isAdmin,
  initData: state => state.user.initData,

}
export default getters
