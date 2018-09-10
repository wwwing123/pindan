const Util = require("../../utils/util.js");
const urlList = require("../../config.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopcar: [],
    allFoodList:[]     
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取个人余额信息
    
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
    this.IntegrationData();
    this.getbalance();//获取个人余额信息
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

  IntegrationData:function(){
    //根据全局的shopcar变量,整合成需要用到商品列表
    const allList = app.globalData.allFoodList,
          shopcar = JSON.parse(JSON.stringify(app.globalData.shopcar));
    for (let j = 0; j < shopcar.length; j++) {
      if (shopcar[j].status == 2) {
        continue;
      }
      let list = [], shopcarlist = shopcar[j].list;
      for (let i in shopcarlist) {
        const item = Util.findFoods(i, allList);
        let obj = {};
        obj.count = shopcarlist[i];
        obj.price = item.price;
        obj.id = item.id;
        obj.name = item.name;
        list.push(obj)
      }
      shopcar[j].list = list;
    }

    this.setData({
      shopcar
    });
  },

  //下单函数
  goToOrder:function(e){
    let kind;
    switch(e.currentTarget.dataset.type){
      case "breakfast":
        kind = 0;
        break;
      case "lunch":
        kind = 1;
        break;
      case "dinner":
        kind = 2;
        break;
    };
    //检查餐券是否足够支付
    if (!this.checkBalance(this.data.shopcar[kind].total)) {
      return;
    }
    const list = this.data.shopcar[kind].list;
    let data = { "type": e.currentTarget.dataset.type, "goods": [] };
    for(let i in list){
      let obj = {
        "id": list[i].id,
        "count": list[i].count
      }
      data["goods"].push(obj);
    }
    wx.showLoading({
      title: '正在下单',
      icon: 'loading'
    });
    // wx.request({
    //   url: urlList.placeOrder,
    //   data: data,
    //   header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key')},
    //   method: 'POST',
    //   dataType: 'json',
    //   success: (msg) => {
    //     wx.hideLoading();
    //     if (msg.data.code == 1){
    //       this.getbalance();
    //       this.updateShopcar(kind);
    //       wx.showToast({
    //         title: '下单成功',
    //         icon: 'success',
    //         duration: 1000
    //       });          
    //     }else{
    //       this.errorTime(kind);
    //       Util.errorHandle(urlList.placeOrder, msg.data.code);
    //     }       
    //   },
    //   fail: function(res) {
    //     wx.hideLoading();
    //   }
    // })
    Util.request(urlList.placeOrder, data, 'POST', '正在下单', (msg) => {
      this.getbalance();
      this.updateShopcar(kind);
      wx.showToast({
        title: '下单成功',
        icon: 'success',
        duration: 1000
      });
    }, (msg) => {
      let message = msg.data.msg ? msg.data.msg : '下单异常' //提示信息
      Util.openAlert('下单失败', message);
      Util.errorHandle(urlList.placeOrder, msg.data.code);//异常打印
    })
  },
  //下单后更新全局shopcar数据
  updateShopcar: function (kind) {
    const typename = ["breakfast", "lunch", "dinner"];
    wx.request({
      url: `${urlList.getUnfinishedOrder}?type=${typename[kind]}`,
      header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
      method: 'GET',
      success: (msg) => {
        if (msg.data.code == 1) {
          let shopcar = app.globalData.shopcar[kind];
          let shopcarlist = JSON.parse(msg.data.data.illustration),
            count = shopcarlist.reduce((total, item) => {
              return total + item.count
            }, 0);
          shopcar.time = Util.formatTime(new Date(msg.data.data.created_at * 1000));
          shopcar.orderNum = msg.data.data.order_number;
          shopcar.list = shopcarlist;
          shopcar.total = msg.data.data.balance_change;
          shopcar.status = msg.data.data.order_status;
          shopcar.id = msg.data.data.id;
          shopcar.count = count;
          app.globalData.shopcar[kind] = shopcar
          this.setData({
            shopcar: app.globalData.shopcar
          })
          this.IntegrationData();//再次整合数据
        }else{
          Util.errorHandle(urlList.getUnfinishedOrder, msg.data.code);
        }
      }
    })
    
  },

  //结算订单后更新购物车数据
  refreshShopcar:function(kind){
    const typename = ["breakfast", "lunch", "dinner"];
    let resetList = {
      name: typename[kind],
      time: '',
      orderNum: '',
      list: {},
      count: 0,
      total: 0,
      status: 3
    }
    app.globalData.shopcar[kind] = resetList;
    this.setData({
      shopcar: app.globalData.shopcar
    })
    this.IntegrationData();//再次整合数据
  },

  //取餐或待餐
  completeOrder:function(e){
    let data = {
      "id": e.currentTarget.dataset.id,
      "finish_type": e.currentTarget.dataset.finishtype
    }
    wx.showModal({
      title:'提示',
      content: `是否确认${data.finish_type == 'confirm' ? '取餐' : '待餐'}`,
      confirmText: "确定",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {          
          // wx.request({
          //   url: urlList.finish,
          //   data: data,
          //   header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
          //   method: 'POST',
          //   dataType: 'json',
          //   success: (msg) => {
          //     if (msg.data.code == 1) {
          //       this.refreshShopcar(e.currentTarget.dataset.ordertype);   
          //       this.gotoMsg(data.finish_type);
          //     } else {
          //       Util.errorHandle(urlList.finish, msg.data.code);
          //     }
          //   }
          // })
          Util.request(urlList.finish, data, 'POST', '正在加载数据', (msg) => {
              this.refreshShopcar(e.currentTarget.dataset.ordertype);
              this.gotoMsg(data.finish_type);
          },(msg)=> {
              Util.errorHandle(urlList.finish, msg.data.code);//异常打印
              let message = msg.data.msg ? msg.data.msg : '接口异常' //提示信息
              wx.showToast({//异常提示toast
                title: message,
                duration: 3000,
                image: '../../images/shopcar/fail.png',
                mask: true
              });
          })            
        }else{
          return false;
        }
      }
    });
    
    
  },

  //获取个人餐券
  getbalance: function () {
    wx.request({
      url: urlList.getbalance,
      header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
      method: 'GET',
      success: (msg) => {
        if (msg.data.code == 1) {
          app.globalData.balance = msg.data.data.balancce;
        }else{
          Util.errorHandle(urlList.getbalance, msg.data.code);
        }
      }
    });
  },

  //检查餐券是否足够支付
  checkBalance: function (needMoney){
    const balance = Number(app.globalData.balance);
    if (balance >= Number(needMoney)){
      return true;
    }else{
      this.showNoBalance();
      return false;
    }
  },

  //餐券不足提示
  showNoBalance:function(){
    wx.showModal({
      content:  '您的餐券不足以支付当前订单，请联系管理员进行充值。',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          return false;
        }
      }
    });
  },

  // //下单时间异常提示
  // errorTime:function(kind){
  //   if(kind == 0){
  //     Util.openAlert('下单失败','早餐下单时间为18点~22点');
  //   } else if (kind == 1){
  //     Util.openAlert('下单失败', '午餐下单时间为今天10点前');
  //   }else{
  //     Util.openAlert('下单失败', '晚餐下单时间为今天16点前');
  //   }
  // },

  gotoMsg:function(type){
    wx.navigateTo({
      url:`/pages/msg/msg?type=${type}`
    })
  },

  //商品加入购物车
  tapAddCart: function (e) {
    if (!app.globalData.getuserInfo) {
      Util.checkInformation();//检查用户是否完善个人信息
      return;
    }
    let kind = e.currentTarget.dataset.type,
      shopcar = app.globalData.shopcar,
      id = e.currentTarget.dataset.id;
    if (shopcar[kind].status != 3) {
      return false;
    }
    if (shopcar[kind].count >= 10) {
      this.overCount(kind);
      return false;
    }
    if (!shopcar[kind].list[id]) {
      shopcar[kind].list[id] = 1;
    } else {
      shopcar[kind].list[id] += 1;
    }
    this.totalCount(kind);
    this.IntegrationData();
  },
  //商品移除购物车
  tapReduceCart: function (e) {
    let kind = e.currentTarget.dataset.type,
      shopcar = app.globalData.shopcar,
      id = e.currentTarget.dataset.id;
    if (shopcar[kind].list[id] <= 1) {
      delete shopcar[kind].list[id];
    } else {
      shopcar[kind].list[id] -= 1;
    }
    this.totalCount(kind);
    this.IntegrationData();
  },

  totalCount: function (kind) {
    let count = 0,
      total = 0,
      allFoodList = app.globalData.allFoodList;//所有商品的列表放到同一数组中
    const shopcar = app.globalData.shopcar;
    let shopcarlist = shopcar[kind].list;
    for (let i in shopcarlist) {
      const goodsItem = Util.findFoods(i, allFoodList);
      const price = goodsItem.price;
      count += shopcarlist[i]
      total += price * shopcarlist[i]
    }
    shopcar[kind].count = count;
    shopcar[kind].total = total.toFixed(2);
  },

  overCount: function (kind) {
    const tabs = ["早餐", "午餐", "晚餐"]
    wx.showModal({
      content: tabs[kind] + '订单最多只能添加10份菜式',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          return false;
        }
      }
    });
  }
  

  
})