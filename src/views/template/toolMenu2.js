// 注意,此一级菜单的顺序需跟地图显示顺序保持一致
let menutoolObj = [
  {
    title: "语音占位",
    key: "语音占位",
    children: [
      {
        title: "语音",
        key: "语音"
      }
    ]
  },
  {
    title: "地图操作",
    key: "地图操作",
    children: [
      {
        title: "方位控制",
        key: "方位控制",
        children: [
          {
            title: "刷新地图",
            key: "刷新地图",
          },
          {
            title: "回初始点",
            key: "回初始点",
          },
          {
            title: "镜头旋转",
            key: "镜头旋转",
          },
        ]
      },
      {
        title: "量算",
        key: "量算",
        children: [
          {
            title: "直线距离",
            key: "直线距离",
          }
        ]
      },
    ]
  },
  {
    title: "界面控制",
    key: "界面控制",
    children: [
      {
        title: "全屏",
        key: "全屏",
      },
      {
        title: "收起右边",
        key: "收起右边",
      },
      {
        title: "收起左边",
        key: "收起左边",
      }
    ]
  },
  {
    title: "其他",
    key: "其他",
    children: [
      {
        title: "调试",
        key: "调试"
      }
    ]
  }
]

export {menutoolObj}