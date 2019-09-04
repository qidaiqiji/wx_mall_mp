// components/homeSeperateGoods/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {},
      observer: function (newData, oldData) {
        this._updateData(newData)
      }
    },
    title:{
      type: String,
      value: '',
    },
    subTitleColor:{
      type: String,
      value: '',
    },
    subType:{
      type: String,
      value: '',
    },
    isAutoplay:{
      type: Boolean,
    }

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
    _updateData(newData,type){
      this.setData({
        data:newData
      })
    }
  }
})
