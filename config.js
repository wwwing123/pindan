const baseUrl = "http://193.112.7.67";//测试地址
//const baseUrl = "https://taste.benbenlitian.net.cn";//生产地址

const urlList = {
  login: `${baseUrl}/api/register/wx/`,//登录
  indexImg:`${baseUrl}/api/get/ads/`,//首页大图
  indexNotice: `${baseUrl}/api/get/notice/`,//首页公告
  indexCooperation: `${baseUrl}/api/edit/cooperation_info/`,//首页申请合作
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
  getdepartment: `${baseUrl}/api/get/department/`,//获取部门信息
  getAdminCompany: `${baseUrl}/api/user/get_authority/`,//获取管理员查看的公司
  getStaff: `${baseUrl}/api/get_company_member/`,//获取员工列表
  getCustmuseList: `${baseUrl}/api/user/get_company_member_v3/`,//获取员工定餐记录列表
  getStaffComsume: `${baseUrl}/api/user/get_company_member_v4/`,//获取消费员工列表
  getCompanyBill: `${baseUrl}/api/user/get_company_month_bill/`,//获取公司月总账
  getUserBill: `${baseUrl}/api/user/get_user_month_bill/`,//获取个人用户月总账
  getCompanyTotal: `${baseUrl}/api/user/admin/get_allcompany_month_bill/`,//获取总公司月累计消费
  getfoodTotal: `${baseUrl}/api/user/admin/get_goods_statistics/`,//获取总公司月菜品统计
  getfoodCompanyTotal: `${baseUrl}/api/user/admin/get_company_goods_statistics/`//获取所选公司月菜品统计
}


 /* "pages/index/index",// 首页
  "pages/classify/classify",// 分类
  "pages/shopcar/shopcar",// 购物车
  "pages/user/user",// 个人中心
  "pages/user/Information/Information",// 个人信息填写
  "pages/user/orderlist/orderlist",// 消费流水记录
  "pages/user/customlist/customlist",// 定制货品记录
  "pages/user/admin/admin",// 管理员入口
  "pages/user/admin/getorder/getorder",// 查看单位定餐
  "pages/user/admin/getcustom/getcustom",// 查看单位定制
  "pages/user/orderlist/orderlist",//定单详情
  "pages/user/admin/foodcount/foodcount",// 菜品统计
  "pages/user/admin/customcount/customcount",// 定制统计
  "pages/user/admin/stafflist/stafflist",// 员工定餐记录
  "pages/user/admin/stafforder/stafforder",// XXX定餐记录（员工的个人定餐或者定餐）
  "pages/user/admin/consumelist/consumelist",// 累计消费额
  "pages/user/admin/consumetotal/consumetotal",// 个人或公司月消费累计额 
  "pages/user/admin/staffcustom/staffcustom",// 员工定制记录
  "pages/user/admin/companytotal/companytotal",// 总单位消费累计额
  "pages/user/admin/foodtotal/foodtotal",// 总单位菜品统计
  "pages/user/admin/foodtotal/foodtotal",// 总单位菜品统计
  "pages/user/admin/foodcompanytotal/foodcompanytotal",// 获取所选公司菜品统计
  */

module.exports = urlList