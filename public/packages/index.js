import {default as NipCesium} from './cesium'

const components = [NipCesium];

const install = function (Vue) {
  // 判断是否安装
  if (install.installed) return;
  // 遍历注册全局组件
  components.forEach(component => {
    Vue.component(component.name, component)
  });
};
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export {NipCesium};
export default {
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install,
};
