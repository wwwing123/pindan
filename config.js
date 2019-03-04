const baseUrl = "http://139.199.182.202";//测试地址
//const baseUrl = "https://taste.benbenlitian.net.cn";//生产地址

const urlList = {
  login: `${baseUrl}/api/register/wx/`,//登录
  indexImg:`${baseUrl}/api/get/ad/`,//首页大图
  indexNotice: `${baseUrl}/api/get/notice/`,//首页公告
  goodsOld: `${baseUrl}/api/get/goodslist/`,//商品信息
  goodsNew: `${baseUrl}/api/get/relationship_goodslist/`,//新版商品信息（拼上公司字段）
  getUnfinishedOrder: `${baseUrl}/api/user/get_curr_order/`,//个人未完成定餐
  placeOrder: `${baseUrl}/api/user/place_order/`,//下单接口
  finish:`${baseUrl }/api/user/finish_order/`,//取餐或放弃接口
  getPersonOrder: `${baseUrl}/api/user/get_order_list/`,//个人定餐
  getbalance: `${baseUrl}/api/user/get_balance/`,//获取个人余额
  getAdminOrder: `${baseUrl}/api/user/admin/get_company_order/`,//管理员菜品列表
  foodcount: `${baseUrl}/api/user/admin/get_goods_statistics/`,//管理员菜品统计
  foodcount2: `${baseUrl}/api/user/admin/get_goods_statistics_v2/`,//管理员菜品统计(含总餐券)
  getAdminCustom: `${baseUrl}/api/user/admin/get_custom_goods_order/`,//管理员定制列表
  customcount: `${baseUrl}/api/user/admin/get_custom_goods_statistics/`,//管理员定制统计
  submitUserinfo: `${baseUrl}/api/user/perfect_info/`,//提交个人信息
  getuserinfo: `${baseUrl}/api/user/get_userinfo/`,//个人信息
  getcompany: `${baseUrl}/api/get/company/`,//获取公司信息
  getAdminCompany: `${baseUrl}/api/user/get_authority/`,//获取管理员查看的公司
  getStaff: `${baseUrl}/api/user/get_company_member/`,//获取员工列表
  getStaffComsume: `${baseUrl}/api/user/get_company_member_v2/`,//获取消费员工列表
  getCompanyBill: `${baseUrl}/api/user/get_company_month_bill/`,//获取公司月总账
  getUserBill: `${baseUrl}/api/user/get_user_month_bill/`,//获取个人用户月总账
  getCompanyTotal: `${baseUrl}/api/user/admin/get_allcompany_month_bill/`,//获取总公司月累计消费
  getfoodTotal: `${baseUrl}/api/user/admin/get_month_goods_statistics/`//获取总公司月菜品统计
}

module.exports = urlList