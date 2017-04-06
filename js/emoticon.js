const EMOTICON = (emoticonService => {
    let cachedEmoticonList = GM_getValue('emoticonList'),
        cachedEmoticonListHtml = GM_getValue('emoticonListHtml') || '',
        emoticonHtml = '';

    let promptForEmoticonList = (action, emoticonList) => {
        let message = `Chọn bộ emoticon bạn muốn ${action}:\n`,
            answer = '';

        emoticonList.forEach((item, index) => {
            message += `${index + 1}. ${item}\n`;
        });

        message +=
            'Điền tên bộ emoticon, ngăn cách bằng dấu phẩy, phân biệt hoa/thường.' +
            'Có thể điền emoticon đơn bằng cách điền tên tập tin emoticon đó.\nVí dụ: Voz,707,Rage';

        answer = prompt(message);

        if (!answer || answer.trim() === '') return '';

        return answer.replace(/\s{2,}/g, ' ')
            .trim()
            .split(',');
    };

    let initEmoticonList = () => {
        let availableEmoticonList = Array.apply(null, emoGroup.options)
            .map(element => element.text);

        cachedEmoticonList =
            promptForEmoticonList('sử dụng', availableEmoticonList);

        if (cachedEmoticonList === '') return;

        GM_setValue('emoticonList', cachedEmoticonList);
    };
    /* jshint ignore: start */
    return {
        emoticonListExists: () => {
            if (!cachedEmoticonList) initEmoticonList();
        },
        addToDom: async () => {
            emoGroupDetail.innerHTML = '';

            if (cachedEmoticonListHtml === '') {
                for (let item of cachedEmoticonList) {
                    cachedEmoticonListHtml += isNaN(item) ?
                        await emoticonService.getEmoticons(apiPath,
                            item) :
                        emoticonService.getEmoticon(item);
                }

                GM_setValue(
                    'emoticonListHtml', cachedEmoticonListHtml);
            }

            emoGroupDetail.innerHTML = cachedEmoticonListHtml;
        },
        add: () => {
            let availableEmoticonList = Array.apply(null, emoGroup.options)
                .map(element => element.text)
                .filter(element =>
                    !cachedEmoticonList.includes(element));

            let emoticonListToAdd =
                promptForEmoticonList('thêm', availableEmoticonList);

            if (emoticonListToAdd === '') return;

            for (let emoticonGroup of emoticonListToAdd) {
                if (!cachedEmoticonList.includes(emoticonGroup))
                    cachedEmoticonList.push(emoticonGroup);
            }

            GM_setValue('emoticonList', cachedEmoticonList);
            GM_deleteValue('emoticonListHtml');
            location.href = location.pathname;
        },
        remove: () => {
            let emoticonListToRemove =
                promptForEmoticonList('xóa', cachedEmoticonList);

            if (emoticonListToRemove === '') return;

            for (let emoticonGroup of emoticonListToRemove) {
                if (cachedEmoticonList.includes(emoticonGroup))
                    cachedEmoticonList.splice(
                        cachedEmoticonList.indexOf(emoticonGroup),
                        1);
            }

            GM_setValue('emoticonList', cachedEmoticonList);
            GM_deleteValue('emoticonListHtml');
            location.href = location.pathname;
        },
        clear: () => {
            GM_deleteValue('emoticonList');
            GM_deleteValue('emoticonListHtml');
            location.href = location.pathname;
        }

    };
    /* jshint ignore: end */
})(new EmoticonService());
