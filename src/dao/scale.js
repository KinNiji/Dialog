export default class Scale {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.abb = this.name.match(/[（()](.*?)[）)]/)[1];
    this.description = data.description;
    this.rules = data.rules;
    this.questions = JSON.parse(data.questions);
    this.index = 0;
    this.created = new Date(data.created);
    this.updated = new Date(data.updated);
  }
}
