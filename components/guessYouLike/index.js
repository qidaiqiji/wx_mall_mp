// components/guessYouLike/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // list:{
    //   type:Array,
    //   value: [],
    //   observer: function (newData, oldData) {
    //     this._goodsList(newData)
    //   }
    // }
    item: {
      type: Object,
      value: {},
      observer: function (newData, oldData) {
        this._goodsList(newData)
      }
    },
    index:{
      type: String,
      observer: function (newData, oldData) {
        this._getIndex(newData)
      }
      
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    soldOutImg:'',

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goDetail(e) {
      let type = e.currentTarget.dataset.type;
      let id = e.currentTarget.dataset.id;
      if (type == 1) {
        wx.navigateTo({
          url: `/pages/goods/product/product?goodsId=${id}`
        });
      } else if (type == 2) {
        wx.navigateTo({
          url: `/pages/homePage/colldetail/colldetail?collId=${id}`
        });
      } else if (type == 3) {
        wx.navigateTo({
          url: `/pages/foundTxt/foundTxt?articleId=${id}`
        });
      }
    },
    _goodsList(newData) {
      const imgHead = app.globalData.imgHead
      const version = app.globalData.userInfo && app.globalData.userInfo.version
      this.setData({
        soldOutImg: imgHead + 'detail/soldOut.png?version='+version,
      },()=>{
        console.log(this.data.soldOutImg)
      })
      this.setData({
        item: newData
      })
    },
    _getIndex(newData) {
      this.setData({
        index: newData
      })
    }
  }
})
