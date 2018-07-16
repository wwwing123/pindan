const urlList = require("../../../config.js");
const Util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyid:null,
    Type:null,
    list:[],
    totalPrice:"0.00"
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
      url: `${urlList.foodcount2}?companyid=${this.data.companyid}&type=${this.data.Type}`,
      header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
      method: 'GET',
      success: (msg) => {
        if (msg.data.code == 1) {
          console.log(msg)
          let data = msg.data.data.datas,
            list = []
          for (let i in data) {
            list.push(data[i])
          }
          this.setData({
            list,
            totalPrice: msg.data.data.statistics
          })
        }else{
          Util.errorHandle(urlList.foodcount2, msg.data.code);
        }
      }
    })
  }




})