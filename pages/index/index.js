//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    indexImage: '',
  },
  onLoad: function () {
    wx.request({
      url: 'http://123.207.56.139/api/get/ad/?',
      method:'get',
      success:(msg) => {
        this.setData({
          indexImage:'http://'+msg.data.data.img
        })
      }
    })
  },
})
