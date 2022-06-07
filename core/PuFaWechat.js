home();
sleep(3000);
// 通过桌面快捷方式直接进入公众号
click("信用卡公众号");
sleep(3000);
click("浦发银行信用卡");
sleep(3000);
// 点击菜单
click("小浦🎁福利");
sleep(3000);
// 点击二级菜单
click("超6红包·全能积分");
sleep(5000);
// 进入H5页面
click("rBsZJWHOqAOAMdCIAABWGkErleI501"); //超6红包图片
sleep(5000);
// 进入 超6红包 页面
log(textMatches(/您目前还有.+/).findOnce().parent().parent().child(0)); // 394,1204,710,1655 , 开红包
textMatches(/您目前还有.+/).findOnce().parent().parent().child(0).click();
sleep(5000);
// 点击 开1个红包
click("开1个红包");
sleep(5000);
// 关闭弹框
log(textMatches(/.*恭喜您.*/).findOnce().parent().parent().child(1)); // 494,1525,585,1614 , 关闭
textMatches(/.*恭喜您.*/).findOnce().parent().parent().child(1).click();
sleep(5000);
// 进入 每日打卡 页面查看
className("android.widget.Image")
  .depth(23)
  .indexInParent(0)
  .clickable()
  .findOnce()
  .click();
sleep(5000);
