class Code {
  _key = 'vatc6be7fghilmop89qrs1xu4wydz02jk35n';

  constructor(){}

  sum(m, n) {
    return Math.floor(Math.random() * (m - n) + n);
  }

  getRandomChar() {
    let index = this.sum(1, this._key.length);
    let result = this._key.charAt(index);
    return result;
  }

  generateBaseCode(count) {
    let result = '';
    for (let i = 0; i < count; i++) {
      result += this.getRandomChar();
    }
    return result;
  }

  insertAtEvery(str = '', num = 1, char = ' ') {
    str = str.split('').reverse().join('');
    const regex = new RegExp('.{1,' + num + '}', 'g');
    str = str.match(regex).join(char);
    str = str.split('').reverse().join('');
    return str;
  }

  encode(src) {
    let result = '';
    for (let i = 0; i < src.length; i++) {
      result += src.charAt(i) + this.getRandomChar();
    }
    return this.insertAtEvery(result.toUpperCase(), 4, '-');
  }

  decode(src) {
    let result = '';
    const str = src.toLowerCase().split('-').join('');
    for (let j = 0; j < str.length; j++) {
      if (j % 2 == 0) {
        result += str.charAt(j);
      }
    }
    return result;
  }
}

module.exports = { 
  Code
}