/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 TeamCloud의 저작물로 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////


let {
  Library
} = require("Library");
let {
  Common
} = require("Common");

let threadQueue = [];
let BackupList = Library.FileList;

(function () {
  function funcSystemManager() {
    let UserFile = Library.FileList.UserList;
    let PostFile = Library.FileList.PostList;
    let ItemType = Library.ItemType;
    let DBFileList = Library.DBFileList;

    let DB = {};
    let PostList = [];
    let UserList = [];

    let LoadData = function () {
      DB.BadgeItem = Common.read(DBFileList['BadgeItem']);
      DB.StarsItem = Common.read(DBFileList['StarsItem']);
      DB.FoodItem = Common.read(DBFileList['FoodItem']);
      DB.TicketItem = Common.read(DBFileList["TicketItem"]);
      DB.MandrelItem = Common.read(DBFileList["MandrelItem"]);
      DB.MineralItem = Common.read(DBFileList["MineralItem"]);
      PostList = Common.read(PostFile);
    }();

    let Find = function (id) {
      let rtnArr = [];
      let tmpPost = null;
      for (let i = 0; i < PostList.length; i++) {
        tmpPost = PostList[i];
        if (tmpPost.name === id) rtnArr.push(tmpPost);
      }
      return null;
    };
    let isUser = function (id) {
      let tmpUser = null;
      for (let i = 0; i < UserList.length; i++) {
        tmpUser = UserList[i];
        if (tmpUser.name === id) return true;
      }
      return false;
    };
    let FindItem = function (itemName) {
      let rtnObj = {
        type: "",
        index: "",
        name: ""
      };
      let tmpItem = null;
      for (let i = 0; i < Library.ItemType.length; i++) {
        let Type = Library.ItemType[i];
        tmpItem = DB.Type;
        for (let j = 0; j < tmpItem.length; j++) {
          if (tmpItem[j].name === itemName) {
            rtnObj = {
              type: Type,
              index: tmpItem[j].index,
              name: itemName
            }
            return rtnObj;
          }
        }
        return rtnObj;
      };
    }
    let Remove = function (index) {
      let tmpPost = null;
      for (let i = 0; i < PostList.length; i++) {
        tmpPost = PostList[i];
        if (tmpPost.index === index) {
          PostList.splice(i, 1);
          return true;
        }
      }
      return false;
    };

    return {
      getPostList: function (id) {
        for (let i = 0; i < PostList.length; i++) {
          if (PostList[i].id === id) return PostList[i];
        }
      },
      itemObj: function (itemName, count) {
        let itemObj = FindItem(itemName);
        itemObj.count = count;
        return itemObj;
      },
      sendPost: function (id, name, itemList, coin, message) {
        PostList.push({
          index: PostList.length + 1,
          id: id,
          name: name,
          itemList: itemList,
          coin: coin,
          message: message
        });
        Common.write(PostFile, PostList);
      },
      removePost: function (index) {
        let rtn = Remove(index);
        Common.write(PostFile, PostList);
        return rtn;
      },
      removePostAll: function (id) {
        for (let i = PostList.length - 1; i >= 0; i--) {
          if (PostList[i].id === id) {
            PostList.splice(i, 1);
            return true;
          }
        }
        Common.write(PostFile, PostList);
        return false;
      },

      isUserName: function (id) {
        return isUser(id);
      },
      getAllUser: function () {
        let UserList = Common.read(UserFile);
        let rtnArr = [];
        for (let i = 0; i < UserList.length; i++) {
          rtnArr.push(UserList[i].name);
        }
        return rtnArr;
      }
    }
  }


  module.exports = {
    SystemManager: funcSystemManager()
  };
})();