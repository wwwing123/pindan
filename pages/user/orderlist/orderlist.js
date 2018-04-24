Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderlist:[
      {
        ordernum:'2018041500001',
        orderdate:'2018-04-15 16:28',
        status:1,
        totalprice:42,
        foods:[
          { name: "皮蛋瘦肉粥",count:1},
          { name: "云吞面", count: 2 },
          { name: "鱼香茄子", count: 3 }
        ]
      },
      {
        ordernum: '2018041500002',
        orderdate: '2018-04-16 16:28',
        status: 0,
        totalprice: 67,
        foods: [
          { name: "辣子鸡", count: 1 },
          { name: "酱香鸭", count: 2 },
          { name: "咖喱无骨鸡", count: 3 }
        ]
      },
      {
        ordernum: '2018041500002',
        orderdate: '2018-04-16 16:28',
        status: 1,
        totalprice: 28,
        foods: [
          { name: "美极仓鱼仔", count: 1 },
          { name: "番茄蛋", count: 2 },
          { name: "盐焗鸡翅", count: 3 }
        ]
      }
    ],
    loadMoreHeight:0,
    windowHeight:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //订单状态处理
    this.orderStatus();
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
    this.getHeight()
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
  onPullDownRefresh: function () {
    console.log('滚动到底部啦')
  },
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
  }
  
})