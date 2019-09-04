// pages/accredit/accredit.js
const {
  $Toast
} = require('../../dist/base/index');
import api from '../../utils/api.js'
const {
  getuser,
  autoLogin
} = api
const app = getApp()
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    code: '',
    access_token: ''
  },
  onLoad: function () {
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo.version
    this.setData({
      img_photo: imgHead + 'img_photo@2x.png?version=' + version,

    })

  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      wx.login({
        success: (res) => {
          app.globalData.userInfo = {
            ...app.globalData.userInfo,
            ...e.detail.userInfo
          };
          var code = res.code
          this.setData({
            code
          })
          autoLogin({
            code
          }).then(res => {
            if (res.code == 0) {
              wx.setStorageSync('Authorization', res.data.access_token)
              app.globalData.userInfo = res.data;
              wx.reLaunch({
                url: '/pages/index/index'
              })
            } else {
              wx.navigateTo({
                url: '/pages/login/login'
              })
            }
          }).catch(res => {
            return false;
          })
        },

      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {}
        }
      })
    }
  },



  //获取用户信息接口
  queryUsreInfo: function () {
    getuser().then(res => {
      if (!res.data.nickName) {
        res.data.nickName = app.globalData.userInfo.nickName
      }
      this.setData({
        ...res.data
      })
      if (res.code == 0) {
        app.globalData.userInfo = {
          ...app.globalData.userInfo,
          ...res.data
        };
        wx.reLaunch({
          url: '/pages/index/index'
        })
      } else {
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }
    }).catch(res => {
      return false
    })
  },
  onShow() {
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {
      app.userType()
      return false
    }
  },
})