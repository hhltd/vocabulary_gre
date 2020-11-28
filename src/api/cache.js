//使用基于H5的 indexDB本地数据库 进行缓存
//在云端数据库上线后可作为本地与云端之间的缓存，减少服务器更新压力
/* 
一、IndexedDB 不属于关系型数据库（不支持 SQL 查询语句），更接近 NoSQL 数据库。

二、IndexedDB 具有以下特点。
（1）键值对储存。 IndexedDB 内部采用对象仓库（object store）存放数据。所有类型的数据都可以直接存入，包括 JavaScript 对象。对象仓库中，数据以"键值对"的形式保存，每一个数据记录都有对应的主键，主键是独一无二的，不能有重复，否则会抛出一个错误。
（2）异步。 IndexedDB 操作时不会锁死浏览器，用户依然可以进行其他操作，这与 LocalStorage 形成对比，后者的操作是同步的。异步设计是为了防止大量数据的读写，拖慢网页的表现。
（3）支持事务。 IndexedDB 支持事务（transaction），这意味着一系列操作步骤之中，只要有一步失败，整个事务就都取消，数据库回滚到事务发生之前的状态，不存在只改写一部分数据的情况。
（4）同源限制 IndexedDB 受到同源限制，每一个数据库对应创建它的域名。网页只能访问自身域名下的数据库，而不能访问跨域的数据库。
（5）储存空间大 IndexedDB 的储存空间比 LocalStorage 大得多，一般来说不少于 250MB，甚至没有上限。
（6）支持二进制储存。 IndexedDB 不仅可以储存字符串，还可以储存二进制数据（ArrayBuffer 对象和 Blob 对象）。

三、IndexedDB 是一个比较复杂的 API，涉及不少概念。它把不同的实体，抽象成一个个对象接口。学习这个 API，就是学习它的各种对象接口。
（1）数据库：IDBDatabase 对象
数据库是一系列相关数据的容器。每个域名（严格的说，是协议 + 域名 + 端口）都可以新建任意多个数据库。
IndexedDB 数据库有版本的概念。同一个时刻，只能有一个版本的数据库存在。如果要修改数据库结构（新增或删除表、索引或者主键），只能通过升级数据库版本完成。
（2）对象仓库：IDBObjectStore 对象
每个数据库包含若干个对象仓库（object store）。它类似于关系型数据库的表格。
（3）数据记录
对象仓库保存的是数据记录。每条记录类似于关系型数据库的行，但是只有主键和数据体两部分。主键用来建立默认的索引，必须是不同的，否则会报错。主键可以是数据记录里面的一个属性，也可以指定为一个递增的整数编号。
如：{ id: 1, text: 'foo' }
（4）索引： IDBIndex 对象
为了加速数据的检索，可以在对象仓库里面，为不同的属性建立索引。
（5）事务： IDBTransaction 对象
数据记录的读写和删改，都要通过事务完成。事务对象提供error、abort和complete三个事件，用来监听操作结果。
（6）指针： IDBCursor 对象
（7）操作请求：IDBRequest 对象
（8）主键集合：IDBKeyRange 对象

四、操作流程
（1）声明一个db对象
（2）声明一个配置对象（数据库名称 数据库版本）
（3）连接数据库并初始化 indexedDB.open(config.database, config.version) 此处可以判断浏览器是否兼容indexDB
（4）数据库成功打开onsuccess
（5）数据库打开失败onerror
（6）创建对象仓库（即新建表）upgradeneeded 先判断objectStoreNames是否存在这个表 没有的话createObjectStore
*/

var db

const config = {
  database: 'gre', //数据库名称
  version: 1 //数据库版本
}

