//自定义事件模块
//在不同的页面或组件之间传递数据或事件
//nodeJs事件 监听 移除 调用

const events = {}

const event = {
  //监听事件
  //  * 事件监听
  //  * @param {*} type        监听的事件类型
  //  * @param {*} listener    回调函数
  //  */
  // on(type, listener) {
  //   if (this.events[type]) {
  //     this.events[type].push(listener);
  //   } else {
  //     this.events[type] = [listener];
  //   }
  // }
  //EventEmitter.on(event, listener) 为指定事件注册一个监听器，接受一个字符串 event 和一个回调函数listener
  //为了能在Vue中使用，需要指定this(通过self传入)
  on (name, self, callback) {
    let tuple = [self, callback]
    let callbacks = events[name]
    if (Array.isArray(callbacks)) {
      callbacks.push(tuple)
    } else {
      events[name] = [tuple]
    }
  },
  
  //移除事件
  //  * 删除指定事件中的监听函数
  //  * @param {*} type      对应的事件 
  //  * @param {*} listener  要删除的监听函数
  //  */
  // remove(type, listener) {
  //   if (this.events[type]) {
  //     this.events[type].filter(l => l !== listener);
  //   }
  // }
  remove (name, self) {
    let callbacks = events[name]
    if (Array.isArray(callbacks)) {
      events[name] = callbacks.filter((tuple) => {
        return tuple[0] !== self
      })
    }
  },

  //调用事件
  //  * 事件触发
  //  * @param {*} type        要触发的事件类型
  //  * @param  {...any} rest  接收到的若干个参数，这个参数会作为参数被传递到对应事件的回调函数中
  //  */
  // emit(type, ...rest) {
  //   if (this.events[type]) {
  //     this.events[type].forEach(listener => {
  //       listener.apply(this, rest);
  //     });
  //   }
  // }
  emit (name, data) {
    let callbacks = events[name]
    if (Array.isArray(callbacks)) {
      callbacks.map((tuple) => {
        let self = tuple[0]
        let callback = tuple[1]
        callback.call(self, data)
      })
    }
  },

  has (name) {
    return !!events[name]
  },
  off (name) {
    events[name] = []
  }

}

export default event