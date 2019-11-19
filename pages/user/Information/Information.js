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
    currentCompID: -1,
    department: null,
    departmentID: null,
    currentDepID: -1,
    input_name: {
      value: "",
      disabled: false
    },
    input_idcard: {
      value: "",
      disabled: false
    },
    company_name: {
      value: '请选择所属单位名称',
      disabled: false
    },
    department_name: {
      value: '请选择所属部门信息',
      disabled: false
    },
    input_address: {
      value: "",
      disabled: false
    },
    input_phone: {
      value: "",
      disabled: false
    },
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
        required: '请输入18位识别码',
        error: '请输入18位的字母或数字'
      },
      companyid: {
        required: '请选择所属单位名称'
      },
      departmentid: {
        required: '请选择所属部门信息'
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
    if(options.type == 'updateDep'){//处理信息回显
      const userInformation = wx.getStorageSync('userInformation');
      this.setData({
        input_name: {
          value: userInformation.name,
          disabled: true
        },
        input_idcard: {
          value: userInformation.idcard,
          disabled: true
        },
        company_name: {
          value: userInformation.company,
          disabled: true
        },
        currentCompID: userInformation.companyid,
        input_address: {
          value: userInformation.address || " ",
          disabled: true
        },
        input_phone: {
          value: userInformation.phone,
          disabled: true
        }
      })
      this.getDepartment();//获取部门信息
      return;
    }
    //获取公司名称,id
    // this.setData({
    //   userid: wx.getStorageSync('userid')
    // })
    wx.request({//获取公司信息
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
  compChange: function (e) {
    this.setData({
      currentCompID: this.data.companyID[e.detail.value],
      company_name: {
        value: this.data.company[e.detail.value],
        disabled: false
      },
      currentDepID: -1,
      department_name: {
        value: '请选择所属部门信息', //清空部门信息
        disabled: false
      }
    });
    this.getDepartment();
  },
  depChange: function (e) {
    if (!this.data.departmentID || !this.data.departmentID[e.detail.value]) {
      this.setData({
        currentDepID: -1
      })
      return false;
    }
    console.log(1)   
    this.setData({
      currentDepID: this.data.departmentID[e.detail.value],
      department_name: {
        value: this.data.department[e.detail.value],
        disabled: false
      }
    })
  },
  depTouchStart: function(){
    //查看部门id数组是否为空
    if(this.data.departmentID === null) {
      this.showModal('请先选择所属单位再选择部门')
    }
  },
  getDepartment: function() {
    Util.request({
      url: urlList.getdepartment,
      params: {
        companyid: this.data.currentCompID
      },
      method: "GET",
      message: "正在获取部门信息…",
      success: (msg) => {
        let department = [], departmentID = [];
        const data = msg.data.data;
        if (data.length == 0){
          this.setData({
            department: [],
            departmentID: []
          })
          this.showModal('该单位部门信息为空，请通知管理员完善公司部门信息');
        }
        for (let i in data) {
          department.push(data[i].name);
          departmentID.push(data[i].id);
        }
        this.setData({
          department,
          departmentID
        })
      },
      fail: (msg) => {
        Util.errorHandle(urlList.getdepartment, msg.data.code);
        this.showModal('获取部门失败')
      }
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
  showModal: function (content) {
    wx.showModal({
      title: '提示',
      content,
      showCancel: false
    })
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
  submitConfig: function (formData) {  
    if(formData.address == ' '){
      formData.address = '';//空的办公地址要设置为空(placeholder问题)
    } 
    wx.showModal({
      title: '是否确认提交此信息',
      content: '个人信息一旦填写后无法修改,请再次确保自己的个人信息无误',
      confirmText: "确定",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          this.openLoading();
          if (!wx.getStorageSync('userid')) {
            this.getSessionKey(formData)
          } else {
            this.submitData(formData)
          }
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
    this.submitConfig(formData);

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
            companyid: data.companyid,
            department: data.department,
            departmentid: data.departmentid,
            address: data.address,
            phone: data.phone,
            balance: data.balance,
            authority: data.authority,
            userid: data.id,
            level: data.level,
            admin: data.level != 3 ? true : false,
            ledger: Boolean(data.ledger)
          }
          getApp().globalData.userInformation = userInformation;
          getApp().globalData.getuserInfo = true;
          getApp().globalData.orderCompanyId = userInformation.companyid
          getApp().globalData.orderCompanyName = userInformation.company
          getApp().getShopcarData();//加载菜单数据
          wx.setStorageSync('userInformation', userInformation);
        } else {
          Util.errorHandle(urlList.getuserinfo, msg.data.code);
        }
      }
    });
  },
  getSessionKey: function (formData) {
    const that = this
    wx.login({
      success: res => {
        let data = {
          code: res.code,
          appid: 'wx48f6b8eb475538fb',
          secret: '8f07853ccc608ae00d88c8efb6ad6cd8'
        }
        if (res.code) {
          wx.request({
            url: urlList.login,
            data: data,
            method: 'POST',
            header: { 'Content-Type': 'application/json' },
            success: function (msg) {
              if (msg.data.code == 1) {
                wx.setStorageSync('session_key', msg.data.data.et)
                wx.setStorageSync('userid', msg.data.data.userid)
                that.submitData(formData)
              } else {
                console.log(msg.data.msg)
              }
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  submitData(formData) {
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
          if (msg.data.msg) {
            this.openToast(msg.data.msg);
          } 
          Util.errorHandle(urlList.submitUserinfo, msg.data.code);
        }  
      }
    })
  },







})