//连接数据库并初始化
const connect = () => {
  //检查是否已经打开
  if(db) return console.log('db already connected')
  //检查浏览器是否兼容indexDB
  const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB
  if(!indexedDB) return alert('你的浏览器版本太旧，将导致本站无法正常使用')
  //打开数据库，使用indexedDB.open()方法。返回一个 IDBRequest 对象
  const connection = indexedDB.open(config.database, config.version)
  //表示成功打开数据库。
  connection.onsuccess = (e) => {
    db = e.target.result
    console.log('indexDB connected')
  }
  //表示打开数据库失败。
  connection.onerror = (e) => {
    console.log(e.currentTarget.error.message)
    alert('缓存加载失败，请刷新页面')
  }
  //新建数据库，第一件事是新建对象仓库（即新建表）。upgradeneeded 
  connection.onupgradeneeded = (e) => {
    console.log('db initialization')
    db = e.target.result
    // user: {  // user表
    //   _id,  // 用户id，用于表间索引
    //   username,  // 用户名
    //   password,  // 密码
    //   createdAt // 用户创建时间
    // }
    if (!db.objectStoreNames.contains('user')) {
      let objectStore = db.createObjectStore('user', {
        keyPath: '_id', //指定主键
        autoIncrement: true //指定主键为一个递增的整数。
      })
      //新建索引 索引名称 索引所在属性 配置对象（是否包含重复的值）
      objectStore.createIndex('username', 'username', { unique: true })
      objectStore.createIndex('password', 'password', { unique: false })
      objectStore.createIndex('createdAt', 'createdAt', { unique: false })

      console.log('user table created')
    }

    // learned: {  //学过的单词表
    //   _id,
    //   user: 10000,  // user._id，索引到user表
    //   words: {
    //     word1: {  // 单词本身就是字段名
    //       value: "translation",  // 单词的中文翻译
    //       period: 1,  // 艾宾斯浩复习周期，1代表5分钟周期，2代表30分钟周期，以此类推(一共八个周期)
    //       stage: 7,  // 不熟练度，数字越大表示越不熟练，为0时表示完全掌握，新背单词默认为7
    //       updatedAt: Date.now()   // 上次复习时间，配合period, stage即可算出该单词复习权重
    //     },
    //     word2: { ... }
    //   }
    // }

    if (!db.objectStoreNames.contains('learned')) {
      let objectStore = db.createObjectStore('learned', {
        keyPath: '_id',
        autoIncrement: true
      })

      objectStore.createIndex('user', 'user', { unique: true })
      objectStore.createIndex('words', 'words', { unique: false })

      console.log('learned table created')
    }

    // progress: {  // 学习进度表
    //   _id,
    //   user: 10000,
    //   lists: {
    //     list1: {  // list的名字本身就是字段名
    //       location: 255,  // 表示该list用户已经学过的单词数量（只要看一次就算学过，单词会被加到user.learned里）
    //       startedAt: Date.now()  // 开始学习的时间
    //       updatedAt: Date.now()  // 上次学习的时间
    //     },
    //     list2: { ... }
    //   }
    // }

    if (!db.objectStoreNames.contains('progress')) {
      let objectStore = db.createObjectStore('progress', {
        keyPath: '_id',
        autoIncrement: true
      })

      objectStore.createIndex('user', 'user', { unique: true })
      objectStore.createIndex('lists', 'lists', { unique: false })

      console.log('progress table created')
    }
  }
}

//用户登录 如果username未被注册 则注册新用户
//新增数据指的是向对象仓库写入数据记录。这需要通过事务完成
//新建时必须指定表格名称和操作模式（"只读"或"读写"）
//读取数据也是通过事务完成
const userLogin = (username, password) => {
  return new Promise((resolve, reject) => {
    if(!db) return reject(new Error("db not connected"))
    //写
    let transaction = db.transaction('user', 'readwrite')
    //读
    let store = transaction.objectStore('user')
    let request = store.index('username').get(username.toLowerCase())

    request.onsuccess = (e) => {
      let user = e.target.result
      if(user){
        //用户名注册
        if (password === user.password) resolve(e.target.result)
        else return reject(new Error('password'))
        }else{
        //用户名不存在 创建新用户 通过表格对象的add()方法，向表格写入一条记录
        user = {
          username,
          password,
          createdAt: Date.now()
        }
        let addRequest = store.add(user)
        //写入记录
        addRequest.onsuccess = (e) => {
          console.log('new user created')
          resolve({ _id: e.target.result, ...user })
        }
        addRequest.onerror = (e) => { reject(e.target.error) }
      }
    }

    request.onerror = (e) => { reject(e.target.error) }
  })
}

