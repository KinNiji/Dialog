export class SystemMessage {
  constructor(text) {
    this.type = "system";
    this.content = {
      text: text,
    };
  }
}

export class TextMessage {
  constructor(text, position) {
    this.type = "text";
    this.content = {
      text: text,
    };
    this.position = position;
  }
}

export class CardMessage {
  constructor(code, data, position) {
    this.type = "card";
    this.content = {
      code: code,
      data: data,
    };
    this.position = position;
  }
}

export class QuickReply {
  constructor(reply_list) {
    this.type = "quick-replies";
    this.content = {
      list: reply_list,
    };
  }
}
