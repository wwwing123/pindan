const urlList = require("../../../../config.js");
const Util = require("../../../../utils/util.js");
import Toast from '../../../../vantComponents/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authority: null,//权限 
    level: null,//等级
    companyid: [],//公司id数组
    company: [],//公司名称数组
    currentID: '',//当前公司id
    currentName: '',//当前公司名称
    size:10,
    page:1,
    list: [],
    userid:null,
    year:'',
    month:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHeight();
    this.dateInit();
    this.setData({
      authority: options.authority,
      level: options.level
    })
    this.getCompany();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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

  dateInit: function () {
    const nowDate = new Date();
    const month = (nowDate.getMonth() + 1) < 10 ? '0' + (nowDate.getMonth() + 1) : '' + (nowDate.getMonth() + 1);
    this.setData({
      year: nowDate.getFullYear(),
      month
    })
  },

  getCompany: function () {
    wx.request({
      url: urlList.getAdminCompany,
      method: 'get',
      header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
      success: (msg) => {
        if (msg.data.code == 1) {
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
          this.getStaffList(true);//true清空原数据
        } else {
          Util.errorHandle(urlList.getAdminCompany, msg.data.code);
        }
      }
    })
  },
  companyPickerChange: function (e) {
    this.setData({
      currentID: this.data.companyid[e.detail.value],
      currentName: this.data.company[e.detail.value],
      page:1
    });
    this.getStaffList(true);
  },

  getStaffList: function (reflesh){
    this.openLoading();
    wx.request({
      url: urlList.getStaffComsume + `?page=${this.data.page}&size=${this.data.size}&companyid=${this.data.currentID}`,
      header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
      method: 'GET',
      success: (msg) => {
        wx.hideLoading();
        if (msg.data.code == 1) {
          let data = msg.data.data.datas,
              list = reflesh ? [] : this.data.list
          this.setData({
            list: list.concat(data),
            totalsize: msg.data.data.totalsize
          });
        } else {
          Util.errorHandle(urlList.getStaffComsume, msg.data.code);
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

  loadmore: function () {
    if ((this.data.totalsize - this.data.page * this.data.size) <= 0) {
      return false;
    }
    this.setData({
      page: this.data.page + 1
    });
    this.getStaffList();
  },

  gotoConsumeTotal: function () {
    if (!this.data.userid || !Util.rules.nameOrId(this.data.userid)) {
      Toast.fail('请输入用户id或者用户姓名');
      return;
    }
    this.openLoading();
    wx.request({
      url: `${urlList.getUserBill}?filter=${this.data.userid}&year=${this.data.year}&month=${this.data.month}`,
      header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
      method: 'GET',
      success: (msg) => {
        wx.hideLoading();
        if (msg.data.code == 1) {
          const data = msg.data.data
          wx.navigateTo({
            url: `/pages/user/admin/consumetotal/consumetotal?userid=${data.userid}&name=${data.name}&title=个人月消费累计额`
          })
        }else{
          Toast.fail(msg.data.msg);
        }
      }
    })
  },

  getUserId:function(e){
    this.setData({
      userid:e.detail.value
    })
  }
})