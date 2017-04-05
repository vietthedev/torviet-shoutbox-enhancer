EmoticonService = require('../js/emoticon-service');

test('gets emoticon 707 HTML', () => {
    const emoticonService = new EmoticonService(),
        result =
        `<div style="height:43px;width:43px;float:left;display:inline-block;margin:0 0 1px 1px;">
            "<img style="max-width: 43px; max-height: 43px; cursor: pointer;" src="/pic/smilies/
            707.gif" alt="[em707]"></div>`;

    expect(emoticonService.getEmoticon('707')).toEqual(result);
});
