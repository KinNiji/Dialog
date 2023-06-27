export default class Question {
  constructor(data) {
    this.id = data.id;
    this.description = data.description;
    this.type = data.question_type;
    this.pic_path = data.pic_path;
    this.name = data.question_name;
    this.text = data.question_text;
    this.options = [];
    for (let option of data.question_options) {
      this.options.push({
        label: option.option_text,
        value: option.option_score,
      });
    }
    this.created = new Date(data.created);
    this.updated = new Date(data.updated);
  }
}
