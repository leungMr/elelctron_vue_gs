import {ipcMain} from 'electron'

let trainListModal = require('../model/trainListModal')
let examIdToMp3Modal = require('../model/examIdToMp3Modal')
const fs = require('fs');
const spawn = require('child_process').spawn
export default function () {
  // *****************以下是数据库相关*******************************

  //dump并查询
  ipcMain.on('readDumpFile', (event) => {
    let successFlag = true
    let cmdPath = process.cwd() + "\\static\\mongodb"
    let spawnObj = spawn('.\\bin\\mongodump.exe', ['-o', '.\\bin\\dump'], {cwd: cmdPath})
    // 成功
    spawnObj.stdout.on('data', function (chunk) {
      console.log("此处从不打印")
    });
    // 失败
    spawnObj.stderr.on('data', (data) => {
      let fileInfo = data.toString()
      if (fileInfo.indexOf("Failed") !== -1) {
        successFlag = false
      }
    });
    // 子进程关闭
    // dump这种进程会自动死亡,与mongodb不同
    spawnObj.on('close', function (code) {
      if (successFlag === false) {
        event.returnValue = {
          code: 0
        }
      } else {
        let allFiles = readFileFunc(cmdPath + "\\bin\\dump")
        event.returnValue = {
          code: 1,
          data: allFiles
        }
      }

    })
  });
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
    let filePath = arg.filePath
    fs.readFile(filePath, async function (err, data) {
      if (err) {
        event.returnValue = {code: 0}
        return console.error(err)
      }
      let fileData = JSON.parse(data.toString())

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
      findResult.forEach(item => {
        delete item._id
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


  // *****************以下是考核相关*******************************
  // 查询考核列表
  ipcMain.on('getInitExamData_', async (event) => {
    let findResult = await trainListModal.find()
    // console.log(findResult)
    event.returnValue = findResult
  });

  // 查询考核详情
  ipcMain.on('getTrainInfo_', async (event, arg) => {
    // 需要联合查询 存在一张主表和两张附表
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


  // *****************以下是工具方法*******************************
  // 定义一个读dump文件夹里面读文件的方法
  let readFileFunc = (path) => {
    // 读出数据库dump里面的东西
    let folders = []
    let files = fs.readdirSync(path);
    // console.log(files)
    files.forEach(function (item, index) {
      if (item !== "gs_db") return
      let fileSons = fs.readdirSync(`${path}\\${item}`)
      let obj = {}
      obj[item] = fileSons
      folders.push(obj)
    })
    return folders;
  }
}


