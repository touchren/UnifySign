"ui";
ui.layout(
  <frame gravity="center_vertical">
    <vertical id="main" visibility="visible">
      <button gravity="left" w="100" h="auto" text="靠左的文字" />
      <img w="*" id="img" h="40" gravity="right" />
      <button gravity="left" w="100" h="auto" text="靠左的文字" />
      <img w="*" id="img1" h="40" gravity="right" />
    </vertical>
  </frame>
);
let configDataPath =
  engines.myEngine().cwd() + "/UnifySign/config_data/dingdong/";

let pics = [
  "mine_base64",
  "fishpond_can_collect",
  "fishpond_check",
  "fishpond_close",
  "fishpond_close_continuous_sign",
  "fishpond_close_daily_collect",
  "fishpond_close_daily_collect",
  "fishpond_daily_collect",
  "fishpond_continuous_sign",
  "fishpond_do_continuous_sign",
  "fishpond_entry",
  "fishpond_normal_collect",
  "orchard_can_collect",
  "orchard_check",
  "orchard_daily_collect",
  "orchard_entry",
  "orchard_normal_collect",
];
pics.forEach((pic, index) => {
  // pic = "mine_base64";
  // data:image/png;base64,
  let ret = files.read(configDataPath + pic + ".data");
  var img = images.fromBase64(ret);
  images.save(img, configDataPath + pic + ".png", "png", 100);
  ui.run(() => {
    var Path = configDataPath + pic + ".png";
    log(android.net.Uri.fromFile(new java.io.File(Path)));
    ui.img.setImageURI(android.net.Uri.fromFile(new java.io.File(Path)));
  });
  img.recycle();
});
