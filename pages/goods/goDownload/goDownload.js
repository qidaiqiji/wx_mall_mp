// pages/goods/goDownload/goDownload.js
const {
  $Toast
} = require('../../../dist/base/index');
const app = getApp();
const throttle = app.throttle;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgarr: [],
    isBoolean: false,
    isBackgroundColor: false,
    isSettingShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let arr = []
    if (options.imgList) {
      var imgObject = [];
      imgObject = JSON.parse(options.imgList).src;
      imgObject.forEach(item => {
        let arrList = {}
        arrList.src = item;
        arrList.isSelect = false;
        arr.push(arrList)
      })
    }
    this.setData({
      ...options,
      arr,
    })
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
  isAll: throttle(function () {
    let arr = this.data.arr
    if (this.data.isBoolean) {
      arr.map((item, isIndex) => {
        item.isSelect = false;
      })
    } else {
      arr.map((item, isIndex) => {
        item.isSelect = true;
      })
    }
    this.setData({
      arr,
      isBoolean: !this.data.isBoolean,
      isBackgroundColor: !this.data.isBoolean,
    })
  }),
  goSelect(e) {
    var numberArr = []
    var isSelect = e.currentTarget.dataset.isselect;
    var index = e.currentTarget.dataset.index;
    var arr = this.data.arr;
    arr.map((item, isIndex) => {
      if (isIndex == index) {
        item.isSelect = !isSelect
      }
    })
    arr.forEach(element => {
      if (element.isSelect) {
        numberArr.push('1')
      }
    });
    let isBoolean = numberArr.length == arr.length ? true : false;
    this.setData({
      arr,
      isBoolean,
      isBackgroundColor: numberArr.length > 0 ? true : false,
    })
  },
  copyText(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {

          }
        })
      }
    })
  },
  goDownloadSaveFiles() {
    var imgarr = this.data.arr;
    let arr = []
    imgarr.forEach(element => {
      let that = this;
      if (element.isSelect) {
        var url = element.src;
        wx.getImageInfo({
          src: url,
          success(sres) {
            wx.getSetting({
              success(res) {
                if (res.authSetting['scope.writePhotosAlbum']) {
                  wx.saveImageToPhotosAlbum({
                    filePath: sres.path,
                    success(res) {
                      arr.push('1')
                    },
                    fail() {
                      console.log('保存失败')
                    }
                  })
                } else {
                  wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success(isSet) {
                      console.log(isSet, '授权')

                      wx.saveImageToPhotosAlbum({
                        filePath: sres.path,
                        success(res) {
                          arr.push('1')
                        },
                        fail() {
                          console.log('保存失败')
                        }
                      })
                    },
                    fail(isSetNot) {
                      console.log(isSetNot, '保存失败')
                      that.setData({
                        isSettingShow: true
                      })
                    }
                  })

                }
              }
            })
          },
          fail(res) {
            console.log(res, '下载失败')
          }
        })
      }
    });
    if (arr.length > 0) {
      let isArr = arr.every(item => {
        return item == 1
      })
      if (isArr) {
        $Toast({
          content: '下载成功'
        });
      } else {
        console.log('下载失败')
      }
    }

  },
  isConfirm() {
    this.setData({
      isSettingShow: false
    })

  },
  callback: function (e) {
    let that = this;
    wx.openSetting({
      success(res) {
        that.setData({
          isSettingShow: false
        })
      },
      fail(res) {
        that.setData({
          isSettingShow: false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})