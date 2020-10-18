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
    url: '/pc/slideshowHome/listSlideshowHome',
    method: 'post'
  },
  // 修改状态
  updatePic: {
    url: '/pc/slideshowHome/updateSlideshowHomeState',
    method: 'post'
  },
  // 新增
  addPic: {
    url: '/pc/slideshowHome/addSlideshowHome',
    method: 'post'
  },
  // 查询商品数据
  getGoods: {
    url: '/pc/slideshowHome/listGoods',
    method: 'post'
  },
  // 删除
  deletePic: {
    url: '/pc/slideshowHome/deleteSlideshowHome',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
