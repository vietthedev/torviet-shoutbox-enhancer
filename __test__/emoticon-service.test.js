EmoticonService = require('../js/emoticon-service');
const emoticonService = new EmoticonService();

test('returns HTML for emoticon 707 when emoticon name is a whole number',
    () => {
        const result =
            `
            <div style="
                     height: 43px;
                     width: 43px;
                     float: left;
                     display: inline-block;
                     margin: 0 0 1px 1px;">
                <img style="
                          max-width: 43px;
                          max-height: 43px;
                          cursor: pointer;"
                      src="/pic/smilies/707.gif"
                      alt="[em707]">
            </div>
            `;

        expect(emoticonService.getEmoticon('707'))
            .toEqual(result);
    });

test('returns empty string when emoticon name is not a number', () => {
    expect(emoticonService.getEmoticon('abc'))
        .toEqual('');
});

test('returns empty string when emoticon name is a decimal', () => {
    expect(emoticonService.getEmoticon('1.1'))
        .toEqual('');
});
