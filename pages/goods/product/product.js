// pages/product/product.js
// pages/cart/cart.js
const {
  $Toast
} = require('../../../dist/base/index');
import api from '../../../utils/api.js'
const app = getApp();
const throttle = app.throttle;
// import { finished } from 'stream';
const {
  getshops
} = api
Page({

  /** 
   * 页面的初始数据 
   *  
   */
  data: {
    navigateHide: false,
    ishide: false,
    nodetop: '',
    savigationNum: 1,
    eventCoupon: [],
    eventActivity: [],
    isEventList:[],
    statusBarHeight: '',
    isKide: '',
    isDesc: '1',
    isShopTagUp: false,
    productTimesHide: true,
    activitiesUndertaken: '',
    spellMore: false,
    groupId: '',
    onGroupCartShow: false,
    totalCount: '0',
    bottomSwitch: false,
    goodsId: '',
    toTheTop: false,
    imgList: '',
    mystatus:0,
    isBottom:false,
    textbox: [{
      title: '1、下单后多久能发货？',
      die: '下单成功后，我们会在12个小时内对用户所订购的商品、邮寄地址、款项支付等信息进行核对，一般在2~3个工作日内将包裹发出（周末和法定节假日顺延）'
    }, {
      title: '2、平台商品的价格含税吗？',
      die: '不含税。如需要开具发票，需另外支付税费。'
    }, {
      title: '3、平台使用什么物流配送方式，能否自选物流？',
      die: '通常包裹20公斤以上发物流，其它发快递，详细情况请咨询客服目前暂时不提供自选物流的服务，我们会根订单中的收货地址和商品种类选择最合适的物流公司进行配送。'
    }, {
      title: '4、商品验货与签收需要注意什么？',
      die: '小美诚品保证出货时货物外包装的完好无缺，为了保证客户的利益，请在收到货物时务必验货，请拆开包装箱，确认货品完好无损后再签收。如果发现货物在运输途中有破损，顾客有权拒收，在快递单上写明拒收原因，请配送人员退回。若发现商品错发、漏发，请在签收24小时内联系客服处理，超过24小时，小美诚品概不负责。'
    }, {
      title: '5、退换货产生的运费由谁负责？',
      die: '因商品质量问题、第三方物流及小美诚品本身的原因产生的退换，运费由小美诚品承担注；不支持货到付款业务，请顾客先垫付运费，到货验证商品后，小美诚品将以现金形式为用户报销运费；如果是未经确认而擅自退回的商品，该退货申请将不被受理。'
    }, ],
    arr: [{
      name: '物料',
      url: '/images/tag_wuliao@2x.png',
      width: '48',
      height: '28'
    }, {
      name: '套餐',
      url: '/images/tag_taocan@2x.png',
      width: '48',
      height: '28'
    }, {
      name: '满减',
      url: '/images/tag_manjian@2x.png',
      width: '48',
      height: '28'
    }, {
      name: '满赠',
      url: '/images/tag_manzeng@2x.png',
      width: '48',
      height: '28'
    }],
    videoBoolern: true,
  },

  /** 
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {

    let goodsId = '';
    let userRank = '';
    const scene = decodeURIComponent(options.scene);
    if (scene == 'undefined') {
      goodsId = options.goodsId
    } else {
      var splitArr = scene.split('=');
      goodsId = splitArr[1]
    }
    if (options.userRank) {
      userRank = options.userRank
    }

    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo && app.globalData.userInfo.version
    getshops({
      goodsId,
      userRank: userRank,
    }).then(res => {
      if (res.code == 1) {
        var pages = getCurrentPages()
        if (pages.length > 1) {
          $Toast({
            content: res.msg
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 2 // 返回上一级页面。 
            })
          }, 1000)
        } else {
          $Toast({
            content: res.msg,
          });
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }, 1000);

        }

      } else {
        var imgList = res.data.gallery;
        // if (res.data.videoFace) {
        //   res.data.gallery.src.unshift(res.data.videoFace);
        // }
        var groupList = [];
        if (res.data.status.isGroupShopping) {
          if (res.data.groupShoppingInfo.groupList.length > 0) {
            res.data.groupShoppingInfo.groupList.forEach(element => {
              if (element.needNum > 0) {
                groupList.push(element)
              }
            })
          }
        }
        // 更多拼团
        let groupListMore = []

        if (res.data.status.isGroupShopping) {
          res.data.objectPrice = app.segmentationPrice(String(res.data.actPrice))
        } else {
          res.data.objectPrice = app.segmentationPrice(res.data.price)
        }
        let eventCoupon = [];
        let eventActivity = [];
        let isEventList=[];
        if (res.data.eventList.length > 0) {
          res.data.eventList.forEach(item => {
            if (item.type == '优惠券') {
              eventCoupon.push(item)
            } else {
              eventActivity.push(item);
              isEventList.push(item)
            }
          })
        }
        if (res.data.activityInfo.length > 0) {
          res.data.activityInfo.forEach(item => {
            if (item.tag == '套餐') {
              let list = {};
              list.type = item.tag;
              list.tag = item.tag;
              list.title = item.title;
              list.desc = item.desc;
              list.goodsList = item.goodsList;
              eventActivity.push(list);
              isEventList.push(item);
            }
          })
        }
        this.setData({
          ...res.data,
          ...options,
          groupList,
          groupListMore,
          imgHead: imgHead,
          version: version,
          eventCoupon,
          eventActivity,
          imgList,
          isEventList,
          list: imgHead + 'details/list.png?version=' + version,
        }, () => {
          this.setData({
            isLoading: 1,
            totalCount: app.globalData.totalCount
          });
          this.headers(res.data.status);
          const query = wx.createSelectorQuery();
          query.select('#details').boundingClientRect();
          query.exec((res) => {
            this.setData({
              nodetop: res[0] && res[0].top - 64, // #the-id节点的上边界坐标 
              isBottom:true,
            })
          });

        });

      }
    });
  },

  /** 
   * 生命周期函数--监听页面初次渲染完成 
   */
  onReady: function () {

  },
  onChangeVideo(e) {
    this.setData({
      videoBoolern: e.detail.isVideo
    })
  },
  /** 
   * 生命周期函数--监听页面显示 
   */
  onShow: function () {
    wx.getSystemInfo({
      success: (res) => {

        this.setData({
          statusBarHeight: res.statusBarHeight * 2,
          productTimesHide: true,
        })
      }
    })

  },
  midad() {
    wx.navigateTo({
      url: '/pages/webView/webView?text=正品保障' + '&id=176',
    })
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
  goPreviousPage: throttle(function (e) {

    var pages = getCurrentPages()
    if (pages.length > 1) {
      wx.navigateBack({
        delta: 1 // 返回上一级页面。 
      })
    } else {
      wx.reLaunch({
        url: '/pages/index/index'
      })
    }
  }),
  move() {
    return false;
  },
  isSpellRules: throttle(function (e) {
    this.setData({
      spellMore: true,
    })
  }),
  confirmSpell() {
    this.setData({
      spellMore: false,
    })
  },
  onGroupCart(e) {
    if (e.detail) {
      this.setData({
        groupId: e.detail.groupId,
      })
    }
    this.setData({
      onGroupCartShow: true,
    })
  },
  ongroupCartHide() {
    this.setData({
      onGroupCartShow: false,
      groupId: '',
    })
  },
  onevokeAddCart(e) {
    var that = this;
    app.onevokeAddCart(that, e)
  },
  onhideCart(e) {
    this.setData({
      totalCount: app.globalData.totalCount,
      bottomSwitch: false,
    })
    var that = this
    app.onhideCart(that, e)
  },
  isMaxShow(e) {
    var img = e.currentTarget.dataset.img || '';
    var imgs = e.currentTarget.dataset.imgs || [];
    wx.previewImage({
      current: img, // 当前显示图片的http链接 
      urls: imgs // 需要预览的图片http链接列表 
    })
  },
  midad(e) {
    var url = e.currentTarget.dataset.url
    if (url) {
      wx.navigateTo({
        url: url
      })
    }
  },
  ontoUpImgs() {
    app.handleJumpToTop();
  },
  // 显示头部 
  headers(e) {
    //vip 1 秒杀 2 巨划算3 巨划算预热 4 套餐5 拼团预热 6 拼团 7 普通价格8
    // 活动叠加时，计算顺序：秒杀>巨划算>拼团>直降
    if (e && e.isVip) {
      this.setData({
        mystatus: 1,
        activitiesUndertaken: this.data.imgHead + 'details/img_vip_shopping.png?version=' + this.data.version,
      })
    } else if (e && e.isFlashSale) {

      this.setData({
        mystatus: 2,
        activitiesUndertaken: this.data.imgHead + 'details/img_miaosha.png?version=' + this.data.version,
        iconActivity: this.data.imgHead + 'details/icon_miaosha.png?version=' + this.data.version,
      })
    } else if (e && e.isJuHuaSuan) {
      this.setData({
        mystatus: 3,
        activitiesUndertaken: this.data.imgHead + 'details/icon_item_huasuan.png?version=' + this.data.version,
        iconActivity: this.data.imgHead + 'details/icon_huasuan.png?version=' + this.data.version,
      })
    } else if (e && e.isGroupShopping) {
      this.setData({
        mystatus: 7,
        activitiesUndertaken: this.data.imgHead + 'details/img_pintuan.png?version=' + this.data.version,
        iconActivity: this.data.imgHead + 'details/icon_pintuan.png?version=' + this.data.version,
        isDesc: this.data.groupShoppingInfo.ruleText
      })
    } else if (e && e.isSuperPkg) {
      this.setData({
        mystatus: 5,
        activitiesUndertaken: this.data.imgHead + 'details/img_taocan.png?version=' + this.data.version,
      })
    } else if (e && e.isNotStartJuhuasuan) {
      this.setData({
        mystatus: 4,
        activitiesUndertaken: this.data.imgHead + 'details/img_pintuan.png?version=' + this.data.version,
        iconActivity: this.data.imgHead + 'details/icon_huasuan.png?version=' + this.data.version,
      })
    } else if (e && e.isNotStartGroupShopping) {
      this.setData({
        mystatus: 6,
        activitiesUndertaken: this.data.imgHead + 'details/img_pintuan_yure.png?version=' + this.data.version,
      })
    } else {
      this.setData({
        mystatus: 8,
      })
    }
  },
  shopTagUp(e) {
    this.setData({
      isShopTagUp: true,
      isKide: e.currentTarget.dataset.kind,
      isDesc: e.currentTarget.dataset.istext
    }, () => {
      this.selectComponent("#shopTagUp").unConfirm();
    })
  },
  shopTagUpTwo(e) {
    this.setData({
      isShopTagUp: true,
      isKide: "activity",
    }, () => {
      this.selectComponent("#shopTagUp").unConfirm();
    })
  },
  onshopTagUp() {
    this.setData({
      isShopTagUp: false
    })
  },
  goDownload() {
    wx.navigateTo({
      url: '/pages/goods/goDownload/goDownload?title=' + this.data.goodsName + '&desc=' + this.data.goodsBrief + '&imgList=' + JSON.stringify(this.data.imgList)
    })
  },
  goRanking(e) {
    wx.navigateTo({
      url: '/pages/homePage/rankingDetail/rankingDetail?id=' + e.currentTarget.dataset.item.floorId
    })
  },
  /** 
   * 生命周期函数--监听页面隐藏 
   */
  onHide: function () {
    this.setData({
      productTimesHide: false,
    })
  },

  /** 
   * 生命周期函数--监听页面卸载 
   */
  onUnload: function () {

  },
  onPageScroll(e) {
    if (e.scrollTop >= 294) {
      this.setData({
        navigateHide: true
      })
    } else {
      this.setData({
        navigateHide: false
      })
    }
    var that = this;
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      if (this.data.mystatus == 8 && this.data.groupShoppingInfo.groupList[0].groupId) {
        return {
          title: this.data.goodsName && this.data.goodsName,
          path: '/pages/goods/spellDetails/spellDetails?groupId' + this.data.groupShoppingInfo.groupList[0].groupId,
        
        }
      } else {
        return {
          title: this.data.goodsName && this.data.goodsName,
        }
      }
    } else {
      if (this.data.mystatus == 8 && this.data.groupShoppingInfo.groupList[0].groupId) {
        return {
          title: this.data.goodsName && this.data.goodsName,
          path: '/pages/goods/spellDetails/spellDetails?groupId' + this.data.groupShoppingInfo.groupList[0].groupId,
        }
      } else {
        return {
          title: this.data.goodsName && this.data.goodsName,
        }
      }
    }
  }
})