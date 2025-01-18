function funcCommon() {
  return {
    file: function (path) {
      return Default.rootPath + path;
    },

    read: function (path) {
      try {
        return JSON.parse(Defaulf.FS.read(this.file(path)));
      } catch (e) {
        this.logE("read()", e);
      }
    },

    write: function (path, obj) {
      try {
        Default.FS.write(this.file(path), JSON.stringify(obj));
      } catch (e) {
        this.logE("write()", e);
      }
    },

    remove: function (path) {
      try {
        Default.FS.remove(this.file(path));
      } catch (e) {
        this.logE("remove", e);
      }
    },

    Random: function (start, end) {
      return (start + Math.floor(Math.random() * (end - start + 1)));
    },

    RandomFloat: function (start, end) {
      return (start + (Math.random() * (end - start)));
    },

    logI: function (funcName, data) {
      if (Defaulf.defLog) Log.i(`${funcName} func --- ${data}`);
    },

    logE: function (funcName, data) {
      if (Defaulf.defLog) Log.e(`${funcName} func --- ${data}`);
    },

    DumpModule: function () {
      this.dumpList = []; //임시 데이터 저장
      this.timeStemp = []; //각 데이터 저장 시간 기록
      this.Lock = false; //순차적 작동을 위한 잠금장치

      this.removeDumpTimeout = function () {
        if (!this.Lock) {
          this.Lock = true;
          let tmp;
          for (let i = 0; i < this.timeStemp.length; i++) {
            tmp = this.timeStemp[i];
            if ((new Date()).getTime() - tmp > Defaulf.DumpTimeOut) { //일정시간이 지난 데이터 확인
              this.dumpList.splice(i, 1); //삭제
              this.timeStemp.splice(i, 1); //삭제
            }
          }
          this.Lock = false;
        }
      };
      this.addDump = function (obj) {
        this.dumpList.push(obj); //새로운 데이터 추가
        this.timeStemp.push((new Date()).getTime()); //현재 시간 기록
        this.removeDumpTimeout(); //시간 초과된 데이터 확인 후 삭제
      };
      this.resetTimeStemp = function (idx) {
        if (!this.Lock) this.timeStemp[idx] = (new Date()).getDate();
      };
    }
  };
}