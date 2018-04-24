var Util = require("../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: Util.formatTime(new Date()),
    orderNum:'20180615000001',
    shopcar: {
      // list: [
      //   {
      //     "id": "third4",
      //     "name": "皮蛋瘦肉粥",
      //     "price": 10,
      //     "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
      //     "image": "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/750/h/750",
      //     "count":2
      //   },
      //   {
      //     "id": "third5",
      //     "name": "艇仔粥",
      //     "price": 14,
      //     "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
      //     "image": "http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750",
      //     "count": 2
      //   },
      //   {
      //     "id": "third6",
      //     "name": "艇仔粥",
      //     "price": 14,
      //     "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
      //     "image": "http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750",
      //     "count": 2
      //   },
      //   {
      //     "id": "third7",
      //     "name": "艇仔粥",
      //     "price": 14,
      //     "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
      //     "image": "http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750",
      //     "count": 2
      //   },
      //   {
      //     "id": "third8",
      //     "name": "艇仔粥",
      //     "price": 14,
      //     "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
      //     "image": "http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750",
      //     "count": 2
      //   },
      //   {
      //     "id": "third51",
      //     "name": "艇仔粥",
      //     "price": 14,
      //     "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
      //     "image": "http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750",
      //     "count": 2
      //   },
      //   {
      //     "id": "third52",
      //     "name": "艇仔粥",
      //     "price": 14,
      //     "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
      //     "image": "http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750",
      //     "count": 2
      //   },
      //   {
      //     "id": "third53",
      //     "name": "艇仔粥",
      //     "price": 14,
      //     "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
      //     "image": "http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750",
      //     "count": 2
      //   },
      //   {
      //     "id": "third54",
      //     "name": "艇仔粥",
      //     "price": 14,
      //     "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
      //     "image": "http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750",
      //     "count": 2
      //   },
      //   {
      //     "id": "third55",
      //     "name": "艇仔粥",
      //     "price": 14,
      //     "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
      //     "image": "http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750",
      //     "count": 2
      //   }
      // ],
      // sum: 1,
      // total: 12
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //根据全局的shopcar变量,整合成需要用到商品列表
    let list = [], shopcar = {};
    const allList = app.globalData.allFoodList,
      shopcarcount = app.globalData.shopcar,
      shopcarlist = shopcarcount.list;
    for (let i in shopcarlist) {
      let item = Util.findFoods(i, allList);
      item.count = shopcarlist[i];
      list.push(item)
    }
    shopcar.list = list;
    shopcar.sum = shopcarcount.count;
    shopcar.total = shopcarcount.total;
    shopcar.status = shopcarcount.status;
    this.setData({
      shopcar
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  toClassify:function(){
    wx.switchTab({
      url: '/pages/classify/classify'
    })
  },
  goToOrder:function(){
    
  }
  

  
})