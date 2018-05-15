App({
  onLaunch: function () {
    
    const Util = require("./utils/util.js");
    const urlList = require("./config.js");
    var logs = wx.getStorageSync('logs') || []

    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    

    // 第一次登录获取session_key
    wx.login({
      success: res => {
        let data = {
          code: res.code,
          appid: 'wx7075e58a4c005dfc',
          secret: 'fc16d0ece9e687713336509fe95791a6'
        }
        if (res.code) {
          wx.request({
            url: urlList.login,
            data: data,
            method: 'POST',
            header: { 'Content-Type': 'application/json' },
            success: function (msg) {
              if (msg.data.code == 1){
                wx.setStorageSync('session_key', msg.data.data.et)
                wx.setStorageSync('userid', msg.data.data.userid)
              }else{
                Util.errorHandle(urlList.login,msg.data.code);
              }               
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });

    
    // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
    if (!wx.canIUse('open-data')){   
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用部分功能，请升级到最新微信版本后重试。',
        showCancel: false
      })
    }

    //获取商品信息
    let promise = new Promise((resolve, reject) => {
      wx.request({
        url: urlList.goods,
        method: 'get',
        success: (msg) => {
          if (msg.data.code == 1) {
            //写入所有商品数组
            let allFoodList = this.globalData.allFoodList;
            const goods = msg.data.data;
            for (let i in goods) {
              allFoodList = allFoodList.concat(goods[i].goodslist);
            }
            this.globalData.allFoodList = allFoodList;
          }else{
            Util.errorHandle(urlList.goods, msg.data.code);
          }
          resolve();
        }
      });
    })
    
    promise.then(() => {
      this.getShopcarData();
    })

  },

  getShopcarData:function(){
    const Util = require("./utils/util.js");
    const urlList = require("./config.js");
    const typename = ["breakfast", "lunch", "dinner"];
    for (let i in typename) {
      //获取商品信息
      wx.request({
        url: `${urlList.goods}?type=${typename[i]}`,
        method: 'get',
        success: (msg) => {
          if (msg.data.code == 1) {
            if (typename[i] == 'breakfast') {
              this.globalData.breakfastGoods = msg.data.data
            } else if (typename[i] == 'lunch') {
              this.globalData.lunchGoods = msg.data.data
            } else {
              this.globalData.dinnerGoods = msg.data.data
            }
          }else{
            Util.errorHandle(urlList.goods, msg.data.code);
          }
        }
      });
      //获取未完成订单信息（购物车信息）
      wx.request({
        url: `${urlList.getUnfinishedOrder}?type=${typename[i]}`,
        header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
        method: 'GET',
        success: (msg) => {
          if (msg.data.code == 1) {
            let shopcar = this.globalData.shopcar[i];
            let shopcarlist = JSON.parse(msg.data.data.illustration),
                count = shopcarlist.reduce((total,item)=>{
                  return total + item.count
                },0);
              shopcar.time = Util.formatTime(new Date(msg.data.data.created_at*1000));
              shopcar.orderNum = msg.data.data.order_number;
              shopcar.list = shopcarlist;
              shopcar.total = msg.data.data.balance_change;
              shopcar.status = msg.data.data.order_status;
              shopcar.id = msg.data.data.id;
              shopcar.count = count;             
              this.globalData.shopcar[i] = shopcar
          }else{
            Util.errorHandle(urlList.getUnfinishedOrder, msg.data.code);
          }
        }
      })
    }
  },

  globalData: {
    userInfo: null,
    //后台返回的所有商品原始数据
    breakfastGoods: [],
    lunchGoods: [],
    dinnerGoods: [],
    //所有商品原始数据整合到一个数组，方便根据id获取到商品的内容
    allFoodList: [],
    balance:'',
    //购物车的数据，list存放id，数量
    //count总数，total总价格
    //status订单状态 0已放弃 1已取餐 2已下单 3未下单
    shopcar:[
      {
        name:"breakfast",
        time:'',
        orderNum:'',
        list: {},
        count: 0,
        total: 0,
        status: 3
      },
      {
        name: "lunch",
        time: '',
        orderNum: '',
        list: {},
        count: 0,
        total: 0,
        status: 3
      },
      {
        name: "dinner",
        time: '',
        orderNum: '',
        list: {},
        count: 0,
        total: 0,
        status: 3
      }
    ]
  }
})