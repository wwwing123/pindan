// pages/user/user.js
const Util = require("../../utils/util.js");
const urlList = require("../../config.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInformation:{},
    adminOpen:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //填完个人信息时，返回个人中心页加载刚刚填写的信息
    if (!app.globalData.getuserInfo){
      this.setData({
        userInformation: wx.getStorageSync('userInformation')
      })
    }else{
      this.setData({
        userInformation: app.globalData.userInformation,
        adminOpen: app.globalData.userInformation.admin || app.globalData.userInformation.ledger
      })
    } 
    this.getbalance();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  onPullDownRefresh: function () {
  
  },

  getbalance:function(){
    wx.request({
      url: urlList.getbalance,
      header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
      method: 'GET',
      success: (msg) => {
        if (msg.data.code == 1) {
          let userInformation = this.data.userInformation;
          userInformation.balance = msg.data.data.balancce;
          app.globalData.userInformation.balance = userInformation.balance
          this.setData({
            userInformation
          })
        }else{
          Util.errorHandle(urlList.getbalance, msg.data.code);
        }
      }
    });
  }
})