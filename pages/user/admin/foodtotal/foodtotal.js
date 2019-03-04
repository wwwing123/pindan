const urlList = require("../../../../config.js");
const Util = require("../../../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    totalPrice: "0.00",
    date: '',
    year: '',
    month: '',
    foodType: {
      '2': '早',
      '3': '中',
      '4': '晚',
      '5': '定'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.dateInit();
    this.getFoodTotal();
  },

  dateInit: function () {
    const nowDate = new Date();
    const month = (nowDate.getMonth() + 1) < 10 ? '0' + (nowDate.getMonth() + 1) : '' + (nowDate.getMonth() + 1);
    this.setData({
      date: `${nowDate.getFullYear()}-${month}`,
      year: nowDate.getFullYear(),
      month
    })
  },

  getFoodTotal: function () {
    Util.request(
      urlList.getfoodTotal,
      { year: this.data.year, month: this.data.month},
      'GET',
      '数据加载中',
      (msg) => {
          let data = msg.data.data.datas,
            list = []
          for (let i in data) {
            list.push({
              name: data[i].name,
              id: `${data[i].id}(${this.data.foodType[data[i].order_type]})`,
              size: data[i].size,
              price: data[i].price,
              total: (Number(data[i].price) * Number(data[i].size)).toFixed(2)
            })
          }
          this.setData({
            list,
            totalPrice: msg.data.data.statistics
          })
      },
      () => {
        Util.errorHandle(urlList.getfoodTotal, msg.data.code);
      }
    )
    // wx.showLoading({
    //   title: '数据加载中',
    //   icon: 'loading'
    // });
    // wx.request({
    //   url: `${urlList.getfoodTotal}?year=${this.data.year}&month=${this.data.month}`,
    //   header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
    //   method: 'GET',
    //   success: (msg) => {
    //     this.hideLoading();
    //     if (msg.data.code == 1) {
    //       let data = msg.data.data.datas,
    //         list = []
    //       for (let i in data) {
    //         list.push({
    //           name: data[i].name,
    //           size: data[i].size,
    //           price: data[i].price,
    //           total: (Number(data[i].price) * Number(data[i].size)).toFixed(2)
    //         })
    //       }
    //       this.setData({
    //         list,
    //         totalPrice: msg.data.data.statistics
    //       })
    //     } else {
    //       Util.errorHandle(urlList.getfoodTotal, msg.data.code);
    //     }
    //   }
    // })
  },

  bindDateChange: function (e) {
    let date = e.detail.value.split('-');
    this.setData({
      date: e.detail.value,
      year: date[0],
      month: date[1]
    });
    this.getFoodTotal()
  },




})