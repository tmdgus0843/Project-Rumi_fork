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

importPackage(java.util);
importPackage(java.util.zip);
importPackage(java.io);

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


    // GitHub API에서 최신 릴리즈 가져오기
    let githubRelease = function () {
      try {
        const GITHUB_API_URL = `https://api.github.com/repos/teamcloud-office/project-rumi/releases`;

        // Jsoup을 사용해 GET 요청 보내기
        let releases = org.jsoup.Jsoup.connect(GITHUB_API_URL)
          .header("Accept", "application/vnd.github+json")
          .header("Authorization", `Bearer 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`)
          .header("X-GitHub-Api-Version", "2022-11-28")
          .ignoreContentType(true)
          .ignoreHttpErrors(true)
          .method(org.jsoup.Connection.Method.GET)
          .execute()
          .body();

        if (releases.length() > 0) {
          let latestRelease = JSON.parse(releases)[0]; // 가장 최신 릴리즈
          return {
            id: 200,
            message: "Success",
            releases_id: latestRelease.id,
            name: latestRelease.name,
            tag_name: latestRelease.tag_name,
            date: latestRelease.published_at,
            download: latestRelease.assets[0].browser_download_url,
            body: latestRelease.body
          };
        }
        return {
          id: 404,
          message: "No releases found"
        };
      } catch (e) {
        return {
          id: 400,
          message: "Failed to fetch releases: " + e.message
        };
      }
    };


    let fileDownload = function (link, path, fileName) {
      let url = new java.net.URL(link)
      let Paths = java.nio.file.Paths
      let Option = java.nio.file.StandardCopyOption;
      let stream = url.openStream();
      if (fileName === undefined) fileName = new Paths.get(url.getPath()).getFileName().toString();
      let path = new Paths.get(path, fileName);
      new java.nio.file.Files.copy(stream, path, Option.REPLACE_EXISTING);
    };

    let unZip = function (zip, path) {
      let zipFile = new File("sdcard/TeamCloud/Project-Rumi/zips/" + zip);
      let outputFolder = new File(path);
      if (!outputFolder.exists()) {
        outputFolder.mkdirs();
      }
      let fis = new FileInputStream(zipFile);
      let zis = new ZipInputStream(fis);
      let buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
      let entry;
      while ((entry = zis.getNextEntry()) != null) {
        let newFile = new File(outputFolder, entry.getName());
        if (entry.isDirectory()) {
          newFile.mkdirs();
        } else {
          new File(newFile.getParent()).mkdirs();

          let fos = new FileOutputStream(newFile);
          let len;
          while ((len = zis.read(buffer)) > 0) {
            fos.write(buffer, 0, len);
          }
          fos.close();
        }
        zis.closeEntry();
      }
      zis.close();
      fis.close();
    };


    let FileMove = function (file, version) {
      for (let i = 0; i < file.length; i++) {
        let type = "module";
        let sourceFile = new File("/sdcard/TeamCloud/Project-Rumi/codes/" + version + "/script/" + file[i]);
        if (["System.js", "Main.js"].includes(file[i])) type = "script";
        let destFile = new File("/sdcard/MessagerBotR/" + (type === "script" ? "Bots/" + file[i].replace(".js", "") + "/" : "global_modules/") + file[i]);

        if (!sourceFile.exists()) return;
        let destDir = destFile.getParentFile();
        if (!destDir.exists()) destDir.mkdirs();
        let fis = new FileInputStream(sourceFile);
        let fos = new FileOutputStream(destFile);
        let buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
        let bytesRead;
        while ((bytesRead = fis.read(buffer)) !== -1) {
          fos.write(buffer, 0, bytesRead);
        }
        fis.close();
        fos.close();
      }
    }

    let BackUp = function () {
      let day = new Date();
      let mkTwoNumber = function (num) {
        return (num < 10 ? "0" + num : num);
      }
      let backupFolder = `${Library.rootPath}Backup/${mkTwoNumber(day.getFullYear())}/${mkTwoNumber(day.getMonth() + 1)}/${mkTwoNumber(day.getDate())}/${mkTwoNumber(day.getHours())}/${mkTwoNumber(day.getMinutes())}/`;

      for (path in Library.FileList) {
        FileStream.write(`${backupFolder}${Library.FileList[path]}`, FileStream.read(Library.rootPath + Library.FileList[path]));
      }
      for (path in Library.DBFileList) {
        FileStream.write(`${backupFolder}${Library.DBFileList[path]}`, FileStream.read(Library.rootPath + Library.DBFileList[path]));
      }
      return `백업이 완료되었어요.`;
    }



    const Intent = Packages.android.content.Intent;
    const Uri = Packages.android.net.Uri;
    const File = Packages.java.io.File;
    const Long = Packages.java.lang.Long;
    const Integer = Packages.java.lang.Integer;
    /**
     * 
     * @param {BigInt} channelId 방 고유번호
     * @param {String} path 이미지 경로
     */
    let sendImage = function (channelId, path) {
      const context = App.getContext();
      const intent = new Intent(Intent.ACTION_SENDTO);
      intent.setPackage("com.kakao.talk");
      intent.setType("image/*");

      const fileUri = Uri.fromFile(new File(path));
      intent.putExtra(Intent.EXTRA_STREAM, fileUri);

      const channelIdLong = new Long(channelId.toString());
      intent.putExtra("key_id", channelIdLong);
      intent.putExtra("key_type", new Integer(1));
      intent.putExtra("key_from_direct_share", true);

      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      context.startActivity(intent);
    }



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
      },


      BackUp: function () {
        return BackUp();
      },


      getRelease: function () {
        return githubRelease();
      },
      getFileDownload: function (url, path, fileName) {
        return fileDownload(url, path, fileName);
      },
      unZip: function (zip) {
        return unZip(zip);
      },
      FileMove: function (file, version) {
        return FileMove(file, version);
      },


      sendImage: function (channelId, path) {
        return sendImage(channelId, path);
      }
    }
  }


  module.exports = {
    SystemManager: funcSystemManager()
  };
})();