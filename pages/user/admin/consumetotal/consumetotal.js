const urlList = require("../../../../config.js");
const Util = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authority: null,//权限 
    level: null,//等级
    companyid:'',
    userid:'',
    data: {},
    date:'',
    year:'',
    month:'',
    windowHeight:0,
    name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHeight();
    this.dateInit();
    this.setData({
      companyid: options.companyid,
      userid: options.userid,
      name: options.name
    });
    if (this.data.companyid) {
      this.getCompanyBill();
    } else {
      this.getUserBill();
    }
    wx.setNavigationBarTitle({
      title: options.title
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  dateInit: function(){
    const nowDate = new Date();
    const month = (nowDate.getMonth() + 1) < 10 ? '0' + (nowDate.getMonth() + 1) : '' + (nowDate.getMonth() + 1);
    this.setData({
      date: `${nowDate.getFullYear()}-${month}`,
      year: nowDate.getFullYear(),
      month
    })  
  },

  bindDateChange: function (e) {
    let date = e.detail.value.split('-');
    this.setData({
      date:e.detail.value,
      year: date[0],
      month: date[1]
    });    
    if (this.data.companyid){
      this.getCompanyBill();      
    }else{
      this.getUserBill(); 
    }
  },

  getCompanyBill: function (reflesh){
    this.openLoading();
    wx.request({
      url: `${urlList.getCompanyBill}?companyid=${this.data.companyid}&year=${this.data.year}&month=${this.data.month}`,
      header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
      method: 'GET',
      success: (msg) => {
        wx.hideLoading();
        if (msg.data.code == 1) {
          this.setData({
            data: msg.data.data
          });
        } else {
          Util.errorHandle(urlList.getCompanyBill, msg.data.code);
        }
      }
    })
  },
  getUserBill: function (reflesh) {
    this.openLoading();
    wx.request({
      url: `${urlList.getUserBill}?userid=${this.data.userid}&year=${this.data.year}&month=${this.data.month}`,
      header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
      method: 'GET',
      success: (msg) => {
        wx.hideLoading();
        if (msg.data.code == 1) {
          this.setData({
            data: msg.data.data
          });
        } else {
          Util.errorHandle(urlList.getCompanyBill, msg.data.code);
        }
      }
    })
  },

  openLoading: function () {
    wx.showLoading({
      title: '数据加载中',
      icon: 'loading'
    });
  },
  getHeight() {
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          windowHeight: res.windowHeight
        })
      }
    })
  }
})