//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res.code);
        let data = {
          code: res.code,
          appid: 'wx7075e58a4c005dfc',
          secret: 'fc16d0ece9e687713336509fe95791a6'
        }
        // console.log(data);
        // if (res.code){
        //   wx.request({
        //     url: 'http://123.207.56.139/api/register/wx/',
        //     data: data,
        //     method:'POST',
        //     header: { 'Content-Type': 'application/json' },
        //     success:function(msg){
        //       console.log(msg);
        //     }
        //   })
        // } else {
        //   console.log('获取用户登录态失败！' + res.errMsg)
        // }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
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
              
            }
          })
        }
      }
    })
  },
  onShow: function(){
    
    let allFoodList = this.globalData.allFoodList;
    const goods = this.globalData.goods;
    for (let i in goods) {
      allFoodList = allFoodList.concat(goods[i].foods);
    }
    this.globalData.allFoodList = allFoodList;
  },
  globalData: {
    userInfo: null,
    //后台返回的所有商品原始数据
    goods: [
      {
        "name": "菜式一",
        "type": 0,
        "foods": [
          {
            "id": "first0",
            "name": "皮蛋瘦肉粥",
            "price": 10,
            "description":"这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
            "image": "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "id": "first1",
            "name": "艇仔粥",
            "price": 14,
            "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
            "image": "http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "id": "first2",
            "name": "皮蛋瘦肉粥",
            "price": 10,
            "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
            "image": "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "id": "first3",
            "name": "艇仔粥",
            "price": 14,
            "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
            "image": "http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750"
          }
        ]
      },
      {
        "name": "菜式二",
        "type": 1,
        "foods": [
          {
            "id": "second0",
            "name": "皮蛋瘦肉粥",
            "price": 10,
            "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
            "image": "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "id": "second1",
            "name": "艇仔粥",
            "price": 14,
            "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
            "image": "http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "id": "second2",
            "name": "皮蛋瘦肉粥",
            "price": 10,
            "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
            "image": "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "id": "second3",
            "name": "艇仔粥",
            "price": 14,
            "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
            "image": "http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750"
          }, {
            "id": "second4",
            "name": "皮蛋瘦肉粥",
            "price": 10,
            "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
            "image": "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "id": "second5",
            "name": "艇仔粥",
            "price": 14,
            "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
            "image": "http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "id": "second6",
            "name": "皮蛋瘦肉粥",
            "price": 10,
            "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
            "image": "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "id": "second7",
            "name": "艇仔粥",
            "price": 14,
            "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
            "image": "http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750"
          }
        ]
      },
      {
        "name": "菜式三",
        "type": 2,
        "foods": [
          {
            "id": "third0",
            "name": "皮蛋瘦肉粥",
            "price": 10,
            "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
            "image": "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "id": "third1",
            "name": "艇仔粥",
            "price": 14,
            "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
            "image": "http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "id": "third2",
            "name": "皮蛋瘦肉粥",
            "price": 10,
            "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
            "image": "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "id": "third3",
            "name": "艇仔粥",
            "price": 14,
            "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
            "image": "http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "id": "third4",
            "name": "皮蛋瘦肉粥",
            "price": 10,
            "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
            "image": "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "id": "third5",
            "name": "艇仔粥",
            "price": 14,
            "description": "这是皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥皮蛋瘦肉粥",
            "image": "http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750"
          }
        ]
      }
    ],
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