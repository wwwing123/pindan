const urlList = require("../../../../config.js");
const Util = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyid:null,
    starttime:null,
    endtime:null,
    list:[],
    totalPrice:"0.00"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      companyid: options.companyid,
      starttime: options.starttime,
      endtime: options.endtime
    });
    this.getcustomcount();
  },
  getcustomcount: function () {
    wx.request({
      url: `${urlList.customcount}?companyid=${this.data.companyid}&starttime=${this.data.starttime}&endtime=${this.data.endtime}`,
      header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
      method: 'GET',
      success: (msg) => {
        if (msg.data.code == 1) {
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
          Util.errorHandle(urlList.customcount, msg.data.code);
        }
      }
    })
  }




})