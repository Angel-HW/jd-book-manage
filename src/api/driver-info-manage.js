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
  // 查询表格数据
  getTableData: {
    url: '/pc/driver/listDrivers',
    method: 'post'
  },
  // 下拉框
  getArea: {
    url: '/pc/selectCombox/listArea',
    method: 'post'
  },
  // 详情
  getDriver: {
    url: '/pc/driver/getDriver',
    method: 'post'
  },
  // 修改
  updateDriver: {
    url: '/pc/driver/updateDriver',
    method: 'post'
  },
  // 删除
  deleteDriver: {
    url: '/pc/driver/deleteDriver',
    method: 'post'
  },
  // 新增
  addDriver: {
    url: '/pc/driver/addDriver',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
