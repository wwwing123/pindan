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

const rules = {
  required: (value, name) => {
    if (name == 'company' && value == '-1') {
      return false;
    } else {
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
  tel: (value) => {
    return /^1[34578]\d{9}$/.test(value)
  }
}

module.exports = {
  formatTime,
  findFoods,
  rules
}
