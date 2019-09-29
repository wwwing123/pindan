const urlList = require("../../../../config.js");
const Util = require("../../../../utils/util.js");
import Toast from '../../../../vantComponents/toast/toast';
// import Dialog from '../../../../vantComponents/dialog/dialog';
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
    windowHeight: 0,
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
    popupShow: false,
    searchKey: '',
    fliterList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.dateInit();
    // this.getFoodTotal();
    this.getCompany();
  },

  onReady: function () {
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
          windowHeight: this.data.windowHeight - selectHeight - titleHeight - 15
        })//15px是盒子page__bd的padding-top高度
      })
    }, 500)

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
    let params = {
      starttime: this.data.reqStartTime,
      endtime: this.data.reqEndTime,
      companyid: this.data.currentComID
    }
    if (this.data.currentDepID) {
      params.departmentid = this.data.currentDepID
    }
    Util.request({
      url: urlList.getfoodCompanyTotal,
      params,
      method: "GET",
      message: "数据加载中",
      success: (msg) => {
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
          fliterList: list,
          totalPrice: msg.data.data.statistics
        })
        if (list.length == 0) {
          Toast.fail('所选条件数据为空');
        }

      },
      fail: (msg) => {
        Util.errorHandle(urlList.getfoodTotal, msg.data.code);
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
        let department = [], departmentID = [''];
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
            this.getFoodTotal(true);//true清空原数据
          }
          return;
        }
        comDepArr[1] = ['']
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
          this.getFoodTotal(true);//true清空原数据
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
    this.getFoodTotal(true);
    this.getHeight();
  },

  inputChange(e){
    this.setData({
      searchKey: e.detail
    })
  },

  onSearch(){
    if (this.data.searchKey) {
      let list = [];
      this.data.list.forEach(item => {
        item.name.indexOf(this.data.searchKey) > -1 && list.push(item)
      })
      this.setData({
        popupShow: false,
        fliterList: list
      })
    } else {
      this.setData({
        popupShow: false,
        fliterList: this.data.list
      })
    }
  },

  showSearch(){
    this.setData({
      popupShow: true
    });
  },

  hideSearch(){
    this.setData({
      searchKey: '',
      popupShow: false
    });
  },

  clearInput: function () {
    this.setData({
      searchKey: ''
    });
    this.onSearch()
  },

})