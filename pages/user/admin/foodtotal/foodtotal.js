const urlList = require("../../../../config.js");
const Util = require("../../../../utils/util.js");
import Toast from '../../../../vantComponents/toast/toast';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    totalPrice: "0.00",
    startDate: '',
    endDate: '',
    reqStartTime: null,
    reqEndTime: null,
    foodType: {
      '2': '早',
      '3': '中',
      '4': '晚',
      '5': '定'
    },
    windowHeight:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.dateInit();
    this.getFoodTotal();
  },

  onReady: function (){
    this.getHeight();
  },

  getHeight() {
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight);
        _this.setData({
          windowHeight: res.windowHeight
        })
      }
    });
    this.setHeight();
  },

  setHeight: function () {
    setTimeout(() => {
      let query = wx.createSelectorQuery().in(this);
      query.select('.select').boundingClientRect();
      query.select('.title').boundingClientRect();
      query.exec(rect => {
        let selectHeight = rect[0] ? rect[0].height : 39
        let titleHeight = rect[1] ? rect[1].height : 42
        console.log(rect)
        this.setData({
          windowHeight: this.data.windowHeight - selectHeight - titleHeight -15
        })//15px是盒子page__bd的padding-top高度
      })
    },500)
    
    // query.select('.select').boundingClientRect((rect) => {
    //   // console.log(rect.width)
    //   console.log(rect.height);
    //   this.setData({
    //     windowHeight: this.data.windowHeight - (rect.height + 35)
    //   })

    // }).exec();
  },

  dateInit: function () {
    let startDate = new Date();
    startDate = new Date(startDate.setDate(1));
    const endDate = new Date();
    this.setData({
      startDate: this.getFormateDate(startDate),
      endDate: this.getFormateDate(endDate),
    });
    this.getRequestTime();//设置请求时间戳    
  },

  getRequestTime: function () {
    let startDate = this.data.startDate.replace(/\./g, '/');
    let endDate = this.data.endDate.replace(/\./g, '/');
    this.setData({
      reqStartTime: Date.parse(new Date(startDate + ' 00:00:00')) / 1000,
      reqEndTime: Date.parse(new Date(endDate + ' 23:59:59')) / 1000,
    })
  },

  getFormateDate: function (date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : '' + (date.getMonth() + 1);
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return `${year}.${month}.${day}`
  },

  getdiffDays: function (start, end) {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return parseInt(diff / (24 * 60 * 60 * 1000))
  },

  checkdiff: function () {
    let diff = this.getdiffDays(this.data.startDate, this.data.endDate);
    if (diff < 0) {
      Toast.fail('开始日期不能大于结束日期,请重新选择!');
      this.setData({//清空本次列表
        list: []
      })
      return false;
    }
    if (diff > 30) {
      Toast.fail('两个日期间隔不能超过31天,请重新选择!');
      this.setData({//清空本次列表
        list: []
      })
      return false;
    }
    return true;
  },

  bindDateChange: function (e) {
    e.detail.value = this.getFormateDate(new Date(e.detail.value))
    const startDate = e.currentTarget.dataset.type == 'startDate' ? e.detail.value : this.data.startDate;
    const endDate = e.currentTarget.dataset.type == 'endDate' ? e.detail.value : this.data.endDate;
    this.setData({
      startDate,
      endDate
    });
    this.getRequestTime();//设置请求时间戳
    this.getFoodTotal();
  },

  

  getFoodTotal: function () {
    if (!this.checkdiff()) {
      return;
    }
    console.log(this.data.reqStartTime);
    console.log(this.data.reqEndTime);
    Util.request(
      urlList.getfoodTotal,
      { starttime: this.data.reqStartTime, endtime: this.data.reqEndTime},
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
              isdiscount: Boolean(data[i].isdiscount),
              total: (Number(data[i].price) * Number(data[i].size)).toFixed(2)
            })
          }
          this.setData({
            list,
            totalPrice: msg.data.data.statistics
          })
          if (list.length == 0){
            Toast.fail('所选时间段数据为空');
          }
          
      },
      (msg) => {
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

})