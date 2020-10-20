const urlList = require("../../../config.js");
const Util = require("../../../utils/util.js");

Page({
  data: {
    orderDetail: null,
    totalPrice:''
  },
  onLoad: function (options) {
    console.log(JSON.parse(options.orderDetail));
    this.setData({
      orderDetail: JSON.parse(options.orderDetail)
    })
    this.getTotalPrice()
  },
  onReady: function () {
    
  },
  onShow: function () {
    
  },
  getTotalPrice: function(){
    let orderDetail = this.data.orderDetail;
    let allPrice = /\d+\.?\d*/.exec(orderDetail.totalprice)
    let totalprice = allPrice && allPrice[0];
    orderDetail.totalprice = totalprice;
    if (orderDetail.ordertype != 1 && orderDetail.ordertype != 0 && orderDetail.ordertype != 6) {
      for (let i in orderDetail.foods) {
        orderDetail.foods[i].total = (Number(orderDetail.foods[i].count) * Number(orderDetail.foods[i].price)).toFixed(2)
      }
    }
    this.setData({
      orderDetail
    })
  }
    
})