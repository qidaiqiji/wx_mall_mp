// components/titleContent/index.js.js
const app = getApp()
const throttle = app.throttle
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {},
      observer: function (newData, oldData) {
        if (newData != oldData && newData !== '') {
          this._getdate(newData)
        }
      }
    },
    flashSaleDate: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    _getdate(newData) {
      this.setData({
        data:newData
      })
    },
    handleTitleJump: throttle(function (e) {
      console.log("eee",e.currentTarget.dataset.link)
      wx.navigateTo({
        url: e.currentTarget.dataset.link
      })
    }),
  }
})
