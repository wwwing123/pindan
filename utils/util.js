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
    } else if (name == 'address'){
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
    return /^1[34578]\d{9}$/.test(value)
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
        appid: 'wx7075e58a4c005dfc',
        secret: 'fc16d0ece9e687713336509fe95791a6'
      }
      console.log(data);
      if (res.code) {
        wx.request({
          url: 'http://123.207.56.139/api/register/wx/',
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


module.exports = {
  formatTime,
  findFoods,
  rules
}
