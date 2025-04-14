/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 TeamCloud의 저작물로 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////


let {
  Library
} = require("Library"); //Library.js 파일을 불러옵니다.

let threadQueue = []; //스레드 큐

(function () {
  function Common() {
    return {
      /**
       * 
       * @param {String} path 파일 경로
       * @returns sdcard/TeamCloud/Project-Rumi/ + path
       */
      file: function (path) { //파일 경로를 반환합니다.
        return Library.rootPath + path;
      },

      /**
       * 
       * @param {String} path 파일 경로
       * @returns {Object} 파일을 읽어 반환합니다.
       */
      read: function (path) { //파일을 읽어 반환합니다.
        try {
          return JSON.parse(FileStream.read(this.file(path)));
        } catch (e) {
          this.logE("read()", e);
        }
      },

      /**
       * 
       * @param {String} path 파일 경로
       * @param {Object} obj 파일에 작성할 데이터
       */
      write: function (path, obj) { //파일에 데이터를 작성합니다.
        try {
          FileStream.write(this.file(path), JSON.stringify(obj));
        } catch (e) {
          this.logE("write()", e)
        }
      },

      /**
       * 
       * @param {String} path 파일 경로
       */
      remove: function (path) { //파일을 삭제합니다.
        try {
          FileStream.remove(this.file(path));
        } catch (e) {
          this.logE("remove()", e);
        }
      },


      /**
       * 
       * @param {Number} start 시작값
       * @param {Number} end 종료값
       * @returns {Number} start ~ end 사이의 랜덤값
       */
      Random: function (start, end) { //랜덤 실수값을 반환합니다.
        return (start + (Math.random() * (end - start)))
      },
      RandomFloor: function (start, end) { //랜덤 정수값을 반환합니다.
        return (start + Math.floor(Math.random() * (end - start + 1)));
      },
      RandomArray: function (arr) { //랜덤 배열값을 반환합니다.
        return arr[Math.floor(Math.random() * arr.length)];
      },

      logI: function (funcName, data) { //정보 로그를 출력합니다.
        Log.i(`${funcName} func --- ${data}`);
      },
      logE: function (funcName, data) { //에러 로그를 출력합니다.
        Log.i(`${funcName} func --- ${data}`);
      },

      DumpModule: function () {
        this.dumpList = []; //임시 데이터 저장
        this.timeStemp = []; //각 데이터 저장 시간 기록
        this.Lock = false; //순차적 작동을 위한 잠금장치

        this.removeDumpTimeout = function () { // 시간 초과된 데이터 삭제
          if (!this.Lock) { //잠겨있지 않다면
            this.Lock = true; //잠금 설정
            let tmp;
            for (let i = 0; i < this.timeStemp.length; i++) { //저장 시간 기록한 만큼 반복
              tmp = this.timeStemp[i]; //저장 시간 순차적으로 불러오기
              if ((new Date()).getTime() - tmp > Library.DumpTimeout) { //만약 정해진 시간보다 기록된 시간이 크다면
                this.dumpList.splice(i, 1); //임시 데이터 삭제
                this.timeStemp.splice(i, 1); //저장 시간 기록 삭제
              }
            }
            this.Lock = false; //모든 작업 종료 후 잠금 해제
          }
        };
        this.addDump = function (obj) { //임시 데이터 추가
          this.dumpList.push(obj); //새로운 데이터 추가
          this.timeStemp.push((new Date()).getTime()); //현재 시간 기록
          this.removeDumpTimeout(); //시간 초과된 데이터 확인 후 삭제
        };
        this.resetTimeStemp = function (i) { //저장 시간 기록 초기화
          if (!this.Lock) this.timeStemp[i] = (new Date()).getDate(); //잠겨있지 않다면 저장 시간을 재설정
        }
      }
    }
  }

  module.exports = {
    Common: Common()
  }
})();