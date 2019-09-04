// pages/integral/intergralProduct/intergralProduct.js
import api from '../../../../utils/api.js'
const {
  getshops
} = api;
const app = getApp()
const throttle = app.throttle
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: '',
    detailsTxtView: '',
    toTheTop: false,
    nodetop: '', //节点坐标
    scrollTop: 0,
    heights: '',
    savigationNum: 1,
    ishide: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        let clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        this.setData({
          heights: calc
        })
      }
    });
    getshops({
      ...options,
    }).then(res => {
      res.data.price = parseInt(res.data.price);
      this.setData({
        ...res.data,
      }, () => {
        //创建节点选择器
        var that = this
        const query = wx.createSelectorQuery()
        //选择节点
        query.select('#details').boundingClientRect()
        query.exec(function (res) {
          that.setData({
            nodetop: res[0].top, // #the-id节点的上边界坐标
          })

        });
      });
    });
  },
  goPreviousPage: throttle(function (e) {
    wx.navigateBack({
      delta: 2
    })
  }),
  ontoUpImgs() {
    this.setData({
      savigationNum: '1',
      scrollTop: this.data.scrollTop,
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    })
  },


  tapMove() {
  
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    })
  },
  shopadd(e) {
    this.selectComponent('.Integralshopping').onConfirm()
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
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          statusBarHeight: res.statusBarHeight * 2,
         
        })
      }
    })
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {
      app.userType()
      return false
    }
  },
  handleClick(e) {
    this.setData({
      savigationNum: e.currentTarget.dataset.index
    }, () => {
      if (e.currentTarget.dataset.index == 1) {
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
      } else {
        wx.pageScrollTo({
          scrollTop: this.data.nodetop,
          duration: 0
        })
      }
    })
  },
  onPageScroll(e) {
    var that = this
    app.scrollRolling(that, e.scrollTop)
    if (e.scrollTop >= this.data.nodetop) {
      if (this.data.ishide) {
        return false;
      } else {
        this.setData({
          savigationNum: '2',
          ishide: true,
        })
      }
    } else {
      if (this.data.ishide) {
        this.setData({
          savigationNum: '1',
          ishide: false,
        })
      } else {
        return false;
      }
    }
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