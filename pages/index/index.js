//index.js
//获取应用实例
const app = getApp();
const urlList = require("../../config.js");
const Util = require("../../utils/util.js");

Page({
  data: {
    indexImage: '',
  },
  onLoad: function () {
    wx.request({
      url: urlList.indexImg,
      method:'get',
      success:(msg) => {
        if (msg.data.code == 1){
          this.setData({
            indexImage: msg.data.data.img
          })
        }else{
          Util.errorHandle(urlList.indexImg, msg.data.code);
        }
        
      }
    })

  },
})
