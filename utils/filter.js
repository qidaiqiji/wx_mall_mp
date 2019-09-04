const appData = getApp().globalData;
function identityFilter(pageObj) {
 
  if (pageObj.onUnload) {
  pageObj.onUnload = function () {
    wx.setStorageSync('isMy', true)
    wx.setStorageSync('isClassify', true)
    wx.setStorageSync('isFound', true)
    wx.setStorageSync('isCart', true)
  }
}
  return pageObj;
}
exports.identityFilter = identityFilter;