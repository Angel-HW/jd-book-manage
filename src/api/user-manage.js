import req from '../fetch/index.js'

const config = {
  // portExport: {
  //   url: '/api/media/stimulate/exportExcel',
  //   method: 'post',
  //   fileConfig: {
  //     type: 'file',
  //     fileName: '销售激励报表'
  //   }
  // },
  getTableData: {
    url: '/pc/user/listUsers',
    method: 'post'
  },
  addTableData: {
    url: '/pc/user/addUser',
    method: 'post'
  },
  getUserData: {
    url: '/pc/user/getUser',
    method: 'post'
  },
  updateTableData: {
    url: '/pc/user/updateUser',
    method: 'post'
  },
  deleteTableData: {
    url: '/pc/user/deleteUser',
    method: 'post'
  },
  uploadImg: {
    url: '/pc/image/uploadImage',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
