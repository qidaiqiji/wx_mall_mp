// components/product_b/pro_bottom/index.js
const app = getApp();
const throttle = app.throttle;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mystatus: Number,
    spellDetailsHide: Boolean,
    actPrice: String,
    price: {
      type: String,
      value: '',
      observer: function (newData, oldData) {
        this._price(newData)
      }
    },
    spellBottom: {
      type: String,
      value: '100',
      observer: function (newData, oldData) {
        this._spellBottom(newData)
      }
    },
    groupInfo: Object,
    brandId: String,
    goodsId: String,
    addCartList: Object,
    totalCount: {
      type: String,
      value: {},
      observer: function (newData, oldData) {
        this._totalCount(newData)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isSpell: 1,

  },
  ready(){
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _price(newData) {
      this.setData({
        price: newData,
      })
    },
    _spellBottom(newData) {
      this.setData({
        spellBottom: newData,
      })
    },
    _totalCount(newData) {
      if (newData >= 100) {
        this.setData({
          totalCount: "99+"
        })
      } else {
        this.setData({
          totalCount: newData
        })
      };

    },

    myup: function (e) {
      wx.switchTab({
        url: '/pages/index/index'
      })
    },
    gouwuup() {
      wx.switchTab({
        url: '/pages/cart/cart'
      })
    },
    brandDetail(e) {
      var brandId = this.properties.brandId

      wx.navigateTo({
        url: '/pages/goods/brandDetail/brandDetail?brandId=' + brandId,
      })
    },
    handleToBuy(e) {
      this.triggerEvent('evokeAddCart', {
        isPopCart: true,
        addGoodsId: e.currentTarget.dataset.goodsid,
        addGoodslist: e.currentTarget.dataset.goodslist,
        isSpell: e.currentTarget.dataset.isspell || '',
        groupId: e.currentTarget.dataset.groupid || '',
      })

    },
    handleToSpell(e) {
      this.triggerEvent('evokeAddCart', {
        isPopCart: true,
        bottomSwitch: true,
        addGoodsId: e.currentTarget.dataset.goodsid,
        addGoodslist: e.currentTarget.dataset.goodslist,
        isSpell: e.currentTarget.dataset.isspell || '',
        groupId: e.currentTarget.dataset.groupid || '',
      })
    },
    handleToSpells() {
      this.triggerEvent('groupShoppingCart', )
    }
  },
})