// 获取一个用户学过的所有单词的和单词的学习进度，即learned表的words字段
// 返回值范例
// {
//   word1: {
//     value: "translation",
//     period: 1,
//     stage: 7,
//     updatedAt: Date.now()
//   },
//   word2: { ... }
// }
const getLearnedByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    if (!db) return reject(new Error('db not connected'))

    let transaction = db.transaction('learned', 'readwrite')
    let store = transaction.objectStore('learned')
    let request = store.index('user').get(userId)

    request.onsuccess = (e) => {
      // 注意这里返回的是learned表里的words字段，方便应用
      const { words } = e.target.result || {}
      if (words) resolve(words)
      else resolve({})
    }

    request.onerror = (e) => { reject(e.target.error) }
  })
}

// 获取一个用户学过的list和对应list的学习情况，即progress表的lists字段
// 返回值范例
// {
//   list1: {
//     location: 255,
//     startedAt: Date.now(),
//     updatedAt: Date.now()
//   },
//   list2: { ... }
// }
const getProgressByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    if (!db) return reject(new Error('db not connected'))

    let transaction = db.transaction('progress', 'readwrite')
    let store = transaction.objectStore('progress')
    let request = store.index('user').get(userId)

    request.onsuccess = (e) => {
      // 注意这里返回的是progress表里的lists字段，方便应用
      const { lists } = e.target.result || {}
      if (lists) resolve(lists)
      else resolve({})
    }

    request.onerror = (e) => { reject(e.target.error) }
  })
}

// 获取用户某一个list的学习情况
// 返回值范例
// {
//   location: 255,
//   startedAt: Date.now()
// }
const getUserListProgress = (userId, listName) => {
  return new Promise((resolve, reject) => {
    if (!db) return reject(new Error('db not connected'))

    let transaction = db.transaction('progress', 'readwrite')
    let store = transaction.objectStore('progress')
    let request = store.index('user').get(userId)

    request.onsuccess = (e) => {
      const { lists } = e.target.result || {}
      if (lists && lists[listName]) resolve(lists[listName])
      else resolve({})
    }

    request.onerror = (e) => { reject(e.target.error) }
  })
}

// 判断用户是否学习过某个单词
const isUserLearnedWord = (userId, wordEn) => {
  return new Promise((resolve, reject) => {
    if (!db) return reject(new Error('db not connected'))

    let transaction = db.transaction('learned', 'readwrite')
    let store = transaction.objectStore('learned')
    let request = store.index('user').get(userId)

    request.onsuccess = (e) => {
      let { words } = e.target.result || {}
      if (words && words[wordEn]) resolve(true)
      else resolve(false)
    }

    request.onerror = (e) => { reject(e.target.error) }
  })
}

