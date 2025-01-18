//UserManager.js

/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 TeamCloud의 저작물로 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////


function funcUser() {
  Broadcast.send("Default"); //Default.js의 변수 불러오기
  let KV = new require("KV")();

  KV.open(Default.fileList.User);

  let Contain = function (id) {
    for (let i = 0; i < KV.listKeys().length; i++) {
      if (KV.listKeys()[i] === id) return i;
    }
    return false;
  };

  let MakeId = function () {
    let id;
    let list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    do {
      id = '';
      for (let i = 0; i < 5; i++) {
        id += list[Math.floor(Math.random() * list.length)];
      }
    } while (KV.get(id));
    return id;
  };

  let logI = function (funcName, data) {
    if (Defaulf.defLog) Log.i(`${funcName} func --- ${data}`);
  };

  let logE = function (funcName, data) {
    if (Defaulf.defLog) Log.e(`${funcName} func --- ${data}`);
  };


  return {
    contain: function (id) {
      return Contain(id);
    },
    register: function (userName, userHash) {
      let date = new Date();
      let userId = MakeId();
      if (Contain(id) == false) {
        let userData = {
          name: userName, //userName
          userId: userId, //userId
          profileHash: userHash, //profileHash
          registerDate: [
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
          ], //register date
          admin: false, //admin
          ban: false, //ban
          star: 0, //star
          warn: 0, //warn count
          nickname: [], //nickname
          chat: 0, //chat count
          like: 0, //like
          stocks: {}, //stock list
          stars: {
            registerDate: "", //stars register date
            remainingDay: 0, //stars remaining period
            ai: 0, //ai use count
          },
          etc: [] //etc
        }
        KV.put(userId, userData);
        return true;
      }
      return false;
    },

    put: function (userId, userData) {
      return KV.put(userId, userData)
    },
    get: function (userId) {
      return KV.get(userId);
    },
    search: function (userData) {
      return KV.search(userData);
    },
    save: function (userId, userData) {
      KV.put(userId, userData);
    },
    delete: function (userId) {
      try {
        KV.del(userId);
        return true;
      } catch (e) {
        logE(e.title, e.message);
        return false;
      }
    }
  }
}

Broadcast.register("userManager", () => {
  return eval(userManager = funcUser())
});