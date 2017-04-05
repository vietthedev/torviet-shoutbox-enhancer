class EmoticonService {
    /**
     * Constructs the emoticon HTML from the name.
     * 
     * @param {string} emoticonName 
     * @returns {string}
     * 
     * @memberOf EmoticonService
     */
    getEmoticon(emoticonName) {
        return `<div style="height:43px;width:43px;float:left;display:inline-block;margin:0 0 1px 1px;">
            "<img style="max-width: 43px; max-height: 43px; cursor: pointer;" src="/pic/smilies/
            ${emoticonName}.gif" alt="[em${emoticonName}]"></div>`;
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
    getEmoticonGroup(url, emoticonGroupName) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();

            request.open('POST', url);
            request.setRequestHeader('Content-type',
                'application/x-www-form-urlencoded');

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

            request.send('group=' + emoticonGroupName);
        });
    }
}

module.exports = EmoticonService;
