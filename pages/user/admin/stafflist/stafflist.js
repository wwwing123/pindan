const urlList = require("../../../../config.js");
const Util = require("../../../../utils/util.js");
import Toast from "../../../../vantComponents/toast/toast";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authority: null,//权限 
    level: null,//等级
    companyid: [],//公司id数组
    company: [],//公司名称数组
    currentComID: null,//当前公司id
    currentDepID: null,//当前部门id
    currentComName: null,//当前公司名称
    currentDepName: null,//当前部门名称
    departmentID: [], //部门id数组
    comDepArr: [
      [],
      []
    ],
    comDepVal: [0, 0],
    size:10,
    page:1,
    list: [],
    userid: null,
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
  getCompany: function () {
    wx.request({
      url: urlList.getAdminCompany,
      method: 'get',
      header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
      success: (msg) => {
        if (msg.data.code == 1) {
          let company = [], companyid = [];
          let comDepArr = this.data.comDepArr;
          const data = msg.data.data;
          for (let i in data) {
            company.push(data[i].name);
            companyid.push(data[i].id);
            comDepArr[0].push(data[i].name)
          }
          this.setData({
            companyid,
            company,
            currentComID: companyid[0],
            currentComName: company[0],
            comDepArr,
          });
          this.getdepartment(true);
        } else {
          Util.errorHandle(urlList.getAdminCompany, msg.data.code);
        }
      }
    })
  },
  getdepartment: function (noReflesh) {
    Util.request({
      url: urlList.getdepartment,
      params: {
        companyid: this.data.currentComID
      },
      method: "GET",
      message: "正在获取部门信息…",
      success: (msg) => {
        let department = [], departmentID = ['-1'];
        let comDepArr = this.data.comDepArr
        const data = msg.data.data;
        if (data.length == 0) {
          comDepArr[1] = []
          this.setData({
            comDepArr,
            departmentID: [],
            currentDepName: '',
            currentDepID: ''
          })
          if (noReflesh) {
            this.getStaffList(true);//true清空原数据
          }
          return;
        }
        comDepArr[1] = ['全部']
        for (let i in data) {
          comDepArr[1].push(data[i].name);
          departmentID.push(data[i].id);
        }
        this.setData({
          comDepArr,
          departmentID,
          currentDepName: comDepArr[1][0] || '',
          currentDepID: departmentID[0] || ''
        })
        if (noReflesh) {
          this.getStaffList(true);//true清空原数据
        }
      },
      fail: (msg) => {
        Util.errorHandle(urlList.getdepartment, msg.data.code);
        this.showModal('获取部门失败')
      }
    })
  },
  comColumnChange(e) {
    console.log(e.detail)
    if (e.detail.column === 1) {
      return;
    } else {
      this.setData({
        comDepVal: [e.detail.value, 0]
      })
    }
    this.setData({
      currentComID: this.data.companyid[e.detail.value],
    });
    this.getdepartment()
  },
  companyPickerChange: function (e) {
    console.log(e.detail)
    this.setData({
      currentComID: this.data.companyid[e.detail.value[0]],
      currentComName: this.data.company[e.detail.value[0]],
      currentDepID: this.data.departmentID[e.detail.value[1]] || '',
      currentDepName: this.data.comDepArr[1][e.detail.value[1]] || '',
      list: [],
      page: 1
    });
    this.getStaffList(true);
  },

  getStaffList: function (reflesh){
    this.openLoading();
    wx.request({
      url: urlList.getStaff + `?page=${this.data.page}&size=${this.data.size}&companyid=${this.data.currentComID}${this.data.currentDepID ? '&departmentid=' + this.data.currentDepID : ''}`,
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
          Util.errorHandle(urlList.getStaff, msg.data.code);
        }
        wx.hideLoading();
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

  gotoStaffOrder: function () {
    if (!this.data.userid || !Util.rules.nameOrId(this.data.userid)) {
      Toast.fail('请输入用户id或者用户姓名');
      return;
    }
    this.openLoading();
    wx.request({
      url: `${urlList.getPersonOrder}?filter=${this.data.userid}`,
      header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
      method: 'GET',
      success: (msg) => {
        wx.hideLoading();
        if (msg.data.code == 1) {
          const data = msg.data.data
          wx.navigateTo({
            url: `/pages/user/admin/stafforder/stafforder?staffId=${data.userid}&title=${data.username}定餐记录&useTitle=消费餐券`
          })
        } else {
          Toast.fail(msg.data.msg);
        }
      }
    })
  },

  getUserId: function (e) {
    this.setData({
      userid: e.detail.value
    })
  }
})