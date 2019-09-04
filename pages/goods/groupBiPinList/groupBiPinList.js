// pages/groupBiPinList/groupBiPinList.js
import api from '../../../utils/api.js'
const {
  groupShoppingHotList
} = api
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNoGoods: false,
    type: 1,
    page: 1,
    pageSize: 10,
    totalCount: '',
    time: '',
    goodsList: [],
    toTheTop: false,
    requestLock: false,
    isLoading: false,
    groupBiPinListTime: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let page = +this.data.page
    this.getGoodsList(page);
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo && app.globalData.userInfo.version
    this.setData({
      img_pin: imgHead + 'groupBuying/img_pin.png?version=' + version,
      img_yuji: imgHead + 'groupBuying/img_yuji.png?version=' + version,
      groupBiPinListTime: true,
    })
  },
  ontoUpImgs() {
    app.handleJumpToTop();
  },
  goProduct(e) {
    app.appProduct(e.currentTarget.dataset.goodsid)
  },
  handleChangeTabs(e) {
    let type = e.currentTarget.dataset.index
    this.setData({
      type,
      page: 1,
      requestLock: false,
      goodsList: [],
      time: '',
    })
    this.getGoodsList(1)
  },
  getGoodsList(page) {
    if (!this.data.requestLock) {

      this.data.requestLock = true
      let pageSize = +this.data.pageSize
      let type = this.data.type
      let allData = this.data.goodsList
      this.setData({
        isLoading: page > 1 ? true : false
      })
      groupShoppingHotList({
        type,
        pageSize,
        page
      }).then(res => {
        if (res.code == 0) {
          this.setData({
            isNoGoods: false
          })
        } else {
          this.setData({
            isNoGoods: true
          })
        }
        allData = allData.concat([], ...res.data.list.goodsList);
        allData.forEach(element => {
          element.objectPrice = app.segmentationPrice(String(element.price))
        });
        if (res.data.list.goodsList.length < pageSize) {
          this.setData({
            goodsList: allData,
            page,
            requestLock: true,
            reachTheBottom: true,
            isLoading: false,
          })
        } else {
          this.setData({
            goodsList: allData,
            page,
            requestLock: false,
            isLoading: true,
          })
        }
        this.setData({
          totalCount: res.data.totalCount,
          time: res.data.list.time
        })
      }).catch(res => {
        this.setData({
          requestLock: false,
          isLoading: false,
          reacquire: false
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      groupBiPinListTime: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  onPageScroll(e) {
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
    let page = +this.data.page + 1
    this.getGoodsList(page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})