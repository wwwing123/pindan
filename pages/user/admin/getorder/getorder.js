const urlList = require("../../../../config.js");
const Util = require("../../../../utils/util.js");
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
    scrollTop: 0,//滚动高度
    refreshing_text: '下拉刷新',
    loadingHeight: 50,
    refreshHeight: 0,
    pull: true,//下拉刷新状态 false释放刷新状态
    scrolling: false,//滚动中
    isUpper: true,//scroll-view 滚动条默认在最上
    isLower: false,
    loading: false,//是否在加载中
    downY: 0,//触摸时Y轴坐标  
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
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

  setHeight:function(){
    var query = wx.createSelectorQuery();
    query.select('.select').boundingClientRect((rect)=> {
      // console.log(rect.width)
      console.log(rect.height);
      this.setData({
        windowHeight: this.data.windowHeight - (rect.height + 35 )
      })
      
    }).exec();
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
      url: urlList.getAdminOrder + `?page=${this.data.page}&size=${this.data.size}&ordercompanyid=${this.data.currentID}&type=${this.data.TypeEn[this.data.currentType]}`,
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
          });
          this.loadFinish();
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
      currentName: this.data.company[e.detail.value],
      list:[],
      page:1
    });
    this.getorderList(true);
    this.getHeight();
  },

  foodPickerChange:function(e){
    this.setData({
      currentType: e.detail.value,
      list: [],
      page: 1
    });
    this.getorderList(true);
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
    for (let i in newList){
      let distinctItem = Util.findFoods(newList[i].id, oldList)
      if (!distinctItem){
        array.push(newList[i])
      }else{
          listcount += 1
          bool = true;
      }
    }
    if (bool && listcount != this.data.size){
      this.setData({
        page: this.data.page - 1
      })
    }
    return array;
  },
  refreshData:function(){
    this.data.isUpper = true;
    this.data.scrolling = false; 
  },
  scroll: function () {
    this.data.scrolling = true;
    this.data.isLower = false;
    this.data.isUpper = false;
  },
  start: function (e) {
    console.log('start')
    if (this.data.scrolling || this.data.loading) {
      return;
    }
    var startPoint = e.touches[0]
    var clientY = startPoint.clientY;
    this.setData({
      downY: clientY,
      refreshHeight: 0,
      loadMoreHeight: 0,
      pull: true,
      refreshing_text: '下拉刷新'
    });
  },
  end: function (e) {
    console.log('end')
    this.data.scrolling = false;
    if (this.data.refreshing) {
      return;
    }
    //释放开始刷新
    var height = this.data.loadingHeight;
    console.log(this.data.refreshHeight);
    console.log(this.data.loadingHeight)
    if (this.data.refreshHeight > this.data.loadingHeight) {
      this.setData({
        refreshHeight: height,
        loading: true,
        pull: false,
        refreshing_text: '正在刷新...'
      });
      this.setData({
        list:[],
        page:1
      })
      this.getorderList();
    } else {
      this.setData({
        refreshHeight: 0,
        loadMoreHeight: 0,
        loading: false,
        pull: true
      })
    }
  },
  move: function (e) {
    console.log('move')
    if (this.data.scrolling || this.data.loading) {
      return;
    }
    var movePoint = e.changedTouches[0]
    var moveY = (movePoint.clientY - this.data.downY) * 0.6;
    //1.下拉刷新
    if (this.data.isUpper && moveY > 0) {
      this.setData({
        refreshHeight: moveY
      })
      if (this.data.refreshHeight > this.data.loadingHeight) {
        this.setData({
          pull: false,
          refreshing_text: '释放立即刷新'
        })
      } else {
        this.setData({
          pull: true,
          refreshing_text: '下拉刷新'
        })
      }
    }
  },
  loadFinish: function () {
    this.setData({
        refreshHeight: 0,
        loadMoreHeight: 0,
        loading: false
      })
  },
})