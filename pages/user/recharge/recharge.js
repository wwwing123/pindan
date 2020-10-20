const urlList = require("../../../config.js");
const Util = require("../../../utils/util.js");
import Dialog from '../../../vantComponents/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: '0',
    errorText: '',
    finlish: false,
    orderId: '',
    status: '',//SUCCESS
    showTopTips: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  moneyChange(e) {
    this.setData({
      money: e.detail.value
    })
  },
  validate() {
    let errorText = ''
    if (!this.data.money) {
      errorText = '请输入充值金额'
      this.setData({
        errorText
      })
      this.showTopTips()
      return false
    }
    if (!/^\d+(\.\d{0,2})?$/.test(this.data.money)) {
      errorText = '请输入两位小数以内的充值金额'
      this.setData({
        errorText
      })
      this.showTopTips()
      return false
    }
    if (Number(this.data.money) <= 0 && Number(this.data.money) > 500){
      errorText = '请输入大于0的充值金额'
      this.setData({
        errorText
      })
      this.showTopTips()
      return false
    }
    if (Number(this.data.money) > 500){
      errorText = '请输入小于500的充值金额'
      this.setData({
        errorText
      })
      this.showTopTips()
      return false
    }
    return true
  },
  recharge() {
    if(this.validate()) {
      let money = Number(this.data.money) * 100
      Util.request({
        url: urlList.payment,
        params: {
          total_fee: `${money}`
        },
        method: 'POST',
        success: (data) => {
          let payinfo = data.data.data
          let that = this
          this.setData({
            orderId: payinfo.orderId
          })
          wx.requestPayment({
            timeStamp: payinfo.timeStamp,
            nonceStr: payinfo.nonceStr,
            package: payinfo.package,
            signType: payinfo.signType,
            paySign: payinfo.paySign,
            success(res) {
              console.log('支付成功')
              that.getOrderPayment()
            },
            fail(res) {
              console.log('失败res',res)
              that.setData({
                finlish: true,
                status: 'FAIL'
              })
            }
          })
        },
        fail: (msg) => {
        } 
      })
    }
  },
  getOrderPayment() {
    wx.request({
      url: urlList.getOrderPayment,
      header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
      data: {
        id: this.data.orderId
      },
      method: 'get',
      success: (msg) => {
        let data = msg.data
        if (data.code == 1 && data.data.status == 'SUCCESS') {
          this.setData({
            finlish: true,
            status: data.data.status
          })
        } else {
          this.setData({
            finlish: true,
            status: 'FAIL'
          })
          Dialog.alert({
            message: data.msg || '支付失败！',
          })
        }
      }
    });
  },
  back() {
    wx.switchTab({
      url: "/pages/user/user"
    })
  },
  showTopTips: function () {
    this.setData({
      showTopTips: true
    });
    setTimeout(() => {
      this.setData({
        showTopTips: false
      });
    }, 2000);
  },
  copy() {
    wx.setClipboardData({
      data: this.data.orderId
    })
  }
})