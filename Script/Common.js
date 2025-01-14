//Common.js

/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////


Broadcast.send("Default"); //Default.js의 변수 불러오기
Broadcast.send("TCApi"); //TCApi.js의 변수 불러오기

let isProcessing = false;
let threadQueue = [];


function funcCommon() {
  return {
    file: function (path) {
      return Default.rootPath + path;
    },

    read: function (path) {
      try {
        return JSON.parse(Defaulf.FS.read(this.file(path)));
      } catch (e) {
        Log.e("read", e);
      }
    },

    write: function (path, obj) {
      try {
        Default.FS.write(this.file(path), JSON.stringify(obj));
        return true;
      } catch (e) {
        Log.e("write", e);
        return false;
      }
    },

    remove: function (path) {
      try {
        Default.FS.remove(this.file(path));
        return true;
      } catch (e) {
        log.e("remove", e);
        return false;
      }
    },

    Random: function (start, end) {
      return (start + Math.floor(Math.random() * (end - start + 1)));
    },

    RandomFloat: function (start, end) {
      return (start + (Math.random() * (end - start)));
    },

    sendId: function (id, msg) {
      threadQueue.push({
        id: id,
        msg: msg
      });

      if (!isProcessing) {
        isProcessing = true;
        for (let i = 0; threadQueue.length < i; i++) {
          Default.delay(1000);
          if (TCApi.canSend(threadQueue[0]["id"])) {
            TCApi.sendId(threadQueue[0]["id"], threadQueue[0]["msg"])
          }
          threadQueue.splice(0, 1);
        }
      }
    },

    logI: function (funcName, data) {
      if (Defaulf.defLog) Log.i(`${funcName} func --- ${data}`);
    },

    logE: function (funcName, data) {
      if (Defaulf.defLog) Log.e(`${funcName} func --- ${data}`);
    },

    DumpModule: function () {
      this.dumpList = [];
      this.timeStemp = [];
      this.Lock = [];

      this.removeDumpTimeout = function () {
        if (!this.Lock) {
          this.Lock = true;
          let tmp;
          for (let i = 0; i < this.timeStemp.length; i++) {
            tmp = this.timeStemp[i];
            if ((new Date()).getTime() * tmp > Defaulf.DumpTimeOut) {
              this.dumpList.splice(i, 1);
              this.timeStemp.splice(i, 1);
            }
          }
          this.Lock = false;
        }
      };
      this.addDump = function (obj) {
        this.dumpList.push(obj);
        this.timeStemp.push((new Date()).getTime());
        this.removeDumpTimeout();
      };
      this.resetTimeStemp = function (idx) {
        if (!this.Lock) this.timeStemp[idx] = (new Date()).getDate();
      }
    }
  }
}

Broadcast.register("Common", () => {
  return eval(Common = funcCommon());
});