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
  getHotGoods: {
    url: '/pc/hotGoods/listHotGoods',
    method: 'post'
  },
  // 查看展示数量
  getShow: {
    url: '/pc/hotGoods/getHotGoodsShowNum',
    method: 'post'
  },
  // 修改展示数量
  changeShow: {
    url: '/pc/hotGoods/updateHotGoodsShowNum',
    method: 'post'
  },
  // 新增
  addGoods: {
    url: '/pc/hotGoods/addHotGoods',
    method: 'post'
  },
  // 修改
  changeData: {
    url: '/pc/hotGoods/updateHotGoods',
    method: 'post'
  },
  // 获取商品详情
  getGoods: {
    url: '/pc/hotGoods/getHotGoods',
    method: 'post'
  },
  // 删除
  deleteGoods: {
    url: '/pc/hotGoods/deleteHotGoods',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
