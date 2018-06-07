const urlList = require("../../../config.js");
const Util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyid:null,
    Type:null,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      companyid: options.companyid,
      Type: options.type
    });
    this.getordercount();
  },
  getordercount: function () {
    wx.request({
      url: `${urlList.foodcount}?companyid=${this.data.companyid}&type=${this.data.Type}`,
      header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
      method: 'GET',
      success: (msg) => {
        if (msg.data.code == 1) {
          console.log(msg)
          let data = msg.data.data,
            list = []
          for (let i in data) {
            list.push(data[i])
          }
          this.setData({
            list
          })
        }else{
          Util.errorHandle(urlList.foodcount, msg.data.code);
        }
      }
    })
  }




})