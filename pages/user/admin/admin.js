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
      level: options.level, //菜单管理员：1查看所有单位 2：指定单位 3：普通用户
      authority: options.authority,
      admin: app.globalData.userInformation.admin,
      rechargeLevel: app.globalData.userInformation.rechargeLevel, //充扣管理员：1：所有单位 2：指定单位 3：普通用户
      ledger: app.globalData.userInformation.ledger, //总账管理员：false：无权查看 true：可以查看单位总账
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