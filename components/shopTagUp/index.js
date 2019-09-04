// components/shopTagUp/index.js
var WxParse = require('../../utils/wxParse/wxParse.js');
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    kide: String,
    desc: {
      type: String,
      value: '',
      observer: function (newData, oldData) {
        if (newData !== null) {
          this._desc(newData)
        }
      }
    },
    isEventList: {
      type: Array,
      value: [],
      observer: function (newData, oldData) {
        if (newData !== null) {
          this._isEventList(newData)
        }
      }
    },
    couponList: {
      type: Array,
      value: [],
      observer: function (newData, oldData) {
        if (newData !== null) {
          this._couponList(newData)
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    modalName: '',
    info: {
      type: Object,
      value: {},
      observer: '_getInfo'
    },
    kind: ''
  },
  ready() {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    _couponList(newData) {
      this.setData({
        couponList: newData,
      }, () => {
        this.setData({
          modalName: 'goup'
        })
      })
    },
    _isEventList(newData) {
      this.setData({
        isEventList: newData,
      }, () => {
        this.setData({
          modalName: 'goup'
        })
      })
    },
    _desc(newData) {
      var that = this;
      var desc = newData;
      WxParse.wxParse('article', 'html', desc, that, 5);
    },
    _getInfo() {},
    unConfirm(e) {
      var that = this;

    },
    onConfirm: function (e) {
      this.triggerEvent('shopTagUp')
      this.setData({
        modalName: ''
      })
    },
    move() {
      return false;
    },
    goshop(e) {
      var goodsId = e.currentTarget.dataset.goodsid;
      var tag = e.currentTarget.dataset.tag;
      if (tag == '套餐') {
        app.appProduct(goodsId)
      }
    },
  }
})