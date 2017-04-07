class EmoticonService {
    /**
     * Constructs the emoticon HTML from the name.
     *
     * @param {string} emoticonName - The name of the emoticon.
     * @returns {string}
     *
     * @memberOf EmoticonService
     */
  static getEmoticon(emoticonName) {
    if (isNaN(emoticonName) || !this.isInteger(emoticonName)) return Promise.resolve('');

    return Promise.resolve(`<div style="height:43px;width:43px;float:left;display:inline-block;margin: 0 0 1px 1px;"><img style="max-width:43px;max-height:43px;cursor:pointer;" src="/pic/smilies/${emoticonName}.gif" alt="[em${emoticonName}]"></div>`);
  }

    /**
     * Returns a Boolean value that indicates whether the number is an Integer.
     *
     * @param {number} number - The number to be checked.
     * @returns {Boolean}
     *
     * @memberOf EmoticonService
     */
  static isInteger(number) {
    return number === parseInt(number, 10) || number === parseInt(number, 10).toString();
  }

    /**
     * Calls the API to get the emoticon group HTML.
     *
     * @param {string} url - The URL of the API.
     * @param {string} emoticonGroupName - The name of the emoticon group.
     * @returns {string}
     *
     * @memberOf EmoticonService
     */
  static getEmoticons(url, emoticonGroupName) {
    if (!url || !emoticonGroupName || !isNaN(emoticonGroupName)) { return null; }

    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();

      request.open('POST', url);
      request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

      request.onload = () => {
        if (request.status === 200) {
          resolve(JSON.parse(request.responseText).str);
        } else {
          reject(Error(request.statusText));
        }
      };

      request.onerror = () => {
        reject(Error('Network error'));
      };

      request.send(`group=${emoticonGroupName}`);
    });
  }
}

module.exports = EmoticonService;
