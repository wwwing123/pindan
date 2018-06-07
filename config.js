const baseUrl = "https://taste.benbenlitian.net.cn";

const urlList = {
  login: `${baseUrl}/api/register/wx/`,//登录
  indexImg:`${baseUrl}/api/get/ad/`,//首页大图
  indexNotice: `${baseUrl}/api/get/notice/`,//首页公告
  goods: `${baseUrl}/api/get/goodslist/`,//商品信息
  getUnfinishedOrder: `${baseUrl}/api/user/get_curr_order/`,//个人未完成订单
  placeOrder: `${baseUrl}/api/user/place_order/`,//下单接口
  finish:`${baseUrl }/api/user/finish_order/`,//取餐或放弃接口
  getPersonOrder: `${baseUrl}/api/user/get_order_list/`,//个人订单
  getbalance: `${baseUrl}/api/user/get_balance/`,//获取个人余额
  getAdminOrder: `${baseUrl}/api/user/admin/get_company_order/`,//管理员菜品统计
  foodcount: `${baseUrl}/api/user/admin/get_goods_statistics/`,//管理员菜品统计
  submitUserinfo: `${baseUrl}/api/user/perfect_info/`,//提交个人信息
  getuserinfo: `${baseUrl}/api/user/get_userinfo/`,//个人信息
  getcompany: `${baseUrl}/api/get/company/`,//获取公司信息
  getAdminCompany: `${baseUrl}/api/user/get_authority/`//获取管理员查看的公司
}

module.exports = urlList