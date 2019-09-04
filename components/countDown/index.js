// components/countDown/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mytimes: {
      type: String,
      value: '',
      observer: function (newData, oldData) {
        this._getdate(newData)
      }
    },
    kind: String
  },
  pageLifetimes: {
    show:function() {
      clearInterval(this.data.daojiashi)
      this.setData({
        daojiashi: setInterval(() => {
          this.counDown(this.properties.mytimes)
        }, 1000)
      })
    },

    hide: function () {
      clearInterval(this.data.daojiashi)
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    daojiashi: '',
    day: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    totalHours:'00',
    dayHours: "00",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _getdate(newData) {
      clearInterval(this.data.daojiashi)
      this.setData({
        daojiashi: setInterval(() => {
          this.counDown(newData)
        }, 1000)
      })
    },
    counDown(newDatadate) {
      var starttime = newDatadate.replace(new RegExp("-", "gm"), "/");
      var qxTime = (new Date(starttime)).getTime(); //得到毫秒
      //当前时间
      var currenTime = new Date().getTime();
      //两个时间差值
      var time = qxTime - currenTime;
      if (time > 0) {
        time = parseInt(time / 1000)
        //天数
        var day = Math.floor(time / (60 * 60 * 24));
        var hours = Math.floor(time / (60 * 60)) - (day * 24);
        //分钟
        var minutes = Math.floor(time / 60) - (day * 24 * 60) - (hours * 60);
        var seconds = Math.floor(time) - (day * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
        if (day < 10) {
          day = '0' + day;
        }
        if (hours < 10) {
          hours = '0' + hours;
        }
        if (minutes < 10) {
          minutes = '0' + minutes
        }
        if (seconds < 10) {
          seconds = '0' + seconds;
        };
        let dayHours = '00';
        if (this.properties.kind == 'hoursMinutesSeconds') {
          dayHours = Number(hours) + 24 * day
        }
        let totalHours = '00';
        if(this.properties.kind == 'homeMiaosha') {
          totalHours = Number(hours) + 24 * day
          totalHours = totalHours<10?'0'+totalHours:totalHours;
        }
        this.setData({
          day,
          hours,
          minutes,
          seconds,
          totalHours,
          dayHours,
        })
      } else if (time < 0) {
        clearInterval(this.data.daojiashi);
        this.setData({
          day: '00',
          hours: '00',
          totalHours:'00',
          minutes: '00',
          seconds: '00',
        })
      }
    }
  }
})