const urlList = require("../config.js");

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const findFoods = (id,foodList) => {
  const food = foodList.find((x) => {
    return x.id == id
  })
  return food;
}

const findcompanyId = (name, foodList) => {
  const id = foodList.find((x) => {
    return x.name == name
  })
  return id;
}

const rules = {
  required: (value, name) => {
    if (name == 'companyid' && value == '-1') {
      return false;
    } else if (name == 'address' || name == 'userid'){
      return true;
    }else{
      if (value === '' || value === null) {
        return false;
      } else {
        return true;
      }
    }
  },
  name: (value) => {
    return /^[\u4e00-\u9fa5]+$/.test(value)
  },
  phone: (value) => {
    return /^1\d{10}$/.test(value)
  },
  idcard: (value) => {
    return /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)
  }
}

const getSessionKey = () => {
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
}

const openAlert = (title='',content,callback) => {
  wx.showModal({
    title: title,
    content: content,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        callback && callback();
      }
    }
  });
}

const errorHandle = (url,code,callback) => {
  if (code == '1003' || code == '1004'){
    getSessionKey();
    callback && callback();
  } else if (code == '1008' || code == '1010', code == '3001'){
    openAlert('提示',errorCode[code]);
  }else{
    console.log(`${url}接口错误码:${code},\n${errorCode[code]}`);
  }
}

const errorCode = {
  "2": "网络错误，请稍后再试",
  "3": "参数错误",
  "4": "服务器错误，请稍后再试",
  "5": "数据库错误，请稍后再试",
  "6": "空数据",
  "1001": "后台管理员无效登录信息",
  "1002": "后台管理员登录信息过期",
  "1003": "用户无效登录信息",
  "1004": "用户登录信息过期",
  "1005": "用户信息异常",
  "1006": "用户信息为空",
  "1007": "用户相关请求异常",
  "1008": "用户在不同设备登录",
  "1009": "管理员账号还在锁定期间",
  "1010": "用户权限不足",
  "1011": "管理员信息异常",

  "2001": "用户余额不足",

  "3001": "该商品已被管理员取消",
  "3002": "超过商品总数",
  "3003": "商品不支持",
  "3004": "还有定餐未完成",
  "3005": "商品不能为空",
  "3006": "定餐已完成了",
  "3007": "定餐类型异常",
  "3008": "定餐时间异常",

  "4001": "公司名字变更异常",
  "4002": "公司信息删除失败",
  "4003": "没有此公司信息"
}

const checkInformation = () =>{
  if(!getApp().globalData.getuserInfo){
    openAlert('','请先完善个人信息后再进行点餐',()=>{
      wx.switchTab({
        url: '/pages/user/user'
      })
    });
  }
}

const request = function(url, params, method, message, success, fail) {
  wx.showNavigationBarLoading();
  if (message != "") {
    wx.showLoading({
      title: message,
    })
  }
  wx.request({
    url: url,
    data: params,
    header: { userid: wx.getStorageSync('userid'), et: wx.getStorageSync('session_key') },
    method: method,
    success: function (msg) {
      wx.hideNavigationBarLoading();
      wx.hideLoading();
      if (msg.data.code == 1) {
        success(msg);
      } else {
        fail(msg);
      }
    },

    fail: function (error) {
      wx.hideNavigationBarLoading();
      wx.hideLoading();
      console.log(error);
      wx.showToast({
        title: '网络错误',
        duration: 3000,
        image:'../../images/shopcar/fail.png',
        mask: true
      });
    },

    complete: function (res) {

    },
  })
}

const ordertype = ['扣除','充值','早餐','午餐','晚餐','定制'];


module.exports = {
  formatTime,
  findFoods,
  rules,
  getSessionKey,
  openAlert,
  errorCode,
  errorHandle,
  checkInformation,
  request,
  ordertype
}
