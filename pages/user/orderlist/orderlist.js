Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderlist:[],
    loadMoreHeight:0,
    windowHeight:0,
    currentSize:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //订单状态处理
    this.orderStatus();
    this.getHeight();
    this.doLoadData(0, 3);
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
    console.log('滚动到底部啦')
  },
  start:function(){
    console.log('start')
  },
  end:function(){
    console.log('end')
  },
  scroll: function () {
    console.log("scroll...");
  },

  orderStatus: function(){
    const status = ['已取消', '已取餐'];
    let orderlist = this.data.orderlist;
    for (let i in orderlist) {
      orderlist[i].status = status[orderlist[i].status]
    }
    this.setData({
      orderlist
    })
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
    setTimeout(()=>{
      let length = currentSize + PAGE_SIZE;
      let orderlist = this.data.orderlist;
      const data = wx.getStorageSync('orderlist');
      console.log('currendSize:', currendSize);
      for (var i = currendSize; i < length; i++) {
        orderlist.push(data[i]);
      }
      currentSize += PAGE_SIZE
      this.setData({
        orderlist,
        currentSize
      })
      that.loadFinish();
    },2000)
  },

  loadFinish: function () {
    setTimeout(() => {
      //2s后刷新结束
      this.setData({
        loading: false
      })
    }, 1000);
  }




})