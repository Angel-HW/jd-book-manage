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
  getMenuTable: {
    url: '/pc/menu/listMenu',
    method: 'post'
  },
  // 获取详情
  getMenu: {
    url: '/pc/menu/getMenu',
    method: 'post'
  },
  // 新增
  addMenu: {
    url: '/pc/menu/addMenu',
    method: 'post'
  },
  // 修改
  updateMenu: {
    url: '/pc/menu/updateMenu',
    method: 'post'
  },
  // 删除
  deleteMenu: {
    url: '/pc/menu/deleteMenu',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
