//index.js
//获取应用实例
const app = getApp();
const urlList = require("../../config.js");
const Util = require("../../utils/util.js");

Page({
  data: {
    indexImage: '',
    notice:{}
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
    });

  },

  onReady: function () {
    //加入模态框组件
    this.Modal = this.selectComponent("#modal");
    wx.request({
      url: urlList.indexNotice,
      method: 'get',
      success: (msg) => {
        if (msg.data.code == 1) {
          const data = msg.data.data;
          if (data.title && data.content) {
            this.setData({
              notice: msg.data.data
            });
            this.Modal.showModal();
          }
        } else {
          Util.errorHandle(urlList.indexNotice, msg.data.code);
        }

      }
    })
  },
  hide(e){
    this.Modal.hideModal();
  }
})
