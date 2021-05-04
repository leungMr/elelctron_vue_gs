//点击第计算时间差的方法
let getTimeDuration = (time1, time2) => {
  let dateBegin = new Date(time1.replace(/-/g, "/"));//将-转化为/，使用new Date
  let dateEnd = new Date(time2.replace(/-/g, "/"));
  let dateDiff = dateEnd.getTime() - dateBegin.getTime()
  return dateDiff
}


export {getTimeDuration}