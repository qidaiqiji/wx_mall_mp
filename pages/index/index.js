// pages/goodsLists/goodsLists.js
import api from '../../utils/api.js'
const {
  index,
  goodsList,
  indexAds,
  getuser,
  foundUnread,
  autoLogin,
  getTimeLineList
} = api
const app = getApp()
const throttle = app.throttle
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noLookHide: false,
    actPageTimesTwo: 'actPageTimesTwo',
    indextop: true,
    interval: '',
    addTopTagWrap: true, //顶部添加小程序
    indexWeek: true,
    toTheTop: false,
    goodsList: [],
    pageSize: 12,
    page: 1,
    requestLock: false,
    reachTheBottom: false,
    noLook: true,
    noLookTwo: false,
    isPopCart: false,
    current: 'homepage',
    isLoading: false,
    reacquire: false,
    randomIndex: 0,
    random: false,
    timelineList: [],
    leftTimeLine: [],
    rightTimeLine: [],
    randomInterval: '',
    vipGoodsList: [],
    tagMap: [
      {
        name: 'juhuasuan',
        text: '聚'
      },
      {
        name: 'manzeng',
        text: '赠'
      },
      {
        name: 'zhiJiang',
        text: '直降'
      },
    ],
    miaoshaUrl: '/pages/homePage/miaosha/miaosha',
    juhuasuanUrl: "/pages/homePage/juhuasuan/juhuasuan",
    taocanUrl: "/pages/homePage/anniversary/anniversary?title=2",
    manzengUrl: "/pages/homePage/anniversary/anniversary?title=1",
    pintuanUrl: "/pages/groupBuying/groupBuying",
    newGoodsUrl: "/pages/homePage/xinpin/xinpin",
  },
  addTopTag() {
    this.setData({
      addTopTagWrap: false
    })
  },

  onhideCart(e) {
    var that = this
    app.onhideCart(that, e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#FF3366',
    })
    // 防止用户第一次没取到值报错
    wx.getStorage({
      key: 'appWeek',
      fail: (res) => {
        wx.setStorage({
          key: "appWeek",
          data: '2018-3-22'
        })
      }
    })
    // 获取当前时间判断今天第一次进入
    var compare = new Date();
    var isCompare = compare.getFullYear() + '-' + (compare.getMonth() + 1) + '-' + compare.getDate();
    isCompare = String(isCompare);
    wx.getStorage({
      key: 'appWeek',
      success: (res) => {
        if (res.data == isCompare) {
          this.setData({
            indexWeek: false,
            addTopTagWrap: false
          })
        } else {
          wx.setStorage({
            key: "appWeek",
            data: isCompare
          })
          this.setData({
            indexWeek: true,
            addTopTagWrap: true
          })
        }
      }
    })

    this.setData({
      ...options
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
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#FF3366',
    })
    this.setData({
      random: true
    })
    // if (!this.data.reacquire){
    wx.login({
      success: (val) => {
        autoLogin({
          code: val.code
        }).then(res => {
          if (res.code == 0) {
            wx.setStorageSync('Authorization', res.data.access_token)
            wx.setStorageSync('is_checked', res.data.is_checked)
            wx.setStorageSync('provinceId', res.data.provinceId)
            wx.setStorageSync('isActTime', res.data.isActTime)
            wx.setStorageSync('menus', res.data.actMenu)
            wx.setStorageSync('isInActivity', res.data.isInActivity)
            wx.setStorageSync('noLogin', false)
            if (res.data.is_checked == 2) {
              this.setData({
                noLook: false,
                noLookTwo: false
              })
              foundUnread({}).then(res => {
                app.onTotalCount(res.data.unreadCount, 2);
              });
            } else {
              // 未认证需判断时间
              if (this.data.indexWeek) {
                this.setData({
                  noLookHide: true
                })
              } else {
                this.setData({
                  noLookHide: false
                })
              }
              this.setData({
                noLook: true,
                noLookTwo: true,
              })
            }

            if (!res.data.nickName) {
              res.data.nickName = app.globalData.userInfo.nickName
            }
            app.globalData.userInfo = res.data;
            const imgHead = app.globalData.imgHead
            const version = app.globalData.userInfo.version
            this.setData({
              isActTime: wx.getStorageSync('isActTime'),
              img_homepage_miaosha_bg: imgHead + 'index/img_homepage_miaosha_bg.png?version=' + version,
              vip_bg: imgHead + 'index/vipBg.png?version=' + version,
              img_kuang: imgHead + 'index/img_kuang.png?version=' + version,
              img_top_tag: imgHead + 'img_top_tag@2x.png?version=' + version,
              img_tag_miaosha: imgHead + 'img_tag_miaosha.png?version=' + version,
              bg0: imgHead + 'index/bg_pink.png?version=' + version,
              bg1: imgHead + 'index/bg_blue.png?version=' + version,
              bg2: imgHead + 'index/bg_purple.png?version=' + version,
              reacquire: true
            })
            index({
              isToken: true
            }).then(res => {
              this.setData({
                ...res.data,
                actPageTimesTwo: 'actPageTimesTwo',
              }, () => {
                if (this.data.lastOrderInfo) {
                  this.indexTopOnUp(this.data.lastOrderInfo)
                }
                this.getRandomCount();
              })
              if (res.data.totalCount) {
                app.onTotalCount(res.data.totalCount, 3)
              };

            }).catch(fail => { })
          } else {
            wx.setStorageSync('Authorization', '')
            wx.setStorageSync('is_checked', '')
            wx.setStorageSync('provinceId', '')
            wx.setStorageSync('noLogin', true)
            this.setData({
              noLook: true,
              reacquire: false
            }, () => {
              index().then(res => {
                this.setData({
                  ...res.data,
                }, () => {
                  if (this.data.lastOrderInfo) {
                    this.indexTopOnUp(this.data.lastOrderInfo)
                  }
                  this.getRandomCount();
                })
                if (res.data.totalCount) {
                  app.onTotalCount(res.data.totalCount, 3)
                };

              }).catch(fail => { })
            })
          }

          if (wx.getStorageSync('isActTime')) {
            this.setTabbar()
          }
        }).catch(res => {
          this.setData({
            reacquire: false
          })
        })
      }
    })
    // }

    if (!this.data.reacquire) {
      indexAds().then(res => {
        this.setData({
          ...res.data,
          isIntoIndex: res.data.ads.length > 0 ? true : false,
          reacquire: true
        })
      }).catch(fail => {
        this.setData({
          reacquire: false
        })
      })
      let page = +this.data.page
      this.getGoodsList(page);
    }
  },
  noLookHide() {
    this.setData({
      noLookHide: false
    })
  },
  renzhengGo() {
    app.getUserINfoFun()
  },
  getRandomCount() {
    let count = [0, 1, 2, 3, 4, 5];
    var that = this;
    this.setData({
      randomInterval: setInterval(function () {
        let randomIndex = Math.floor(Math.random() * count.length);
        that.setData({
          randomIndex: randomIndex
        })
      }, 5000)
    })
  },

  newBrandList: throttle(function (e) {
    if (this.data.noLook) {
      app.userType()
    } else {
      var brandId = e.currentTarget.dataset.brandid;
      if (brandId) {
        wx.navigateTo({
          url: '/pages/goods/brandDetail/brandDetail?brandId=' + brandId,
        })
      }
    }
  }),
  goDiscounts: throttle(function (e) {
    if (this.data.noLook) {
      app.userType()
    } else {
      var pageId = e.currentTarget.dataset.pageid;
      if (pageId) {
        wx.navigateTo({
          url: '/pages/homePage/preferential/preferential?pageId=' + pageId,
        })
      }
    }
  }),
  vip: throttle(function () {
    if (this.data.noLook) {
      app.userType()
    } else {
      wx.navigateTo({
        url: '/pages/homePage/vipIndex/vipIndex',
      })
    }
  }),
  jumpToMiaoSha: throttle(function () {
    if (this.data.noLook) {
      app.userType()

    } else {
      wx.navigateTo({
        url: this.data.miaoshaUrl,
      })
    }
  }),
  jumpToHeadlineNews: throttle(function () {
    if (this.data.noLook) {
      app.userType()
    } else {
      wx.navigateTo({
        url: '/pages/homePage/headlineNews/headlineNews',
      })
    }
  }),
  // 跳转专辑列表
  goCollList: throttle(function () {
    if (this.data.noLook) {
      app.userType()
    } else {
      wx.navigateTo({
        url: '/pages/homePage/collList/colllist',
      })
    }
  }),
  goColldetail: throttle(function (e) {
    if (this.data.noLook) {
      app.userType()
    } else {
      wx.navigateTo({
        url: `/pages/homePage/colldetail/colldetail?collId=${e.currentTarget.dataset.collid}`,
      })
    }
  }),
  goAdsDetail: throttle(function (e) {
    if (this.data.noLook) {
      app.userType()
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    }
  }),

  getGoodsList(page) {
    if (!this.data.requestLock) {
      this.data.requestLock = true
      let pageSize = +this.data.pageSize
      let allData = this.data.timelineList;
      let leftTimeLine = this.data.leftTimeLine;
      let rightTimeLine = this.data.rightTimeLine;
      this.setData({
        isLoading: page > 1 ? true : false
      }, () => {

      })
      getTimeLineList({
        pageSize,
        page
      }).then(res => {
        var tempTimelineList = res.data.timelineList;
        tempTimelineList.forEach(item=>{
          if (item.type == 1) {
            let tempSalesCount = item.data.goods.salesCount;
            if(tempSalesCount<9999){
              tempSalesCount = tempSalesCount;
            }else{
              tempSalesCount = (tempSalesCount/10000).toFixed(1)+'w'
            }
            item.data.goods.salesCount = tempSalesCount;
          }
        })
        allData = allData.concat([], ...tempTimelineList);
        allData.forEach(element => {
          if (element.type == 1) {
            element.data.goods.objectPrice = app.segmentationPrice(element.data.goods.goodsPrice);
            let tagList = [];
            element.data.goods.tagList = [];
            tagList = Object.keys(element.data.goods.showTagMap).filter(item => {
              return element.data.goods.showTagMap[item];
            })
            tagList.map(item => {
              this.data.tagMap.map(subItem => {
                if (item == subItem.name) {
                  element.data.goods.tagList.push(subItem)
                }
              })
            })
            if(element.data.goods.isMiaoSha) {
              element.data.goods.tagList.push({text: '秒'})
            }
            if(element.data.goods.isJuHuaSuan) {
              element.data.goods.tagList.push({text: '聚'})
            }
            if(element.data.goods.couponTagList.length>0) {
              element.data.goods.tagList.push(...element.data.goods.couponTagList)
            }
          }
        });
        let guessCollection = allData.filter(item=>item.type===2);
        guessCollection.map((item,index)=>{
          item.backImg = this.data[`bg${index%3}`]
        })
        leftTimeLine = allData.filter((item, index) => {
          return index % 2 == 0
        });
        guessCollection.map(item=>{
          leftTimeLine.map(leftItem=>{
            if(item.type==2&&item.data.goodsColl.collId == leftItem.data.goodsColl.collId){
              leftItem.backImg = item.backImg;
            }
          })
        })
        rightTimeLine = allData.filter((item, index) => {
          return index % 2 != 0
        });
        if (res.data.timelineList.length < pageSize) {
          this.setData({
            timelineList: allData,
            page,
            requestLock: true,
            reachTheBottom: true,
            isLoading: false,
            rightTimeLine: rightTimeLine,
            leftTimeLine: leftTimeLine
          })
        } else {
          this.setData({
            timelineList: allData,
            rightTimeLine: rightTimeLine,
            leftTimeLine: leftTimeLine,
            page,
            requestLock: false,
            isLoading: true,
          })
        }
      }).catch(res => {
        this.setData({
          requestLock: false,
          isLoading: false,
          reacquire: false
        })
      })
    }
  },
  goAdvertising: throttle(function (e) {
    if (this.data.noLook) {
      app.userType()
    } else {
      if (e.currentTarget.dataset.item.url.indexOf('pages') != -1) {
        app.adSpaceJump(e.currentTarget.dataset.item)
      } else {
        wx.navigateTo({
          url: `/pages/webView/webView?ad=${e.currentTarget.dataset.item.url}`,
        })
      }

    }
  }),
  // 精选频道跳转链接
  channelViewMore: throttle(function (e) {
    if (this.data.noLook) {
      app.userType()
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  }),
  // 精选频道跳转
  goList: throttle(function (e) {
    let type = e.currentTarget.dataset.type;
    if (this.data.noLook) {
      app.userType()
    } else {
      if (type == 1) {
        wx.navigateTo({
          url: this.data.miaoshaUrl,
        })
      } else if (type == 2) {
        wx.navigateTo({
          url: this.data.juhuasuanUrl,
        })
      } else if (type == 3) {
        wx.navigateTo({
          url: this.data.taocanUrl,
        })
      } else if (type == 4) {
        wx.navigateTo({
          url: this.data.manzengUrl,
        })
      } else if (type == 5) {
        wx.navigateTo({
          url: this.data.pintuanUrl
        })
      } else if (type == 6) {
        wx.navigateTo({
          url: this.data.newGoodsUrl
        })
      }

    }
  }),
  cancelIndexFixedAd() {
    this.setData({
      isIntoIndex: false
    })

  },
  move() {
    return false;
  },
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
  // catchTouchMove:function(res){
  //   return false
  // },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.interval);
    clearInterval(this.data.randomInterval);
    var addCartComponentsHide = this.selectComponent("#addCart");
    if (addCartComponentsHide != null) {
      addCartComponentsHide.onConfirm()
    }

    clearInterval(this.data.interval);
    if (this.data.flashSaleNew) {
      this.data.flashSaleNew.date = ''
    } else {
      this.data.flashSaleNew = ''
    }
    this.setData({
      flashSaleNew: this.data.flashSaleNew,
      noLookHide: false, //离开取消去认证的蒙层
      random: false,
    })


  },
  setTabbar() {
    wx.setTabBarStyle({
      color: '#6e6d6b',
      selectedColor: '#C520FB',
    })
    wx.setTabBarItem({
      index: 0,
      text: '首页',
      iconPath: '/images/home.png',
      selectedIconPath: '/images/home_click.png'
    });
    wx.setTabBarItem({
      index: 1,
      text: '分类',
      iconPath: '/images/classify.png',
      selectedIconPath: '/images/classify_click.png'
    });
    wx.setTabBarItem({
      index: 2,
      text: '发现',
      iconPath: '/images/found.png',
      selectedIconPath: '/images/found_click.png'
    });
    wx.setTabBarItem({
      index: 3,
      text: '购物车',
      iconPath: '/images/cart.png',
      selectedIconPath: '/images/cart_click.png'
    });
    wx.setTabBarItem({
      index: 4,
      text: '我的',
      iconPath: '/images/my.png',
      selectedIconPath: '/images/my_click.png'
    });
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.daojiashi)
    this.data.flashSaleNew.date = ''
    this.setData({
      flashSaleNew: this.data.flashSaleNew
    })
    clearInterval(this.data.interval);
    clearInterval(this.data.randomInterval)
    var miaoshaIndex = "#miaoshaIndex"
    var miaoshaIndexTime = this.selectComponent(miaoshaIndex);
    clearInterval(miaoshaIndexTime.data.daojiashi);
    this.data.actPage.forEach((item, index) => {
      var actPageTimes = "#actPageTimes" + index
      var showTwo = this.selectComponent(actPageTimes);
      clearInterval(showTwo.data.daojiashi);

    })
  },
  ontoUpImgs() {
    app.handleJumpToTop();
  },
  onPageScroll(e) {
    if (this.data.addTopTagWrap) {
      if (e.scrollTop > 10) {
        setTimeout(() => {
          this.setData({
            addTopTagWrap: false,
          })
        }, 1000)
      }
    }

    var that = this
    app.scrollRolling(that, e.scrollTop)
  },
  linshiclass() {
    wx.navigateTo({
      url: '/pages/activeDirectory/activityTemplate/activityTemplate?pageId=44',
    })
  },
  biaobaiji() {
    wx.navigateTo({
      url: '/pages/goods/spellDetails/spellDetails?groupId=12820'
    })
  },
  linshiclass2() {
    wx.navigateTo({
      url: '/pages/activity/activity',
    })
  },
  jumpToUrl: throttle(function (e) {
    if (this.data.noLook) {
      app.userType()
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  }),
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

  linshi() {
    wx.navigateTo({
      url: '/pages/self/shareSignIn/shareSignIn'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '采最正的品，卖最火的货',
      success: function (res) {
        // 转发成功
       
      },
      fail: function (res) {
        // 转发失败
      
      }
    }
  }
})