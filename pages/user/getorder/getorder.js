const urlList = require("../../../config.js");
const Util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authority:null,//权限 
    level:null,//等级
    companyid:[],//公司id数组
    company: [],//公司名称数组
    currentID:null,//当前公司id
    currentName: null,//当前公司名称
    Type:['早餐','午餐','晚餐'],//餐类数组
    TypeEn: ['breakfast', 'lunch', 'dinner'],//餐类数组
    currentType: 0,//当前餐类
    list:[],
    size: 20,
    page: 1,
    totalsize: 0,
    loadMoreHeight: 0,
    windowHeight: 0,//列表数据
    scrollTop: 0//滚动高度
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHeight();
    this.setData({
      authority: options.authority,
      level: options.level
    })
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCompany();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
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
  },

  loadmore: function () {
    if ((this.data.totalsize - this.data.page * this.data.size) <= 0) {
      return false;
    }
    this.setData({
      page: this.data.page + 1
    });
    this.getorderList();
  },

  getorderList:function(reflesh){
    this.openLoading();
    wx.request({
      url: urlList.getAdminOrder + `?page=${this.data.page}&size=${this.data.size}&companyid=${this.data.currentID}&type=${this.data.TypeEn[this.data.currentType]}`,
      header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
      method: 'GET',
      success: (msg) => {
        wx.hideLoading();
        if (msg.data.code == 1) {
          let data = msg.data.data.datas,
              list = reflesh ? [] : this.data.list
          let newdata = this.distinct(this.data.list, data)         
          this.setData({
            list: list.concat(newdata),
            totalsize: msg.data.data.totalsize
          })
        }else{
          Util.errorHandle(urlList.getAdminOrder, msg.data.code);
        }
        wx.hideLoading();
      }
    })
  },

  getCompany:function(){
    wx.request({
      url: urlList.getAdminCompany,
      method: 'get',
      header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
      success:(msg) => {
        if(msg.data.code==1){
          let company = [], companyid = [];
          const data = msg.data.data;
          for (let i in data) {
            company.push(data[i].name);
            companyid.push(data[i].id);
          }
          this.setData({
            companyid,
            company,
            currentID: companyid[0],
            currentName: company[0]
          });
          this.getorderList(true);//true清空原数据
        }else{
          Util.errorHandle(urlList.getAdminCompany, msg.data.code);
        }        
      }
    })
  },
  companyPickerChange: function (e) {
    this.setData({
      currentID: this.data.companyid[e.detail.value],
      currentName: this.data.company[e.detail.value]
    });
    this.getorderList(true);
  },

  foodPickerChange:function(e){
    this.setData({
      currentType: e.detail.value,
    });
    this.getorderList(true);
  },
  start: function (e) {
  },
  end: function (e) {

  },
  openLoading: function () {
    wx.showLoading({
      title: '数据加载中',
      icon: 'loading'
    });
  },

  //遍历本地数据，对比有无重复拉的数据，有则移除
  distinct:function(oldList,newList){
    let array = [],
        bool = false,//判断有无重复数据标志
        listcount = 0;//重复的条数
    if(oldList.length == 0){
      return newList;
    }
    for (var i in newList){
      for(var j in oldList){
        if (oldList[j].id != newList[i].id){
          array.push(newList[i])
        }else{
          listcount += 1
          bool = true;
        }
      }
    }
    if (bool && listcount != this.data.size){
      this.setData({
        page: this.data.page - 1
      })
    }
    return array;
  }
})