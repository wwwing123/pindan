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
    list:[]//列表数据
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      authority: options.authority,
      level: options.level,
      companyid: options.companyid && this.data.companyid.push(options.companyid),
      company: options.company && this.data.company.push(options.company),
      currentID: options.companyid,
      currentName: options.company
    })
    this.getCompany();
    this.getorderList();
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
    
  },

  getorderList:function(){
    wx.request({
      url: urlList.getAdminOrder + `?page=1&size=10&companyid=${this.data.companyid}&type=${this.data.TypeEn[this.data.currentType]}`,
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
            list
          })
        }else{
          Util.errorHandle(urlList.getAdminOrder, msg.data.code);
        }
      }
    })
  },

  getCompany:function(){
    if(this.data.level != 1){
      return;
    }
    wx.request({
      url: urlList.getcompany,
      method: 'get',
      success:(msg) => {
        if(msg.data.code==1){
          let company = [], companyid = [];
          const data = msg.data.data;
          for (let i in data) {
            company.push(data[i].name);
            companyid.push(data[i].id);
          }
          this.setData({
            company,
            companyid
          })
        }else{
          Util.errorHandle(urlList.getcompany, msg.data.code);
        }        
      }
    })
  },
  companyPickerChange: function (e) {
    this.setData({
      currentID: this.data.companyID[e.detail.value],
      companyname: this.data.company[e.detail.value]
    });
    this.getorderList();
  },

  foodPickerChange:function(e){
    this.setData({
      currentType: e.detail.value,
    });
    this.getorderList();
    console.log(this.data.currentType)
  }
  
})