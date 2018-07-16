const Util = require("../../../utils/util.js");
const urlList = require("../../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid: wx.getStorageSync('userid'),
    company: [],
    companyID: [],
    currentID: -1,
    companyname: '请选择所属公司名称',
    messages: {
      name: {
        required: '请输入您的真实姓名',
        error: '请输入正确的姓名'
      },
      phone: {
        required: '请输入您的手机号',
        error: '请输入正确的手机号'
      },
      idcard: {
        required: '请输入您的身份证号',
        error: '请输入正确的身份证号'
      },
      companyid: {
        required: '请选择所属公司名称'
      },
    },
    showTopTips: false,
    errorMsg: {
      'msg': '',
      'type': ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取公司名称,id
    this.setData({
      userid: wx.getStorageSync('userid')
    })
    wx.request({
      url: urlList.getcompany,
      method: 'get',
      success: (msg) => {
        if(msg.data.code==1){
          let company = [], companyID = [];
          const data = msg.data.data;
          for (let i in data) {
            company.push(data[i].name);
            companyID.push(data[i].id);
          }
          this.setData({
            company,
            companyID
          })
        }else{
          Util.errorHandle(urlList.getcompany, msg.data.code);
        }
        
      }
    })
  },
  onUnload: function () {

  },
  bindPickerChange: function (e) {
    this.setData({
      currentID: this.data.companyID[e.detail.value],
      companyname: this.data.company[e.detail.value]
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
    }, 3000);
  },
  openToast: function (text) {
    wx.showToast({
      title: text,
      icon: 'success',
      duration: 1000
    });
  },
  openLoading: function () {
    wx.showLoading({
      title: '正在提交信息',
      icon: 'loading'
    });
  },
  submitData: function (formData) {
    
    wx.showModal({
      title: '是否确认提交此信息',
      content: '个人信息一旦填写后无法修改,请再次确保自己的个人信息无误',
      confirmText: "确定",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          console.log(formData)
          this.openLoading();
          wx.request({
            url: urlList.submitUserinfo,
            method:"POST",
            header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
            data: formData,
            success: (msg) => {
              if(msg.data.code == 1){
                wx.hideLoading();
                this.openToast('已完成');
                this.getUserinfo();
                setTimeout(() => {
                  wx.switchTab({
                    url: "/pages/user/user"
                  })
                }, 1500)
              }else{
                wx.hideLoading();
                this.openToast('提交失败');
                Util.errorHandle(urlList.submitUserinfo, msg.data.code);
              }  
            }
          })
        } else {
          return false;
        }
      }
    });
  },

  

  formSubmit:function (e) {
    const { formData, rules, messages } = {
          formData: e.detail.value,
          rules: Util.rules,
          messages: this.data.messages
        };
    let errorMsg = '';
    for (let i in formData) {
      if (!rules.required(formData[i], i)) {
        this.setData({
          errorMsg: {
            'msg': messages[i].required,
            'type': i
          }
        });
        this.showTopTips();
        return false;
      } else {
        if (rules[i] && !rules[i](formData[i])) {
          this.setData({
            errorMsg: {
              'msg': messages[i].error,
              'type': i
            }
          })
          this.showTopTips();
          return false;
        }
      }
    }
    console.log("检验成功");
    this.submitData(formData);

  },

  getUserinfo: function () {
    wx.request({
      url: urlList.getuserinfo,
      header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
      method: 'GET',
      success: (msg) => {
        if (msg.data.code == 1) {
          const data = msg.data.data;
          let userInformation = {
            name: data.name,
            idcard: data.idcard,
            company: data.company,
            address: data.address,
            phone: data.phone,
            balance: data.balance,
            companyid: data.companyid,
            authority: data.authority,
            userid: data.id,
            level: data.level,
            admin: data.level != 3 ? true : false,

          }
          getApp().globalData.userInformation = userInformation;
          getApp().globalData.getuserInfo = true;
          wx.setStorageSync('userInformation', userInformation);
        } else {
          Util.errorHandle(urlList.getuserinfo, msg.data.code);
        }
      }
    });
  }







})