// pages/user/admin/admin.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyid: null,
    company:null,
    level:null,
    authority:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      companyid: options.companyid,
      company: options.companyid,
      level: options.level,
      authority: options.authority,
      admin: app.globalData.userInformation.admin,
      ledger: app.globalData.userInformation.ledger,
    })
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
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  }
})