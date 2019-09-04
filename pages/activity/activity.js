// pages/activity/activity.js
const {
  $Toast
} = require('../../dist/base/index');
import api from '../../utils/api.js';
const {
  activityMask,
  goodsList,
  orderGroupLastOrder,
  getActList
} = api
const app = getApp();
const throttle = app.throttle;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPageId: 'div1',
    requestLock: false,
    isLoading: false,
    toTheTop: false,
    wrapColor: '#2D42F7',
    goodsList: [],
    isPopCart: false,
    isActTime: false,
    page: 0,
    pageSize: 10,
    countDownShow: true,
    indextop: true,
    interval: '',
    arr: '',
    indextop: true,
    activityListTwo: [],
    goodsListLive: [],
    setIntervalOne: '',
    animationOne: {},
    animationTwo: {},
    temaiScrollTop: '',
    // 新的参数
    pageId: '',
    adviceGoods: {},
    rootBgColor: "",
    actPageTimesTwo: false,
    bgImgType1: "",
    bgImgType2: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      pageId: options.pageId
    })
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo && app.globalData.userInfo.version
    this.setData({
      manzeng_title: imgHead + 'activity/manzeng_title.png?version=' + version,
      juhuasuan_title: imgHead + 'activity/juhuasuan_title.png?version=' + version,
      will_rob: imgHead + 'activity/will_rob.png?version=' + version,
      miaosha_title: imgHead + 'activity/miaosha_title.png?version=' + version,
      taocan_title: imgHead + 'activity/taocan_title.png?version=' + version,
      temai_title: imgHead + 'activity/temai_title.png?version=' + version,
      will_rob_background: imgHead + 'activity/will_rob_background.png?version='+version,
      soldOutImg: imgHead + 'detail/soldOut.png?version='+version,
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
    this.ongetTotle()
    orderGroupLastOrder().then(res => {
      this.setData({
        ...res.data,
        menus: wx.getStorageSync('menus'),

      }, () => {
        this.indexTopOnUp(this.data.lastOrderList)
      })
    })
    getActList({
      pageId:this.data.pageId,
    }).then(res => {
      let adviceGoods = res.data.adviceGoods;
      let rootBgColor = res.data.bgColor;
      let goodsAdList = res.data.goodsAdList;
      let rightNav = res.data.rightNav;
      let bgImgType1 = `background:${rootBgColor} url(${res.data.bgImg}) repeat`;
      let bgImgType2 = `background:${rootBgColor} url(${res.data.bgImg}) no-repeat`;
      goodsAdList.map(item => {
        if (item.goodsList) {
          item.goodsList.forEach(ele => {
            ele.objectPrice = app.segmentationPrice(ele.goodsInfo.goodsPrice)
          })
        }
        if (item.type == 4) {
          item.goodsList = item.goodsList.slice(0, 5)
        }
        if (item.type == 7) {
          item.titleImgLink = item.titleImgLink ? item.titleImgLink + "?title=2" : ""
        }
        if (item.type == 8) {
          item.titleImgLink = item.titleImgLink ? item.titleImgLink + "?title=1" : ""
        }
      })

      adviceGoods.goodsList.forEach(element => {
        element.objectPrice = app.segmentationPrice(element.goodsInfo.goodsPrice)
      });
      rightNav.moduleList.map((item, index) => {
        item.pageId = item.linkId;
        item.name = item.newTitle;
      })
      let moduleList = rightNav.moduleList.filter(item => item.isChecked)
      wx.setBackgroundColor({
        backgroundColor: res.data.bgColor
      })
      wx.setNavigationBarTitle({
        title: res.data.name,
      })
      this.setData({
        ...res.data,
        rootBgColor,
        adviceGoods,
        goodsAdList,
        rightNav,
        moduleList,
        actPageTimesTwo: true,
        bgImgType1,
        bgImgType2,
      })
    })

    this.getGoodsList(0);
  },
  goAdvertising: throttle(function (e) {
    app.adSpaceJump(e.currentTarget.dataset.item)
  }),
  indexTopOnUp(arr) {
    var indexNumber = arr.length;
    this.setData({
      interval: setInterval(() => {
        if (this.data.indextop) {
          setTimeout(() => {
            this.setData({
              indextop: false
            });
          }, 1500);
          var index = (Math.round(Math.random() * (indexNumber - 1) + 1) - 1);
          this.setData({
            arr: arr[index] || ''
          });
        } else {
          setTimeout(() => {
            this.setData({
              indextop: true,
            });
          }, 1500)
        }
      }, 2000)
    })

  },
  ongetTotle(e) {
    this.setData({
      totalCounts: app.globalData.totalCount
    })
  },
  goIndex() {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  onevokeAddCart(e) {
    var that = this
    app.onevokeAddCart(that, e);
  },
  onhideCart(e) {
    var that = this
    that.setData({
      isPopCart: false
    }, () => {
      this.ongetTotle();
      if (e.detail && e.detail.msg) {
        $Toast({
          content: e.detail.msg
        });
      }

    })
  },
  allremind() {
    this.setData({
      isShowNavigation: true
    })
  },
  onallPreferential() {
    this.setData({
      isShowNavigation: false
    })
  },
  handleMenus(e) {
    let isPageId = e.detail.pageId;
    this.setData({
      isShowNavigation: false,
      isPageId: isPageId,
    }, () => {
      const query = wx.createSelectorQuery();
      const selectedId = "#" + isPageId;
      query.select(selectedId).boundingClientRect()
      query.selectViewport().scrollOffset()
      let scrollTop;
      query.exec(function (res) {
        scrollTop = res[0].top+res[1].scrollTop
        wx.createSelectorQuery().select(selectedId).boundingClientRect(function (rect) {
          wx.pageScrollTo({
            scrollTop: scrollTop,
            duration: 0
          })
        }).exec()
      })
    })
  },
  getGoodsList(page) {
    goodsList({
      page: page,
      pageSize: this.data.pageSize,
    }).then(res => {
      var allData = this.data.goodsListLive;
      allData = allData.concat([], ...res.data.goodsList)
      if (res.data.goodsList.length >= this.data.pageSize) {
        this.setData({
          goodsListLive: allData,
          page,
          requestLock: true,
          isLoading: true,
        })
      } else {
        this.setData({
          goodsListLive: allData,
          page,
          requestLock: false,
          isLoading: false,
        })
      }

    })
  },
  goShop: throttle(function (e) {
    app.appProduct(e.currentTarget.dataset.goodsid)
  }),
  ontoUpImgs() {
    app.handleJumpToTop();
  },
  handleGuideText: throttle(function (e) {
    this.setData({
      isRemindShow: true
    })
  }),
  onMyshow() {
    this.setData({
      isRemindShow: false
    })
  },
  // 新的方法
  handleLinkJump: throttle(function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  }),
  handleJump: throttle(function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.adlink
    })
  }),
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.interval)
    this.setData({
      countDownShow: false,
      goodsList: [],
      page: 0,
      actPageTimesTwo: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  onPageScroll(e) {
    if (e.scrollTop > 550) {
      this.setData({
        isActTime: true
      })
    } else {
      this.setData({
        isActTime: false
      })
    }
    var that = this
    app.scrollRolling(that, e.scrollTop)
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
    if (this.data.requestLock) {
      let page = +this.data.page + 1
      this.getGoodsList(page)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})