// 给用户已学过单词列表编辑某一个单词的属性
// 如果单词未学过就将单词添加进列表
// 如果单词已在列表里面就更新period和stage
// (用户id，单词对象，{记忆周期变化，熟悉度变化})
const editUserLearned = (userId, wordObj, { update = true, period = 0, stage = 0, periodChange = 0, stageChange = 0 }) => {
  return new Promise((resolve, reject) => {
    if (!db) return reject(new Error('db not connected'))

    const { wordEn, wordZh } = wordObj || {}
    if (!wordEn || !wordZh) return reject(new Error('word object incorrect'))

    let transaction = db.transaction('learned', 'readwrite')
    let store = transaction.objectStore('learned')
    let request = store.index('user').get(userId)

    request.onsuccess = (e) => {
      let learned = e.target.result
      let findFlag = false
      if (learned) { // 用户有学习记录
        if (learned.words && learned.words[wordEn]) { // 用户学过该单词
          findFlag = true
          learned = {
            ...learned,
            words: {
              ...learned.words,
              [wordEn]: {
                value: wordZh,
                period: period || learned.words[wordEn].period + periodChange,
                stage: stage || learned.words[wordEn].stage + stageChange, // stageChange = -1 or 0 or 1，对应认识，模糊，不认识
                updatedAt: update ? Date.now() : learned.words[wordEn].updatedAt
              }
            }
          }
        } else { // 用户没学过该单词
          learned = {
            ...learned,
            words: {
              ...(learned.words || {}),
              [wordEn]: {
                value: wordZh,
                period: period || 1,
                stage: stage || 7,
                updatedAt: Date.now()
              }
            }
          }
        }
        let putRequest = store.put(learned)

        putRequest.onsuccess = (e) => {
          if (findFlag) {
            console.log('word status updated')
            resolve('update')
          } else {
            console.log('new word added to learned')
            resolve('add')
          }
        }

        putRequest.onerror = (e) => { reject(e.target.error) }
      } else { // 用户没有学习记录
        learned = {
          user: userId,
          words: {
            [wordEn]: {
              value: wordZh,
              period: period || 1,
              stage: stage || 7,
              updatedAt: Date.now()
            }
          }
        }
        let addRequest = store.add(learned)

        addRequest.onsuccess = (e) => {
          console.log('new learned record created')
          resolve('new')
        }

        addRequest.onerror = (e) => { reject(e.target.error) }
      }
    }

    request.onerror = (e) => { reject(e.target.error) }
  })
}

// 给用户学习进度表（progress表）编辑某一个list的属性
// 如果list未学过就将list添加进列表
// 如果list已在列表里面就更新list当前的学习情况
// change一般情况下表示该list新学单词数量，即location增量
const editUserProgress = (userId, listName, { location = 0, change = 0 }) => {
  return new Promise((resolve, reject) => {
    if (!db) return reject(new Error('db not connected'))

    let transaction = db.transaction('progress', 'readwrite')
    let store = transaction.objectStore('progress')
    let request = store.index('user').get(userId)

    request.onsuccess = (e) => {
      // 注意这里返回的是progress表里的lists字段，方便应用
      let progress = e.target.result
      let findFlag = false
      if (progress) {
        if (progress.lists && progress.lists[listName]) {
          // 找到了该list
          findFlag = true
          progress = {
            ...progress,
            lists: {
              ...progress.lists,
              [listName]: {
                startedAt: progress.lists[listName].startedAt,
                location: location || progress.lists[listName].location + change,
                updatedAt: Date.now()
              }
            }
          }
        } else {
          // 未找到该list
          progress = {
            ...progress,
            lists: {
              ...(progress.lists || {}),
              [listName]: {
                location: location + change,
                startedAt: Date.now(),
                updatedAt: Date.now()
              }
            }
          }
        }
        let putRequest = store.put(progress)

        putRequest.onsuccess = (e) => {
          if (findFlag) {
            console.log('list progress edited')
            resolve('update')
          } else {
            console.log('new list added to progress')
            resolve('add')
          }
        }

        putRequest.onerror = (e) => { reject(e.target.error) }
      } else {
        // 该用户的progress暂未建立记录
        progress = {
          user: userId,
          lists: {
            [listName]: {
              location: location + change,
              startedAt: Date.now(),
              updatedAt: Date.now()
            }
          }
        }
        let addRequest = store.add(progress)

        addRequest.onsuccess = (e) => {
          console.log('new progress record created')
          resolve('new')
        }

        addRequest.onerror = (e) => { reject(e.target.error) }
      }
    }

    request.onerror = (e) => { reject(e.target.error) }
  })
}

const cache = {
  connect,
  // newUser,
  // getUserById,
  // getUserByName,
  userLogin,
  getLearnedByUserId,
  getProgressByUserId,
  getUserListProgress,
  isUserLearnedWord,
  editUserLearned,
  editUserProgress
}

export default cache