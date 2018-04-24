const Util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    company: ['广州市文化传播事务所东莞分所', '穗龙建材贸易发展公司', '广州福龙卫生筷子厂', '广州裕华织造厂佛冈分厂'],
    companyIndex: '-1',
    companyname: '请选择所属公司名称',
    messages: {
      name: {
        required: '请输入您的真实姓名',
        error: '请输入正确的姓名'
      },
      tel: {
        required: '请输入您的手机号',
        error: '请输入正确的手机号'
      },
      address: {
        required: '请输入您的办公地址'
      },
      company: {
        required: '请选择所属公司名称'
      },
    },
    showTopTips:false,
    errorMsg:{
      'msg':'',
      'type':''     
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
  bindPickerChange: function (e) {
    this.setData({
      companyIndex: e.detail.value,
      companyname: this.data.company[e.detail.value]
    })
  },

  showTopTips: function () {
    this.setData({
      showTopTips: true
    });
    setTimeout(() =>{
      this.setData({
        showTopTips: false
      });
    }, 3000);
  },
  openToast: function () {
    wx.showToast({
      title: '已完成',
      icon: 'success',
      duration: 2000
    });
  },
  openLoading: function () {
    wx.showToast({
      title: '正在提交信息',
      icon: 'loading',
      duration: 2000
    });
  },

  

  formSubmit:function(e){
    const { formData, rules, messages} = {
      formData: e.detail.value,
      rules: Util.rules,
      messages: this.data.messages
    };
    let errorMsg = '';    
    for (let i in formData){
      if (!rules.required(formData[i],i)){
        this.setData({
          errorMsg:{
            'msg': messages[i].required,
            'type':i
          }
        })
        this.showTopTips();
        console.log(this.data.errorMsg)
        return false; 
      } else{
        if (rules[i] && !rules[i](formData[i])){
          this.setData({
            errorMsg: {
              'msg': messages[i].error,
              'type':i
            }
          })
          this.showTopTips();
          console.log(this.data.errorMsg)
          return false;
        }
      }     
    }
    console.log("检验成功");
    this.openLoading();
    setTimeout(() => {
      this.openToast()
    }, 2000)  
  }
})