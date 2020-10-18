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
  // 分页表格
  getTableData: {
    url: '/pc/store/listStores',
    method: 'post'
  },
  // 获取详情
  getStore: {
    url: '/pc/store/getStore',
    method: 'post'
  },
  // 修改
  updateStore: {
    url: '/pc/store/updateStore',
    method: 'post'
  },
  // 下拉框获取
  getListArea: {
    url: '/pc/selectCombox/listArea',
    method: 'post'
  },
  // 新增
  addStore: {
    url: '/pc/store/addStore',
    method: 'post'
  },
  // 删除
  deleteStore: {
    url: '/pc/store/deleteStore',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
