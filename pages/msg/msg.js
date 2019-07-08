Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'',
    msg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type,
      msg: `${options.type == 'confirm' ? '取餐' : '放弃'}成功`
    })
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
  back:function(){
    wx.navigateBack({
      delta: 1
    })
  }
})