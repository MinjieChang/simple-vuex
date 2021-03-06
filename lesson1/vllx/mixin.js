export default function(Vue) {
  const version = Number(Vue.version.split(".")[0]);
  const _init = Vue.prototype._init;
  if (version >= 2) {
    // vue 版本 > 2, beforeCreate周期混入vuexInit方法
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    // 重写vue init方法, 注入vuex 初始化程序
    // 用于 vue 1.x 版本 向下兼容
    Vue.prototype._init = function(options = {}) {
      options.init = options.init ? [vuexInit].concat(options.init) : vuexInit;
      _init.call(this, options);
    };
  }
  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  // Vuex 初始化 钩子, 将 Vuex 实例注入到Vue实例中,在Vue实例中可通过this.$store访问
  // 在每个组件的beforeCreated钩子中都会调用这个函数
  function vuexInit() {
    // 这个this是每个组件实例
    const options = this.$options;
    // store injection
    if (options.store) {
      this.$store =
        typeof options.store === "function" ? options.store() : options.store;
    } else if (options.parent && options.parent.$store) {
      // 从根组件开始向下传递 $store ，所以实际上每个子组件都会挂载 $store 这个属性
      this.$store = options.parent.$store;
    }
  }
}
