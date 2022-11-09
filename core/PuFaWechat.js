/**
 * 浦发公众号-每日打卡
 */

let singletonRequire = require("../lib/SingletonRequirer.js")(runtime, this);
let FloatyInstance = singletonRequire("FloatyUtil");
let widgetUtils = singletonRequire("WidgetUtils");
let automator = singletonRequire("Automator");
let commonFunctions = singletonRequire("CommonFunction");
let { clickScale } = require("../lib/Utils.js");

let BaseSignRunner = require("./BaseSignRunner.js");

function SignRunner() {
  //let signImg = "";
  BaseSignRunner.call(this);
  //let _package_name = "com.sina.weibo";

  this.exec = function () {
    // launch(_package_name);
    // sleep(1000);
    // this.awaitAndSkip(["\\s*允许\\s*", "\\s*取消\\s*"]);
    // FloatyInstance.setFloatyText("准备查找 我的");
    // let mine = widgetUtils.widgetGetOne(/^我$/);
    // if (mine) {
    //   FloatyInstance.setFloatyInfo(
    //     {
    //       x: mine.bounds().centerX(),
    //       y: mine.bounds().centerY(),
    //     },
    //     "找到了 我 按钮"
    //   );
    //   sleep(600);
    //   automator.click(mine.bounds().centerX(), mine.bounds().centerY());
    //   sleep(1000);
    //   if (this.captureAndCheckByImg(signImg, "签到", null, true)) {
    //     this.setExecuted();
    //   } else {
    //     FloatyInstance.setFloatyText("未找到 签到按钮");
    //   }
    // } else {
    //   FloatyInstance.setFloatyText("未找到 我");
    //   if (this.restartLimit-- >= 0) {
    //     FloatyInstance.setFloatyText("未找到 我 准备重开应用");
    //     commonFunctions.killCurrentApp();
    //     sleep(2000);
    //     this.exec();
    //   }
    // }
    // sleep(3000);
    // !config._debugging && commonFunctions.minimize(_package_name);

    home();
    sleep(1500);
    home();
    sleep(2000);
    FloatyInstance.enableLog();
    // 通过桌面快捷方式直接进入公众号

    let mine = widgetUtils.widgetGetOne("信用卡公众号");
    if (mine) {
      FloatyInstance.setFloatyInfo(mine, "打开[浦发公众号]");
      sleep(2000);
      click("信用卡公众号");
      sleep(2000);
      click("浦发银行信用卡");

      let menu = widgetUtils.widgetGetOne("小浦🎁福利");
      FloatyInstance.setFloatyInfo(menu, "打开[小浦🎁福利]菜单");
      sleep(2000);
      // 点击菜单
      click("小浦🎁福利");

      //FloatyInstance.setFloatyText("打开[超6红包·全能积分]菜单");
      sleep(1000);
      // 点击二级菜单
      click("超6红包·全能积分");

      FloatyInstance.setFloatyInfo(
        widgetUtils.widgetGetOne("rBsZJWHOqAOAMdCIAABWGkErleI501"),
        "打开[超6红包]页面"
      );
      sleep(5000);
      // 进入H5页面
      click("rBsZJWHOqAOAMdCIAABWGkErleI501"); //超6红包图片
      sleep(5000);
      // 进入 超6红包 页面
      // log(
      //   textMatches(/您目前还有.+/)
      //     .findOnce()
      //     .parent()
      //     .parent()
      //     .child(0)
      // ); // 394,1204,710,1655 , 开红包

      // 点击开红包
      textMatches(/您目前还有.+/)
        .findOnce()
        .parent()
        .parent()
        .child(0)
        .click();
      sleep(5000);
      let openOne = widgetUtils.widgetGetOne("开1个红包.*");
      if (openOne) {
        FloatyInstance.setFloatyInfo(openOne, "点击[开1个红包]");
        // 点击 开1个红包
        click("开1个红包");
        sleep(3000);
      }

      //FloatyInstance.setFloatyText("关闭[打成红包成功的页面]");

      // 关闭弹框
      // 494,1525,585,1614 , 关闭
      let success = textMatches(/.*恭喜您.*/).findOne(5000);
      if (success) {
        this.setExecuted();
        success.parent().parent().child(1).click();
        //FloatyInstance.setFloatyText("进入[每日打卡]页面查看");
        sleep(2000);
      }

      // 领取[每日任务]
      className("android.widget.Image")
        .depth(23)
        .indexInParent(1)
        .clickable()
        .findOnce()
        .click();
      sleep(3000);
      clickScale(540, 1500, "领取任务");
      sleep(2000);
      click("confirm");
      sleep(1000);
      back();
      sleep(2000);

      // 超6日 (其实只需要6,16,26点, 不过多点也无所谓);
      FloatyInstance.setFloatyInfo(
        {
          x: 960,
          y: 530,
        },
        "超6日"
      );
      sleep(1000);
      clickScale(960, 580, "超6日");
      sleep(2000);
      clickScale(540, 1821, "立即领取");
      sleep(2000);
      back();
      sleep(2000);

      // 进入 每日打卡 页面查看
      className("android.widget.Image")
        .depth(23)
        .indexInParent(0)
        .clickable()
        .findOnce()
        .click();
      sleep(3000);
      click("待领取");
      FloatyInstance.setFloatyText("[浦发公众号-每日打卡]签到完成");
      sleep(2000);
    } else {
      warn("没有找到[信用卡公众号文件夹], 退出签到");
      return false;
    }
  };
}

SignRunner.prototype = Object.create(BaseSignRunner.prototype);
SignRunner.prototype.constructor = SignRunner;
module.exports = new SignRunner();