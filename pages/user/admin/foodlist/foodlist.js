const Util = require("../../../../utils/util.js");
const urlList = require("../../../../config.js");
import Toast from '../../../../vantComponents/toast/toast';

const app = getApp();
Page({
  data: {
    "tabs": ["早餐", "午餐", "晚餐", "定制"],
    "activeIndex": 0,
    "sliderOffset": 0,
    "sliderLeft": 0,
    "classifyList":[],
    "allFoodList": app.globalData.allFoodList,
    "classifySeleted":-1,
    "foodsSeleted":{},
    "ifAdmin": false,
    "companyid": [],//公司id数组
    "company": [],//公司名称数组
    "currentID": null,//当前公司id
    "currentName": null,//当前公司名称
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      classifyList: [
        app.globalData.breakfastGoods,
        app.globalData.lunchGoods,
        app.globalData.dinnerGoods,
        app.globalData.customGoods,
      ],
      allFoodList: app.globalData.allFoodList,
      ifAdmin: app.globalData.userInformation.admin,
      companyid: app.globalData.orderCompanyId,
      currentID: app.globalData.orderCompanyId,
      currentName: app.globalData.orderCompanyName,
      classifySeleted: app.globalData.breakfastGoods[0] ? app.globalData.breakfastGoods[0].id : -1
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //加入模态框组件
    this.Modal = this.selectComponent("#modal");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      allFoodList: app.globalData.allFoodList,
      classifyList: [
        app.globalData.breakfastGoods, 
        app.globalData.lunchGoods,
        app.globalData.dinnerGoods,
        app.globalData.customGoods,
      ],   
      ifAdmin: app.globalData.userInformation.admin,
      companyid: app.globalData.orderCompanyId,
      currentID: app.globalData.orderCompanyId,
      currentName: app.globalData.orderCompanyName,
    })
    this.getCompany();//获取管理员可以查看的公司
    if (!this.data.classifySeleted) {
      this.setData({
        classifySeleted: app.globalData.breakfastGoods[0].id,
      });
    }
  },

  tapClassify:function(e){
    var id = e.target.dataset.id;
    this.setData({
      classifySeleted: id
    });
  },
  //商品详情显示
  _onShowModal: function (e) {
    const id = e.currentTarget.dataset.id;
    const goodsItem = Util.findFoods(id, this.data.allFoodList);
    
    this.setData({
      foodsSeleted: {
        id: goodsItem.id,
        name: goodsItem.name,
        price: goodsItem.price,
        description: goodsItem.illustration,
        source: goodsItem.img,
        discount_size: goodsItem.discount_size,
        discount_price: goodsItem.discount_price,
      }
    })
    this.Modal.showModal();
  },
  tabClick: function (e) {
    const typename = ["breakfastGoods", "lunchGoods", "dinnerGoods","customGoods"]
    this.Modal && this.Modal.hideModal();//隐藏商品详情
    //当点击tab时，默认选中第一个分类处理
    let good,data;
    //切换前的data
    data = this.data.classifyList[this.data.activeIndex].filter((item) => {
        return item.goodslist.length>0
    })
    const item = data.find((x) => {
      return x.id == this.data.classifySeleted
    })
    let activeIdIndex = item ? item.id : data.length != 0 ? data[0].id : -1;
    //切换后的data
    good = this.data.classifyList[e.currentTarget.id].filter((item) => {
      return item.goodslist.length > 0
    })
    let nowitem = good.find((x) => {
      return x.id == activeIdIndex
    })
    this.setData({
      classifySeleted: nowitem ? nowitem.id : good.length != 0 ? good[0].id : -1,
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
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
          if (app.globalData.userInformation.companyid && companyid.indexOf(app.globalData.userInformation.companyid) < 0) {
            companyid.unshift(app.globalData.userInformation.companyid)
          }
          if (app.globalData.userInformation.company && company.indexOf(app.globalData.userInformation.company) < 0) {
            company.unshift(app.globalData.userInformation.company)
          }
          this.setData({
            companyid,
            company,
          });
        } else {
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
    this.getShopcarData();
  },
  getShopcarData: function () {
    const typename = ["breakfast", "lunch", "dinner", "custom"];
    let getBreakfast, getLunch, getDinner,getCustom;
    let allFoodList = [];
    wx.showLoading({
      title: '正在加载菜单',
      icon: 'loading'
    });
    if (this.data.currentID != -1 && this.data.currentID) {
      for (let i in typename) {
        //获取商品信息
        let promise = new Promise((resolve, reject) => {
          wx.request({
            url: `${urlList.goodsNew}?type=${typename[i]}&companyid=${this.data.currentID}`,
            header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
            method: 'get',
            success: (msg) => {
              if (msg.data.code == 1 || msg.data.code == 6) {
                //写入所有商品数组
                const goods = msg.data.data;
                let classifyList = this.data.classifyList
                for (let k in goods) {
                  allFoodList = allFoodList.concat(goods[k].goodslist);
                }
                this.setData({
                  allFoodList: app.globalData.allFoodList
                })
                classifyList[i] = msg.data.data ? msg.data.data : [];
                this.setData({
                  classifyList,
                })
              } else {
                Util.errorHandle(urlList.goodsNew, msg.data.code);
              }
              resolve();
            }
          });
        })
        switch (typename[i]) {
          case 'breakfast':
            getBreakfast = promise;
            break;
          case 'lunch':
            getLunch = promise;
            break;
          case 'dinner':
            getDinner = promise;
            break;
          case 'custom':
            getCustom = promise;
            break;
        }
      }
      Promise.all([getBreakfast, getLunch, getDinner, getCustom]).then((result) => {
        wx.hideLoading();
        this.tabClick({
          currentTarget: {
            id: this.data.activeIndex || 0,
            offsetLeft: this.data.sliderOffset || 0
          }
        });
      }).catch((error) => {
        console.log(error)
      })
    }
  },
})