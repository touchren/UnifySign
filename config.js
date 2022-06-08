/*
 * @Author: TonyJiangWJ
 * @Date: 2019-12-09 20:42:08
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-12-26 11:56:26
 * @Description: 
 */
let currentEngine = engines.myEngine().getSource() + ''
let isRunningMode = currentEngine.endsWith('/config.js') && typeof module === 'undefined'
let is_pro = !!Object.prototype.toString.call(com.stardust.autojs.core.timing.TimedTask.Companion).match(/Java(Class|Object)/)
let default_config = {
  password: '',
  timeout_unlock: 1000,
  timeout_findOne: 1000,
  timeout_existing: 8000,
  // 异步等待截图，当截图超时后重新获取截图 默认开启
  async_waiting_capture: true,
  capture_waiting_time: 500,
  show_debug_log: true,
  show_engine_id: false,
  develop_mode: false,
  develop_saving_mode: false,
  enable_visual_helper: false,
  check_device_posture: false,
  check_distance: false,
  posture_threshold_z: 6,
  // 电量保护，低于该值延迟60分钟执行脚本
  battery_keep_threshold: 20,
  auto_lock: false,
  lock_x: 150,
  lock_y: 970,
  // 是否根据当前锁屏状态来设置屏幕亮度，当锁屏状态下启动时 设置为最低亮度，结束后设置成自动亮度
  auto_set_brightness: false,
  // 锁屏启动关闭提示框
  dismiss_dialog_if_locked: true,
  request_capture_permission: true,
  not_lingering_float_window: true,
  capture_permission_button: 'START NOW|立即开始|允许',
  // 是否保存日志文件，如果设置为保存，则日志文件会按时间分片备份在logback/文件夹下
  save_log_file: true,
  async_save_log_file: true,
  back_size: '100',
  // 控制台最大日志长度，仅免费版有用
  console_log_maximum_size: 1500,
  // 通话状态监听
  enable_call_state_control: false,
  // 单脚本模式 是否只运行一个脚本 不会同时使用其他的 开启单脚本模式 会取消任务队列的功能。
  // 比如同时使用蚂蚁庄园 则保持默认 false 否则设置为true 无视其他运行中的脚本
  single_script: false,
  auto_restart_when_crashed: false,
  // 是否使用模拟的滑动，如果滑动有问题开启这个 当前默认关闭 经常有人手机上有虚拟按键 然后又不看文档注释的
  useCustomScrollDown: true,
  // 排行榜列表下滑速度 200毫秒 不要太低否则滑动不生效 仅仅针对useCustomScrollDown=true的情况
  scrollDownSpeed: 200,
  bottomHeight: 200,
  // 当以下包正在前台运行时，延迟执行
  skip_running_packages: [],
  warn_skipped_ignore_package: false,
  warn_skipped_too_much: false,
  auto_check_update: true,
  github_url: 'https://github.com/TonyJiangWJ/Unify-Sign',
  // github release url 用于检测更新状态
  github_latest_url: 'https://api.github.com/repos/TonyJiangWJ/Unify-Sign/releases/latest',
  killAppWithGesture: true,
  // 延迟启动时延 5秒 悬浮窗中进行的倒计时时间
  delayStartTime: 5,
  device_width: device.width,
  device_height: device.height,
  // 是否是AutoJS Pro  需要屏蔽部分功能，暂时无法实现：生命周期监听等 包括通话监听
  is_pro: is_pro,
  auto_set_bang_offset: true,
  bang_offset: 0,
  thread_name_prefix: 'unify_sign_',
  // 标记是否清除webview缓存
  clear_webview_cache: false,
  supported_signs: [
    {
      name: '蚂蚁积分签到',
      script: 'AntCredits.js',
      enabled: true
    },
    {
      name: '全家签到',
      script: 'Fami.js',
      enabled: true
    },
    {
      name: '京东签到',
      script: 'JingDongBeans.js',
      enabled: true
    },
    {
      name: '米游社-原神签到',
      script: 'MiHoYou.js',
      enabled: true
    },
    {
      name: '淘金币签到',
      script: 'Taobao-Coin.js',
      enabled: true
    },
    {
      name: '叮咚签到',
      script: 'DingDong.js',
      enabled: true
    },
    {
      name: '微博积分签到',
      script: 'Weibo.js',
      enabled: true
    },
    {
      name: '浦发公众号-每日打卡',
      script: 'PuFaWechat.js',
      enabled: true
    }
  ]
}
// 不同项目需要设置不同的storageName，不然会导致配置信息混乱
let CONFIG_STORAGE_NAME = 'unify_sign'
let PROJECT_NAME = '聚合签到'
let config = {}
let storageConfig = storages.create(CONFIG_STORAGE_NAME)
let securityFields = ['password', 'alipay_lock_password']
let AesUtil = require('./lib/AesUtil.js')
let aesKey = device.getAndroidId()
Object.keys(default_config).forEach(key => {
  let storedVal = storageConfig.get(key)
  if (typeof storedVal !== 'undefined') {
    if (key === 'supported_signs') {
      let stored = JSON.parse(JSON.stringify(storageConfig.get(key)))
      config[key] = default_config[key]
      config[key].forEach(sign => {
        let match = stored.filter(s => s.name === sign.name)
        if (match && match.length > 0) {
          sign.enabled = match[0].enabled
        }
      })
    } else {
      if (securityFields.indexOf(key) > -1) {
        storedVal = AesUtil.decrypt(storedVal, aesKey) || storedVal
      }
      config[key] = storedVal
    }
  } else {
    config[key] = default_config[key]
  }
})

