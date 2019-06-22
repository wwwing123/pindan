const Util = require("../../utils/util.js");
const urlList = require("../../config.js");
import Toast from '../../vantComponents/toast/toast';

const app = getApp();
Page({
  data: {
    "tabs": ["早餐", "午餐", "晚餐", "定制"],
    "activeIndex": 0,
    "sliderOffset": 0,
    "sliderLeft": 0,
    "companyid":-1,
    "breakfastGoods": [],
    "lunchGoods": [],
    "dinnerGoods": [],
    "customGoods": [],
    "allFoodList": app.globalData.allFoodList,
    "shopcar": app.globalData.shopcar,
    "count": 0,//购物车总件数
    "total": 0,//购物车总价
    "classifySeleted":-1,
    "foodsSeleted":{},
    "companyid": [],//公司id数组
    "company": [],//公司名称数组
    "currentID": null,//当前公司id
    "currentName": null,//当前公司名称
    "ifAdmin": false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.userInformation.companyid)
    this.setData({
      breakfastGoods: app.globalData.breakfastGoods,
      lunchGoods: app.globalData.lunchGoods,
      dinnerGoods: app.globalData.dinnerGoods,
      customGoods: app.globalData.customGoods,
      allFoodList: app.globalData.allFoodList,
      companyid: app.globalData.userInformation.companyid,
      currentID: app.globalData.userInformation.companyid,
      currentName: app.globalData.userInformation.company,
      ifAdmin: app.globalData.userInformation.admin,
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
      breakfastGoods: app.globalData.breakfastGoods,
      lunchGoods: app.globalData.lunchGoods,
      dinnerGoods: app.globalData.dinnerGoods,
      customGoods: app.globalData.customGoods,
      allFoodList: app.globalData.allFoodList,
      companyid: app.globalData.userInformation.companyid,      
      ifAdmin: app.globalData.userInformation.admin
    })//更新最新菜单接口数据 
    this.getCompany();//获取管理员可以查看的公司
    if (this.currentID === -1 || this.currentName === '') {
      this.setData({
        currentID: app.globalData.userInformation.companyid,
        currentName: app.globalData.userInformation.company,
      });
    }
    if (!this.data.classifySeleted){
      this.setData({
        classifySeleted: app.globalData.breakfastGoods[0].id,//更新总件数
      });
    }
    this.setData({
      shopcar: app.globalData.shopcar,//更新总件数
      count: this.getAllCountPrice('count'),//更新总件数
      total: this.getAllCountPrice('total').toFixed(2)//更新总价
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.shopcar = this.data.shopcar;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  tapClassify:function(e){
    var id = e.target.dataset.id;
    this.setData({
      classifySeleted: id
    });
  },
  //商品加入购物车
  tapAddCart:function(e){
    if (!app.globalData.getuserInfo){
      Util.checkInformation();//检查用户是否完善个人信息
      return;
    }    
    let kind = e.currentTarget.dataset.type,
        shopcar = this.data.shopcar, 
        id = e.currentTarget.dataset.id,
        discount_size = e.currentTarget.dataset.discount_size;
    // if (shopcar[kind].status != 3) {
    //   return false;
    // }
    if (kind == 3 && app.globalData.shopcar[kind].status == 1) {//检查用户本次是否已经下单完定制的单
      wx.showModal({
        content: '请先清除本次定制定餐，再进行添加菜品',
        showCancel: false,
        success:  (res) => {         
            this.goToPay(kind);            
        }
      });
      return false;
    }
    if (this.data.shopcar[kind].count>=999){
      this.overCount(kind);
      return false;
    }
    if (!shopcar[kind].list[id]){
      shopcar[kind].list[id] = 1;
    }else{
      shopcar[kind].list[id] += 1;
    }
    if (discount_size === shopcar[kind].list[id]) {
      this.discountTip(discount_size) //弹出提示 超出按原价计算
    }
    this.totalCount(kind);
    this.setData({
      shopcar
    })
    //隐藏商品详情
    if (e.currentTarget.dataset.cart){
      this.Modal.hideModal();
    }
  },
  //商品移除购物车
  tapReduceCart:function(e){
    let kind = e.currentTarget.dataset.type,
        shopcar = this.data.shopcar, 
        id = e.currentTarget.dataset.id; 
    if (shopcar[kind].list[id] <= 1) {
      delete shopcar[kind].list[id];
    } else {
      shopcar[kind].list[id] -= 1;
    }
    this.totalCount(kind);
    this.setData({
      shopcar
    })
  },
  //商品件数统计、总价计算
  totalCount:function(kind){
    let count = 0,
        total = 0,
        allFoodList = this.data.allFoodList;//所有商品的列表放到同一数组中
    const shopcar = this.data.shopcar;
    let shopcarlist = shopcar[kind].list;
    for (let i in shopcarlist) {
      const goodsItem = Util.findFoods(i, allFoodList);
      const price = goodsItem.price,
      discount_size = goodsItem.discount_size,
      discount_price = goodsItem.discount_price;
      if (discount_size > 0) {
        // 计算公式
        /* 三种情况
            * 总价 = 优惠价*优惠数量+原价*（数量-优惠数量）
            * 总价 = 优惠价*优惠数量
            * 总价 = 原价*数量
        */
        if (discount_size < shopcarlist[i]) {
          total += discount_price * discount_size + price * (shopcarlist[i] - discount_size)
        } else {
          total += discount_price * shopcarlist[i]
        }
      } else {
        total += price * shopcarlist[i]
      }
      count += shopcarlist[i]
    }
    
    shopcar[kind].count = count;
    shopcar[kind].total = total.toFixed(2);
      
    this.setData({
      shopcar
    })  
    let allcount = this.getAllCountPrice("count"),
      price = this.getAllCountPrice("total").toFixed(2);

    this.setData({
      count: allcount,
      total: price 
    })  
  },
  //去结算，页面跳转
  goToPay:function(kind){
    if(this.data.count > 0 || kind == 3){
      wx.switchTab({
        url: '/pages/shopcar/shopcar'
      })
    } 
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
  overCount: function (kind) {
    wx.showModal({
      content: this.data.tabs[kind] + '定餐最多只能添加999份菜式',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          return false;
        }
      }
    });
  },
  tabClick: function (e) {
    const typename = ["breakfastGoods", "lunchGoods", "dinnerGoods","customGoods"]
    this.Modal && this.Modal.hideModal();//隐藏商品详情
    //当点击tab时，默认选中第一个分类处理
    let good,data;
    data = this.data[typename[this.data.activeIndex]].filter((item) => {
        return item.goodslist.length>0
    })
    const item = data.find((x) => {
      return x.id == this.data.classifySeleted
    })
    let activeIdIndex = item ? item.id : data.length != 0 ? data[0].id : -1;
    good = this.data[typename[e.currentTarget.id]].filter((item) => {
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
  getAllCountPrice(name){
    const shopcar = this.data.shopcar;
    let total = shopcar.filter((item) => {
      return item.status == 3
    }).reduce((total, b) => {
      return Number(total) + Number(b[name]);
    },0)
    return total;
  },

  getShopcarData: function () {
    const typename = ["breakfast", "lunch", "dinner","custom"];
    let getBreakfast, getLunch, getDinner;
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
                for (let k in goods) {
                  allFoodList = allFoodList.concat(goods[k].goodslist);
                }
                app.globalData.allFoodList = allFoodList;
                this.setData({
                  allFoodList: app.globalData.allFoodList
                })
                if (typename[i] == 'breakfast') {
                  app.globalData.breakfastGoods = msg.data.data ? msg.data.data : []
                  this.setData({
                    breakfastGoods: app.globalData.breakfastGoods
                  })
                } else if (typename[i] == 'lunch') {
                  app.globalData.lunchGoods = msg.data.data ? msg.data.data : []
                  this.setData({
                    lunchGoods: app.globalData.lunchGoods
                  })
                } else if (typename[i] == 'dinner'){
                  app.globalData.dinnerGoods = msg.data.data ? msg.data.data : []
                  this.setData({
                    dinnerGoods: app.globalData.dinnerGoods
                  })
                } else{
                  app.globalData.customGoods = msg.data.data ? msg.data.data : []
                  this.setData({
                    customGoods: app.globalData.customGoods
                  })
                }
              } else{
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
        }
      }
      Promise.all([getBreakfast, getLunch, getDinner]).then((result) => {
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

  companyPickerChange:function(e){
    this.setData({
      currentID: this.data.companyid[e.detail.value],
      currentName: this.data.company[e.detail.value]
    });
    app.globalData.orderCompanyId = this.data.currentID;
    app.globalData.orderCompanyName = this.data.currentName;
    this.getShopcarData();
    this.refreshShopcar();
    this.setData({
      shopcar: app.globalData.shopcar,//更新总件数
    });
    this.setData({
      count: this.getAllCountPrice('count'),//更新总件数
      total: this.getAllCountPrice('total').toFixed(2)//更新总价
    });
  },

  getCompany: function () {
    if(!this.data.ifAdmin || this.data.companyid == -1){
      return;
    }
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
            company
          });
        } else {
          Util.errorHandle(urlList.getAdminCompany, msg.data.code);
        }
      }
    })
  },

  refreshShopcar: function (kind) {
    const typename = ["breakfast", "lunch", "dinner", "custom"];
    for (let i in typename){
      let resetList = {
        name: typename[kind],
        time: '',
        orderNum: '',
        list: {},
        count: 0,
        total: 0,
        status: 3,
      }
      if (typename[i] == "custom") {
        resetList.completeList = null;
      }
      if (app.globalData.shopcar[i].status == 3){
        app.globalData.shopcar[i] = resetList;
      }
      
    }
  },

  discountTip: function(num) {
    Toast({
      message: `优惠商品只优惠${num}份,超出按原价计算`,
      duration: 1500,
    });
  }
})