//index.js
//获取应用实例
const app = getApp();
const urlList = require("../../config.js");
const Util = require("../../utils/util.js");
import Toast from '../../vantComponents/toast/toast';
import Dialog from '../../vantComponents/dialog/dialog';

Page({
  data: {
    indexImage: [],
    notice:{},
    cooperate: {
      name: '',
      phone: '',
      company: '',
      address: ''
    },
    errorText: {
      name: '',
      phone: '',
      company: '',
      address: ''
    },
    show: false
  },
  onLoad: function () {
    wx.request({
      url: urlList.indexImg,
      method:'get',
      success:(msg) => {
        if (msg.data.code == 1){
          this.setData({
            indexImage: msg.data.data
          })
        }else{
          Util.errorHandle(urlList.indexImg, msg.data.code);
        }
        
      }
    });
  },

  onReady: function () {
    //加入模态框组件
    this.Modal = this.selectComponent("#modal");
    wx.request({
      url: urlList.indexNotice,
      method: 'get',
      success: (msg) => {
        if (msg.data.code == 1) {
          const data = msg.data.data;
          if (data.title && data.content) {
            this.setData({
              notice: msg.data.data
            });
            this.Modal.showModal();
          }
        } else {
          Util.errorHandle(urlList.indexNotice, msg.data.code);
        }

      }
    })
  },
  onClose() {
    this.setData({ close: false });
  },
  submitData () {
    if (!this.check()) {
      return
    }
    this.setData({
      show: true
    })
  },
  diaconfig () {
    let data = this.data.cooperate;
    Util.request({
      url: urlList.indexCooperation,
      params: data,
      method: 'POST',
      message: '正在提交数据…',
      success: (msg) => {
        if (msg.data.code == 1) {
          this.setData({
            cooperate: {
              name: '',
              phone: '',
              company: '',
              address: ''
            },
            errorText: {
              name: '',
              phone: '',
              company: '',
              address: ''
            }
          })
          Dialog.alert({
            title: '申请成功！',
            message: '后面会有专人客服的电话联系，请留意客服的电话~'
          })
        } else {
          if (msg.data.msg) {
            Toast.fail(msg.data.msg);
          }
        }
      },
      fail: (msg) => {
        Util.errorHandle(urlList.indexCooperation, msg.data.code);//异常打印
      }
    })
  },
  nameChange (value) {
    let cooperate = this.data.cooperate
    cooperate.name = value.detail
    this.setData({
      cooperate
    })
  },
  phoneChange(value) {
    let cooperate = this.data.cooperate
    cooperate.phone = value.detail
    this.setData({
      cooperate
    })
  },
  companyChange(value) {
    let cooperate = this.data.cooperate
    cooperate.company = value.detail
    this.setData({
      cooperate
    })
  },
  addressChange(value) {
    let cooperate = this.data.cooperate
    cooperate.address = value.detail
    this.setData({
      cooperate
    })
  },
  check () {
    let flag = true,
    errorText = {
      name: '',
      phone: '',
      company: '',
      address: ''
    }
    this.setData({
      errorText
    })
    if (!this.data.cooperate.name) {
      errorText.name = '请输入姓名'
      this.setData({
        errorText
      })
      flag = false
    }
    if (!Util.rules.phone(this.data.cooperate.phone)) {
      errorText.phone = '请输入正确的手机号'
      this.setData({
        errorText
      })
      flag = false
    }
    if (!this.data.cooperate.address) {
      errorText.address = '请输入地址'
      this.setData({
        errorText
      })
      flag = false
    }
    return flag;
  },
  hide(e){
    this.Modal.hideModal();
  }
})
