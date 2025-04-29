(function Chat() {
  let MessageType = Number;
  let chat = {
    message: {
      getType: Number,
      getId: String,
      getText: String,
      getMentions: Array,
      getReadMembers: Array,
      getSendTime: String,
      getNextChat: Object,
      getPrevChat: Object,
      isDeleted: Boolean,
      getDeletedText: String,
      Image: (isImage ? {
        hasImage: Boolean,
        getImage: String,
      } : null)
    }
  }
  module.exports = {
    Chat: Chat()
  };
})();