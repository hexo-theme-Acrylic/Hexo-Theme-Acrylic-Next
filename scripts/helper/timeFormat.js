const moment = require('moment');

hexo.extend.helper.register('timeFormat', function(query){
    const now = moment(new Date())
    const time = moment(query)
    const daysDiff = Math.floor(now.diff(time) / (1000 * 3600 * 24))
    let timeString = ''
    if (daysDiff === 0) {
        timeString = "最近";
      } else if (daysDiff === 1) {
        timeString = "昨天";
      } else if (daysDiff === 2) {
        timeString = "前天";
      } else if (daysDiff <= 7) {
        timeString = daysDiff + "天前";
      } else {
        if(time.year() === now.year()){
            timeString = (time.month() + 1) + '/' + time.date()
        }else{
            timeString = time.year() + '/' + (time.month() + 1) + '/' + time.date()
        }
    }
    return timeString;
});