config.scaleRate = (() => {
  let width = config.device_width
  if (width >= 1440) {
    return 1440 / 1080
  } else if (width < 1000) {
    return 720 / 1080
  } else {
    return 1
  }
})()

// 覆写配置信息
config.overwrite = (key, value) => {
  let storage_name = CONFIG_STORAGE_NAME
  let config_key = key
  if (key.indexOf('.') > -1) {
    let keyPair = key.split('.')
    storage_name = CONFIG_STORAGE_NAME + '_' + keyPair[0]
    key = keyPair[1]
    config_key = keyPair[0] + '_config'
    if (!config.hasOwnProperty(config_key) || !config[config_key].hasOwnProperty(key)) {
      return
    }
    config[config_key][key] = value
  } else {
    if (!config.hasOwnProperty(config_key)) {
      return
    }
    config[config_key] = value
  }
  console.verbose('覆写配置', storage_name, key)
  storages.create(storage_name).put(key, value)
}
// 扩展配置
let workpath = getCurrentWorkPath()
let configDataPath = workpath + '/config_data/'
// 叮咚识图配置
let default_dingdong_config = {
  mine_base64: files.read(configDataPath + 'dingdong/mine_base64.data'),
  fishpond_entry: files.read(configDataPath + 'dingdong/fishpond_entry.data'),
  fishpond_check: files.read(configDataPath + 'dingdong/fishpond_check.data'),
  fishpond_can_collect: files.read(configDataPath + 'dingdong/fishpond_can_collect.data'),
  fishpond_daily_collect: files.read(configDataPath + 'dingdong/fishpond_daily_collect.data'),
  fishpond_normal_collect: files.read(configDataPath + 'dingdong/fishpond_normal_collect.data'),
  fishpond_continuous_sign: files.read(configDataPath + 'dingdong/fishpond_continuous_sign.data'),
  fishpond_do_continuous_sign: files.read(configDataPath + 'dingdong/fishpond_do_continuous_sign.data'),
  fishpond_close_continuous_sign: files.read(configDataPath + 'dingdong/fishpond_close_continuous_sign.data'),
  fishpond_close: files.read(configDataPath + 'dingdong/fishpond_close.data'),
  orchard_entry: files.read(configDataPath + 'dingdong/orchard_entry.data'),
  orchard_can_collect: files.read(configDataPath + 'dingdong/orchard_can_collect.data'),
  orchard_daily_collect: files.read(configDataPath + 'dingdong/orchard_daily_collect.data'),
  orchard_normal_collect: files.read(configDataPath + 'dingdong/orchard_normal_collect.data'),
  orchard_check: files.read(configDataPath + 'dingdong/orchard_check.data'),
  subTasks: {
    CREDIT_SIGN: '积分签到',
    FISHPOND: '鱼塘签到',
    ORCHARD: '叮咚果园'
  }
}
default_config.dingdong_config = default_dingdong_config
config.dingdong_config = convertDefaultData(default_dingdong_config, CONFIG_STORAGE_NAME + '_dingdong')

if (!isRunningMode) {
  module.exports = function (__runtime__, scope) {
    if (typeof scope.config_instance === 'undefined') {
      scope.config_instance = {
        config: config,
        default_config: default_config,
        securityFields: securityFields,
        storage_name: CONFIG_STORAGE_NAME,
        project_name: PROJECT_NAME
      }
    }
    return scope.config_instance
  }
} else {
  setTimeout(function () {
    engines.execScriptFile(files.cwd() + "/可视化配置.js", { path: files.cwd() })
  }, 30)
}

function convertDefaultData(default_config, config_storage_name) {
  let config_storage = storages.create(config_storage_name)
  let configData = {}
  Object.keys(default_config).forEach(key => {
    let storageValue = config_storage.get(key, default_config[key])
    if (storageValue == '') {
      storageValue = default_config[key]
    }
    configData[key] = storageValue
  })
  return configData
}

function getCurrentWorkPath() {
  let currentPath = files.cwd()
  if (files.exists(currentPath + '/main.js')) {
    return currentPath
  }
  let paths = currentPath.split('/')

  do {
    paths = paths.slice(0, paths.length - 1)
    currentPath = paths.reduce((a, b) => a += '/' + b)
  } while (!files.exists(currentPath + '/main.js') && paths.length > 0)
  if (paths.length > 0) {
    return currentPath
  }
}
