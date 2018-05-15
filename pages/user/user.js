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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取个人信息中心
    this.getUserinfo();
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
    if (app.globalData.getuserInfo) {
      this.getUserinfo();
    }
    this.getbalance();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getUserinfo:function(){
    wx.request({
      url: urlList.getuserinfo,
      header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
      method: 'GET',
      success: (msg) => {
        if (msg.data.code == 1) {          
          const data = msg.data.data;
          let userInformation = {
            name: data.name,
            idcard: data.idcard,
            company: data.company,
            address: data.address,
            phone: data.phone,
            balance: data.balance,
            companyid: data.companyid,
            authority: data.authority,
            level: data.level,
            admin: data.level != 3 ? true : false
          }
          this.setData({
            userInformation,
          })
          console.log(this.data.userInformation.level==3)
        }else{
          Util.errorHandle(urlList.getuserinfo, msg.data.code);
        }
      }
    });
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