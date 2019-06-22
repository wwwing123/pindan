const urlList = require("../../../config.js");
const Util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderlist:[],
    orderType:['误餐','完成','进行中'],
    loadMoreHeight:0,
    windowHeight:0,
    scrollTop:0,//滚动高度
    showTop:true,//回到顶部显示
    size:10,
    currentPage:1,
    totalsize:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHeight();    
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
    this.doLoadData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  loadmore:function(){
    if ((this.data.totalsize - this.data.currentPage * this.data.size)<=0){
      return false;
    }
    this.setData({
      currentPage:this.data.currentPage+1
    });
    this.doLoadData();
  },
  start:function(){
  },
  end:function(e){

  },
  getHeight(){
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          windowHeight: res.windowHeight
        })
        console.log(res.windowHeight)
      }     
    })
  },
  doLoadData(currendSize, PAGE_SIZE) {
    wx.request({
      url: `${urlList.getPersonOrder}`,
      header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
      data:{
        "page": this.data.currentPage,
        "size": this.data.size,
        "type": "custom"
      },
      success:(msg) => {
        if(msg.data.code == 1){
          const data = msg.data.data.balance_changes;
          let orderlist = this.data.orderlist;
          for (let i in data){
            let obj = {
              orderdate: Util.formatTime(new Date(data[i].created_at * 1000)),
              ordernum: data[i].order_number,
              status: this.data.orderType[data[i].order_status],
              ordertype: data[i].order_type,
              orderTypeName: Util.ordertype[data[i].order_type],
              totalprice: data[i].order_type == 1 ? `+${data[i].balance_change}` : `-${data[i].balance_change}`,
              id: data[i].id,
              remain: data[i].remain
            };
            obj.foods = (data[i].order_type == 0 || data[i].order_type == 1) ? data[i].illustration : this.foodsHandler(JSON.parse(data[i].illustration));
            orderlist.push(obj);
          }
          this.setData({
            orderlist,
            totalsize: msg.data.data.totalsize
          })
        }else{
          Util.errorHandle(urlList.getPersonOrder, msg.data.code);
        }
      }
    })
  },

  scrolling:function(e){
    if(e.detail.scrollTop<300){
      return;
    }
    this.setData({
      showTop:false
    });
  },

  goTop: function (e) {  // 一键回到顶部
    this.setData({
      scrollTop: 0,
      showTop:true
    });

  },
  foodsHandler(foodslist) {
    let list = [];
    foodslist.forEach((item) => {
      if (item.discount_size > 0) {
        if (item.discount_size >= item.count) {
          item.price = item.discount_price;
          item.name = `${item.name}(优)`;
          list.push(item);
        } else {
          const handitem = JSON.parse(JSON.stringify(item));
          item.count = item.count - item.discount_size;
          list.push(item);
          handitem.count = item.discount_size;
          handitem.price = item.discount_price;
          handitem.name = `${item.name}(优)`;
          list.push(handitem);
        }
      } else {
        list.push(item)
      }
    })
    return list;
  }




})