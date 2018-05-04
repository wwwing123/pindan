App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 第一次登录获取session_key
    if (!wx.getStorageSync('session_key')){
      wx.login({
        success: res => {
          let data = {
            code: res.code,
            appid: 'wx7075e58a4c005dfc',
            secret: 'fc16d0ece9e687713336509fe95791a6'
          }
          if (res.code) {
            wx.request({
              url: 'http://123.207.56.139/api/register/wx/',
              data: data,
              method: 'POST',
              header: { 'Content-Type': 'application/json' },
              success: function (msg) {
                if (msg.data.code == 1){
                  wx.setStorageSync('session_key', msg.data.data.et)
                  wx.setStorageSync('userid', msg.data.data.userid)
                }else{
                  console.log(msg.data.msg)
                }               
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }
    // 获取微信个人用户信息
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId             
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }             
            },
            fail: res => {
              wx.showModal({
                title: '提示',
                content: '必须授权登录后才能进行下单，是否重新授权登录?',
                confirmText: "确定",
                cancelText: "取消",
                success: (res) => {
                  if (res.confirm) {
                    wx.openSetting({
                      success: (msg) => {
                        if (msg.authSetting["scope.userInfo"]) { 
                          wx.getUserInfo({
                            success: res => {
                              // 可以将 res 发送给后台解码出 unionId             
                              this.globalData.userInfo = res.userInfo
                              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                              // 所以此处加入 callback 以防止这种情况
                              if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                              }
                            }
                          })
                        }
                      }
                    });
                  } else {
                    console.log('用户点击取消拒绝授权')
                  }
                }
              });// 向用户提示需要权限才能继续
              
            }
          })
        }
      }
    });


    //获取商品信息
    wx.request({
      url: "http://123.207.56.139/api/get/goodslist/",
      method: 'get',
      success: (msg) => {
        if(msg.data.code == 1){
          this.globalData.goods = msg.data.data
          //写入所有商品数组
          let allFoodList = this.globalData.allFoodList;
          const goods = this.globalData.goods;
          for (let i in goods) {
            allFoodList = allFoodList.concat(goods[i].goodslist);
          }
          this.globalData.allFoodList = allFoodList;
        }
        console.log(this.globalData.goods);
      }
    })
    //获取订单信息
    wx.setStorageSync('orderlist', [
      {
        ordernum: '2018041500001',
        orderdate: '2018-04-15 16:28',
        status: 1,
        totalprice: 42,
        foods: [
          { name: "皮蛋瘦肉粥", count: 1 },
          { name: "云吞面", count: 2 },
          { name: "鱼香茄子", count: 3 }
        ]
      },
      {
        ordernum: '2018041500002',
        orderdate: '2018-04-15 16:28',
        status: 1,
        totalprice: 42,
        foods: [
          { name: "皮蛋瘦肉粥", count: 1 },
          { name: "云吞面", count: 2 },
          { name: "鱼香茄子", count: 3 }
        ]
      },
      {
        ordernum: '2018041500003',
        orderdate: '2018-04-15 16:28',
        status: 1,
        totalprice: 42,
        foods: [
          { name: "皮蛋瘦肉粥", count: 1 },
          { name: "云吞面", count: 2 },
          { name: "鱼香茄子", count: 3 }
        ]
      },
      {
        ordernum: '2018041500004',
        orderdate: '2018-04-15 16:28',
        status: 1,
        totalprice: 42,
        foods: [
          { name: "皮蛋瘦肉粥", count: 1 },
          { name: "云吞面", count: 2 },
          { name: "鱼香茄子", count: 3 }
        ]
      },
      {
        ordernum: '2018041500005',
        orderdate: '2018-04-15 16:28',
        status: 1,
        totalprice: 42,
        foods: [
          { name: "皮蛋瘦肉粥", count: 1 },
          { name: "云吞面", count: 2 },
          { name: "鱼香茄子", count: 3 }
        ]
      },
      {
        ordernum: '2018041500006',
        orderdate: '2018-04-15 16:28',
        status: 1,
        totalprice: 42,
        foods: [
          { name: "皮蛋瘦肉粥", count: 1 },
          { name: "云吞面", count: 2 },
          { name: "鱼香茄子", count: 3 }
        ]
      },
      {
        ordernum: '2018041500007',
        orderdate: '2018-04-15 16:28',
        status: 1,
        totalprice: 42,
        foods: [
          { name: "皮蛋瘦肉粥", count: 1 },
          { name: "云吞面", count: 2 },
          { name: "鱼香茄子", count: 3 }
        ]
      },
      {
        ordernum: '2018041500008',
        orderdate: '2018-04-15 16:28',
        status: 1,
        totalprice: 42,
        foods: [
          { name: "皮蛋瘦肉粥", count: 1 },
          { name: "云吞面", count: 2 },
          { name: "鱼香茄子", count: 3 }
        ]
      },
      {
        ordernum: '2018041500009',
        orderdate: '2018-04-15 16:28',
        status: 1,
        totalprice: 42,
        foods: [
          { name: "皮蛋瘦肉粥", count: 1 },
          { name: "云吞面", count: 2 },
          { name: "鱼香茄子", count: 3 }
        ]
      },
      {
        ordernum: '2018041500010',
        orderdate: '2018-04-15 16:28',
        status: 1,
        totalprice: 42,
        foods: [
          { name: "皮蛋瘦肉粥", count: 1 },
          { name: "云吞面", count: 2 },
          { name: "鱼香茄子", count: 3 }
        ]
      },
      {
        ordernum: '2018041500011',
        orderdate: '2018-04-15 16:28',
        status: 1,
        totalprice: 42,
        foods: [
          { name: "皮蛋瘦肉粥", count: 1 },
          { name: "云吞面", count: 2 },
          { name: "鱼香茄子", count: 3 }
        ]
      },
      {
        ordernum: '2018041500012',
        orderdate: '2018-04-15 16:28',
        status: 1,
        totalprice: 42,
        foods: [
          { name: "皮蛋瘦肉粥", count: 1 },
          { name: "云吞面", count: 2 },
          { name: "鱼香茄子", count: 3 }
        ]
      }
    ])
  },
  onShow: function(){
    
    
  },
  globalData: {
    userInfo: null,
    //后台返回的所有商品原始数据
    goods: [],
    //所有商品原始数据整合到一个数组，方便根据id获取到商品的内容
    allFoodList: [],
    //购物车的数据，list存放id，数量
    //count总数，total总价格
    //status订单状态 0未下单 1已下单 2已取餐 3已放弃
    shopcar:{
      list:{},
      count:0,
      total:0,
      status:0
    }
  }
})