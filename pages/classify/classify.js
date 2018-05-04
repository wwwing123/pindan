var Util = require("../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "goods": [],
    "allFoodList": app.globalData.allFoodList,
    "shopcarlist": app.globalData.shopcar.list,
    "count": app.globalData.shopcar.count,
    "total": app.globalData.shopcar.total,
    "classifySeleted":1,
    "foodsSeleted":{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      goods: app.globalData.goods,
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
    console.log(this.data.allFoodList);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.shopcar.list = this.data.shopcarlist;
    app.globalData.shopcar.count = this.data.count;
    app.globalData.shopcar.total = this.data.total;
    app.globalData.shopcar.status = 0;
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
    if (this.data.count>=10){
      this.overCount();
      return false;
    } 
    let shopcarlist = this.data.shopcarlist, id = e.currentTarget.dataset.id;
    if (!shopcarlist[id]){
      shopcarlist[id] = 1;
    }else{
      shopcarlist[id] += 1;
    }
    this.totalCount();
    this.setData({
      shopcarlist
    })
    //隐藏商品详情
    if (e.currentTarget.dataset.cart){
      this.Modal.hideModal();
    }
  },
  //商品移除购物车
  tapReduceCart:function(e){
    let shopcarlist = this.data.shopcarlist, id = e.currentTarget.dataset.id; 
    if (shopcarlist[id] <= 1) {
      delete shopcarlist[id];
    } else {
      shopcarlist[id] -= 1;
    }
    this.totalCount();
    this.setData({
      shopcarlist
    })
  },
  //商品件数统计、总价计算
  totalCount:function(){
    let count = 0,
        total = 0,
        allFoodList = this.data.allFoodList;//所有商品的列表放到同一数组中
    const shopcarlist = this.data.shopcarlist;
    for (let i in shopcarlist) {
      const goodsItem = Util.findFoods(i, allFoodList);
      const price = goodsItem.price;
      count += shopcarlist[i]
      total += price * shopcarlist[i]
    }
    this.setData({
      count,
      total
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
  overCount: function () {
    wx.showModal({
      content: '每个订单最多只能添加10份菜式',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    });
  }
})