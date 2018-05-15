const Util = require("../../utils/util.js");
const urlList = require("../../config.js");

const app = getApp();
Page({
  data: {
    "tabs": ["早餐", "午餐", "晚餐"],
    "activeIndex": 0,
    "sliderOffset": 0,
    "sliderLeft": 0,
    
    "breakfastGoods": [],
    "lunchGoods": [],
    "dinnerGoods": [],
    "allFoodList": app.globalData.allFoodList,
    "shopcar": app.globalData.shopcar,
    "count": 0,//购物车总件数
    "total": 0,//购物车总价
    "classifySeleted":1,
    "foodsSeleted":{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      breakfastGoods: app.globalData.breakfastGoods,
      lunchGoods: app.globalData.lunchGoods,
      dinnerGoods: app.globalData.dinnerGoods,
      allFoodList: app.globalData.allFoodList
    })
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
      shopcar: app.globalData.shopcar,//更新总件数
    });
    this.setData({
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
    let kind = e.currentTarget.dataset.type,
        shopcar = this.data.shopcar, 
        id = e.currentTarget.dataset.id;
    if (shopcar[kind].status != 3) {
      return false;
    }
    if (this.data.shopcar[kind].count>=10){
      this.overCount(kind);
      return false;
    }
    if (!shopcar[kind].list[id]){
      shopcar[kind].list[id] = 1;
    }else{
      shopcar[kind].list[id] += 1;
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
      const price = goodsItem.price;
      count += shopcarlist[i]
      total += price * shopcarlist[i]
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
  goToPay:function(){
    if(this.data.count > 0){
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
        source: goodsItem.img
      }
    })
    this.Modal.showModal();
  },
  overCount: function (kind) {
    wx.showModal({
      content: this.data.tabs[kind] + '订单最多只能添加10份菜式',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          return false;
        }
      }
    });
  },
  tabClick: function (e) {  
    this.setData({
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
  }
})