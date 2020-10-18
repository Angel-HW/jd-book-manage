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
    url: '/pc/goods/listGoods',
    method: 'post'
  },
  // 新增商品
  addGoods: {
    url: '/pc/goods/addGoods',
    method: 'post'
  },
  // 获取商品详情
  getGoodsData: {
    url: '/pc/goods/getGoods',
    method: 'post'
  },
  // 修改商品
  updateGoods: {
    url: '/pc/goods/updateGoods',
    method: 'post'
  },
  // 上传图片
  uploadImg: {
    url: '/pc/imageUpload/uploadImage',
    method: 'post'
  },
  // 删除商品
  deleteGoods: {
    url: '/pc/goods/deleteGoods',
    method: 'post'
  },
  // 修改商品状态
  updateGoodsStateId: {
    url: '/pc/goods/updateGoodsShelfState',
    method: 'post'
  },
  // 下拉框接口
  commClassifyList: {
    url: '/pc/goods/listGoodsClassify',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
