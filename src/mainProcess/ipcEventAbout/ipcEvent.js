import {ipcMain} from 'electron'

let trainListModal = require('../model/trainListModal')
let examIdToMp3Modal = require('../model/examIdToMp3Modal')
const fs = require('fs');
const spawn = require('child_process').spawn
export default function () {
  // *****************以下是数据库相关*******************************
  // 读本地文件并获取进度
  ipcMain.on('importToLocalDataByJsonFile2', (event, arg) => {
    let readStream = fs.createReadStream(arg.filePath)
    let totalSize = fs.statSync(arg.filePath).size  // 通过 fs.statSync 获取文件大小
    let curSize = 0
    let percent = '0%'
    let arr = []
    readStream.on('data', (chunk) => {
      // chunk 数据块
      // 计算当前读取到的文件的大小，计算读取的顺序
      // chunk 是一个 buffer 对象
      // 每一次读取到了一点数据，将该数据的长度累加起来 / 文件的总大小 * 100 得到百分比
      curSize += chunk.length
      // 将已经读取到的字节数 / 总字节数 * 100 = 百分比
      percent = (curSize / totalSize * 100).toFixed(2) + '%'
      console.log('读取中' + percent)
      arr.push(chunk)
    })

    // end 事件监听读写结束
    readStream.on('end', (chunk) => {
      console.log('读取结束')
      console.log(Buffer.concat(arr).toString())
      event.returnValue = ''
    })
  })

  // 读取本地json文件,导入考试列表
  ipcMain.on('importToLocalDataByJsonFile', (event, arg) => {
    // G:\gs_books\8.0electron\electron_gyy\static\mongodb\exportData\1.json  arg{filePath,tableName}
    // console.log("45665")
    let filePath = arg.filePath
    fs.readFile(filePath, async function (err, data) {
      if (err) {
        console.log("读取文件失败了")
        event.returnValue = {code: 0}
        return console.error(err)
      }
      let needArr = data.toString().split("OK--11")
      // let fileData = JSON.parse(data.toString())
      let fileData = needArr[0]
      fileData = JSON.parse(fileData)
      console.log("读取文件成功")
      fileData.length > 0 && fileData.forEach(item => {
        if (item.trainingPlanEntity) {
          delete item.trainingPlanEntity
        }
        item.trainingDesignRelevanceList.length > 0 && item.trainingDesignRelevanceList.forEach(ele => {
          ele.netList.forEach(uu => {
            uu.subject && delete uu.subject
            uu.subjects && delete uu.subjects
          })
        })
      })

      // examId数据库已经有的要过滤掉
      // 查询数据库全部考核数据
      let findResult = await trainListModal.find()
      let allExamId = []
      findResult.forEach(item => {
        allExamId.push(item.examDesignId)
      })
      fileData = fileData.filter(item => {
        if (allExamId.indexOf(item.examDesignId) === -1) {
          return item
        }
      })
      // console.log(fileData)
      // 等于0 写数据库时会报错
      if (fileData.length === 0) {
        event.returnValue = {code: 1}
        return
      }
      // insert会把数组里面的东西全部导入
      // 集合名是在modal里面定义的
      await trainListModal.collection.insert(fileData, (err, docs) => {
        if (err) {
          event.returnValue = {code: 0}
        } else {
          // console.log(docs)
          // 主进程这边修改了代码需要重启
          event.returnValue = {code: 1}
        }
      })
    })


  });

  // 导入音频文件
  ipcMain.on('examToDeviceArrimportMp3', async (event, arg) => {
    // console.log(arg)
    // 推送过来的对象 一定会带考试id
    // 所有现存的考试id都会被推送过来
    // 路径不在现存的考试id之内导不进去
    // 先查出音频表所有数据,不重复的再push进去
    // 同一个id所对应的数组下可能会重复
    let findResult = await examIdToMp3Modal.find()
    if (findResult.length === 0) {
      // 音频表为空,直接写入
      await examIdToMp3Modal.collection.insert(arg.examToDeviceArr, (err, docs) => {
        if (err) {
          event.returnValue = {code: 0}
        } else {
          event.returnValue = {code: 1}
        }
      })
    }
    // ===
    else {
      // 前端那边已经把在考试之外的文件过滤了
      // findResult包含所有考试 第一次写入音频文件便写入了所有考试
      // 传过来的examToDeviceArr也包含所有考试
      findResult.forEach(item => {
        delete item._id
        // 传过来的是所有考试以及对应的音频文件数组
        arg.examToDeviceArr.forEach(ele => {
          if (ele.examDesignId === item.examDesignId) {
            ele.deviceArr.forEach(uu => {
              if (item.deviceArr.indexOf(uu) === -1) {
                item.deviceArr.push(uu)
              }
            })
          }
        })
      })
      // console.log(findResult)
      examIdToMp3Modal.deleteMany({}, (async err => {
        // 先把集合清空
        if (!err) {
          await examIdToMp3Modal.collection.insert(findResult, (err, docs) => {
            if (err) {
              event.returnValue = {code: 0}
            } else {
              // console.log(docs)
              // 主进程这边修改了代码需要重启
              event.returnValue = {code: 1}
            }
          })
        } else {
          event.returnValue = {code: 0}
        }
      }))
    }
  })

  // 读取音频文件
  ipcMain.on('readMp3File', async (event, arg) => {
    try {
      let findResult = await examIdToMp3Modal.find()
      event.returnValue = {code: 1, data: findResult}
    } catch (e) {
      event.returnValue = {code: 0, e}
    }
  })

  // 通过id获取考试音频文件
  ipcMain.on('getAllMp3FilesById', async (event, arg) => {
    try {
      let findResult = await examIdToMp3Modal.findOne({examDesignId: arg})
      // 音频表没有建立  返回的是findResult=null 也就是只导入了文本文件
      event.returnValue = {code: 1, data: findResult}
    } catch (e) {
      event.returnValue = {code: 0, e}
    }
  })


  // 删除考试文本文件
  ipcMain.on('deleteExamtext', async (event, arg) => {
    // 删除文本数据
    trainListModal.remove({examDesignId: arg}, (err, res) => {
      if (err) {
        event.returnValue = {code: 0}
      } else {
        examIdToMp3Modal.remove({examDesignId: arg}, (err2, res2) => {
          if (err2) {
            event.returnValue = {code: 0}
          } else {
            event.returnValue = {code: 1}
          }
        })
      }
    })


  })

  // 删除考试单独音频数据deleteMp3File
  ipcMain.on('deleteMp3File', async (event, arg) => {
    // 根据id查
    // 组装数据
    // 更新
    examIdToMp3Modal.findOne({examDesignId: arg.examId}, (err, doc) => {
      if (!err) {
        // console.log(doc)
        doc.deviceArr = doc.deviceArr.filter(uu => {
          if (uu !== arg.deleteData) {
            return uu
          }
        })
        // 更新文档
        examIdToMp3Modal.findByIdAndUpdate(doc._id, {deviceArr: doc.deviceArr}).then((doc, err) => {
          if (!err) {
            event.returnValue = {code: 1}
          } else {
            console.log(err)
            event.returnValue = {code: 0}
          }
        })
      } else {
        event.returnValue = {code: 0}
      }
    })

  })


  // *****************以下是考核相关*******************************
  // 查询考核列表
  ipcMain.on('getInitExamData_', async (event) => {
    try {
      let findResult = await trainListModal.find()
      // console.log(findResult)
      event.returnValue = {code: 1, data: findResult}
    } catch (e) {
      event.returnValue = {code: 0, e}
    }

  });

  // 查询考核详情
  ipcMain.on('getTrainInfo_', async (event, arg) => {
    try {
      let findResult = await trainListModal.findOne({examDesignId: arg})
      // console.log(findResult)
      // 返回的固定格式
      event.returnValue = {
        status: 1,
        data: findResult
      }
    } catch (err) {
      event.returnValue = {
        status: 0,
        data: err
      }
    }

  });
}


