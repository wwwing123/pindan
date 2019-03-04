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
    allBill: {},
    classification:{},
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
    this.getCompanyTotal();
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
    this.getCompanyTotal()
  },

  getCompanyTotal: function (reflesh) {
    this.openLoading();
    wx.request({
      url: `${urlList.getCompanyTotal}?year=${this.data.year}&month=${this.data.month}`,
      header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
      method: 'GET',
      success: (msg) => {
        wx.hideLoading();
        if (msg.data.code == 1) {
          this.setData({
            allBill: msg.data.data.all_bill,
            classification: msg.data.data.classification
          });
        } else {
          this.setData({
            allBill: {},
            classification: {}
          });//清空数据
          msg.data.msg && Util.openAlert('提示', msg.data.msg);
          //Util.errorHandle(urlList.getCompanyTotal, msg.data.code);
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