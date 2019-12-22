const Util = require("../../utils/util.js");
const urlList = require("../../config.js");
import Toast from '../../vantComponents/toast/toast';
import Dialog from '../../vantComponents/dialog/dialog';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopcar: [],
    allFoodList:[],
    refleshClick: true,
    courierAddress: '',
    courierUname: '',
    courierUphone: '',
    errorUname: '',
    errorUphone: '',
    errorAddress: '',
    show: false,
    customSubmit: {}
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

  uNameChange(value) {
    this.setData({
      courierUname: value.detail
    })
  },
  uPhoneChange(value) {
    this.setData({
      courierUphone: value.detail
    })
  },
  addressChange(value) {
    this.setData({
      courierAddress: value.detail
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
        obj.discount_price = item.discount_price;
        obj.discount_size = item.discount_size;
        list.push(obj)
      }
      shopcar[j].list = list;
    }
    if (shopcar[3].status == 1 && shopcar[3].completeList) {
      shopcar[3].list = shopcar[3].completeList
    }
    this.setData({
      shopcar
    });
  },

  //

  //下单前判断逻辑函数
  goToOrder:function(e){
    if (app.globalData.userInformation.departmentid == -1){
      Util.openAlert('提示','请完善部门信息后再进行点餐',function(){
        wx.navigateTo({
          url: `/pages/user/Information/Information?type=updateDep`
        })
      })
      return;
    }
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
      case "custom":
        kind = 3;
        break;
    };
    //检查餐券是否足够支付
    if (!this.checkBalance(this.data.shopcar[kind].total)) {
      return;
    }
    const list = this.data.shopcar[kind].list;
    let data = { "type": e.currentTarget.dataset.type, "goods": [], "ordercompanyid": app.globalData.orderCompanyId};
    for(let i in list){
      let obj = {
        "id": list[i].id,
        "count": list[i].count
      }
      data["goods"].push(obj);
    }
    if (kind == 3) {
      this.setData({
        show: true,
        customSubmit: data,
        courierAddress: '',
        courierUname: '',
        courierUphone: '',
        errorUname: '',
        errorUphone: '',
        errorAddress: '',
      })
    }else{
      this.placeOrder(data,kind);
    }
  },

  customReq() {
    // wx.showModal({
    //   title: '是否确认下单',
    //   content: '定制货品下单成功后且退出程序后不会在购物车上显示，如需查看请到定制货品记录查找',
    //   confirmText: "确定",
    //   cancelText: "取消",
    //   success: (res) => {
    //     if (res.confirm) {
    //       this.placeOrder(this.data.customSubmit,3);
    //     } else {
    //       return false;
    //     }
    //   }
    // });
    Dialog.confirm({
      title: '是否确认下单',
      message: '定制货品下单成功后且退出程序后不会在购物车上显示，如需查看请到定制货品记录查找'
    }).then(() => {
      this.placeOrder(this.data.customSubmit, 3);
    })
  },

  //定制填写快递单号确认
  diaconfig (action,done) {
    action.detail.dialog.stopLoading()
    if (this.data.courierAddress || this.data.courierUname || this.data.courierUphone) {
      if (this.validateCourier()) {
        Dialog.confirm({
          title: '请确认个人信息',
          messageAlign: 'left',
          message: `收货人：${this.data.courierUname}\n收货电话：${this.data.courierUphone}\n收货地址：${this.data.courierAddress}`
        }).then(() => {
          this.customReq()
        }).catch(() => {

        });
        this.setData({
          show: false,
        })
      }
    } else {
      this.setData({
        show: false,
      })
      this.customReq()
    }
  },


  //收货信息校验
  validateCourier () {
    const flag = true;
    if (this.data.courierAddress || this.data.courierUname || this.data.courierUphone) {
      if (!this.data.courierUname) {
        this.setData({
          errorUname: '请输入收货人'
        })
        return false
      } else {
        this.setData({
          errorUname: ''
        })
      }
      if (!this.data.courierUphone) {
        this.setData({
          errorUphone: '请输入收货电话'
        })
        return false
      } else {
        this.setData({
          errorUphone: ''
        })
      }
      if (!this.data.courierAddress) {
        this.setData({
          errorAddress: '请输入收货地址'
        })
        return false
      } else {
        this.setData({
          errorAddress: ''
        })
      }
    }
    return flag;
  },

  //定制填写快递单号取消
  diacencal() {

  },

  //定制填写快递单号取消
  diacencal () {

  },
  //下单请求函数
  placeOrder: function (data,kind){
    data.courierAddress = this.data.courierAddress
    data.courierUname = this.data.courierUname
    data.courierUphone = this.data.courierUphone
    wx.showLoading({
      title: '正在下单',
      icon: 'loading'
    });
    Util.request({
      url: urlList.placeOrder,
      params: data,
      method: 'POST',
      message: '正在下单',
      success: (msg) => {
        this.getbalance();
        this.updateShopcar(kind);
        wx.showToast({
          title: '下单成功',
          icon: 'success',
          duration: 1000
        });
      },
      fail: (msg) => {
        let message = msg.data.msg ? msg.data.msg : '下单异常' //提示信息
        Util.openAlert('下单失败', message);
        Util.errorHandle(urlList.placeOrder, msg.data.code);//异常打印
      } 
    })
  },

  //下单后更新全局shopcar数据
  updateShopcar: function (kind) {
    const typename = ["breakfast", "lunch", "dinner","custom"];
    if (typename[kind] != 'custom'){//定制的单分开处理
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
          } else {
            Util.errorHandle(urlList.getUnfinishedOrder, msg.data.code);
          }
        }
      })
    }else{
      //更新定制购物车全局数据，相当于初始化定制购物车，仅保留当前页面数据
      app.globalData.shopcar[kind] = {
        count:this.data.shopcar[kind].count,
        orderNum:'',
        list: {},
        total: this.data.shopcar[kind].total,
        status: 1,
        id:'',
        time:'',
        completeList: this.data.shopcar[kind].list
      };
      //本地定制购物车的状态要更新
      let localShopcar = this.data.shopcar;
      localShopcar[kind].status = 1;
      this.setData({
        shopcar: localShopcar
      })
      // this.IntegrationData();//再次整合数据
    }   
  },

  //结算定餐后更新购物车数据
  refreshShopcar:function(kind){
    const typename = ["breakfast", "lunch", "dinner","custom"];
    let resetList = {
      name: typename[kind],
      time: '',
      orderNum: '',
      list: {},
      count: 0,
      total: 0,
      status: 3,
    }
    if (typename[kind] == "custom"){
      resetList.completeList = null;
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
          Util.request({
            url: urlList.finish,
            params: data,
            method: "POST",
            message: "正在加载数据",
            success: (msg) => {
              this.refreshShopcar(e.currentTarget.dataset.ordertype);
              this.gotoMsg(data.finish_type);
            },
            fail: (msg) => {
              Util.errorHandle(urlList.finish, msg.data.code);//异常打印
              let message = msg.data.msg ? msg.data.msg : '接口异常' //提示信息
              wx.showToast({//异常提示toast
                title: message,
                duration: 3000,
                image: '../../images/shopcar/fail.png',
                mask: true
              });
            }
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
      content:  '您的餐券不足以支付当前下单，请联系管理员进行充值。',
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
      id = e.currentTarget.dataset.id,
      discount_size = e.currentTarget.dataset.discount_size;
    if (shopcar[kind].status != 3) {
      return false;
    }
    if (shopcar[kind].count >= 999) {
      this.overCount(kind);
      return false;
    }
    if (!shopcar[kind].list[id]) {
      shopcar[kind].list[id] = 1;
    } else {
      shopcar[kind].list[id] += 1;
    }
    if (discount_size === shopcar[kind].list[id]) {
      this.discountTip(discount_size) //弹出提示 超出按原价计算
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
  },

  overCount: function (kind) {
    const tabs = ["早餐", "午餐", "晚餐", "定制"]
    wx.showModal({
      content: tabs[kind] + '定餐最多只能添加999份菜式',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          return false;
        }
      }
    });
  },

  clearConfirm: function(){
    wx.showModal({
      title: '提示',
      content: `清除定制货品信息后，购物车不再显示该下单信息，如需查看记录，请到定制货品记录查看`,
      confirmText: "确定",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          this.refreshShopcar(3);//重置购物车数据
        } else {
          return false;
        }
      }
    });
  },
  discountTip: function (num) {
    Toast({
      message: `优惠商品只优惠${num}份,超出按原价计算`,
      duration:1500,
    });
  },
  reflesh: function () {
    if (!this.data.refleshClick) {
      Toast({
        message: `点击过于频繁，请稍后再试！`,
        duration: 1000
      });
      return;
    }
    const typename = {
      "breakfast": { index: 0, name: "breakfastGoods" },
      "lunch": { index: 1, name: "lunchGoods" },
      "dinner": { index: 2, name: "dinnerGoods" }
    }
    wx.showLoading({
      title: '数据加载中',
      icon: 'loading'
    });
    for (let i in typename) {
      wx.request({
        url: `${urlList.getUnfinishedOrder}?type=${i}`,
        header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
        method: 'GET',
        success: (msg) => {
          wx.hideLoading();
          if (msg.data.code == 6) {
            const kind = typename[i].index
            if (app.globalData.shopcar[kind].status == 2) {
              this.refreshShopcar(kind);
            }
          } else {
            Util.errorHandle(urlList.getUnfinishedOrder, msg.data.code);
          }
        }
      })
    }
    this.setData({
      refleshClick: false
    })
    setTimeout(() => {
      this.setData({
        refleshClick: true
      })
    },5000)
  },
  onClose() {
    this.setData({ close: false });
  }
})