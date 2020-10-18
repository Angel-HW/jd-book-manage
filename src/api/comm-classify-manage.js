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
    url: '/pc/goodsClassify/listAllGoodsClassify',
    method: 'post'
  },
  // 新增
  addClassify: {
    url: '/pc/goodsClassify/addGoodsClassify',
    method: 'post'
  },
  // 获取详情
  getClassify: {
    url: '/pc/goodsClassify/getGoodsClassify',
    method: 'post'
  },
  // 修改
  updateClassify: {
    url: '/pc/goodsClassify/updateGoodsClassify',
    method: 'post'
  },
  // 删除
  deleteClassify: {
    url: '/pc/goodsClassify/deleteGoodsClassify',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
