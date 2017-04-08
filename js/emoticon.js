const EMOTICON = (() => {
  let cachedEmoticonList = GM_getValue('emoticonList');
  let cachedEmoticonListHtml = GM_getValue('emoticonListHtml') || '';

  const promptForEmoticonList = (action, emoticonList) => {
    let message = `Chọn bộ emoticon bạn muốn ${action}:\n`;
    let answer = '';

    message += emoticonList.reduce((accumulator, current, index) =>
      accumulator + `${index + 1}. ${current}\n`, '');

    message += 'Điền tên bộ emoticon, ngăn cách bằng dấu phẩy, phân biệt hoa/thường. Có thể điền emoticon đơn bằng cách điền tên tập tin emoticon đó.\nVí dụ: Voz,707,Rage';

    answer = prompt(message);

    if (!answer || answer.trim()) { return null; }

    return answer.trim().split(',');
  };

  const initEmoticonList = () => {
    const availableEmoticonList = Array(...emoGroup.options).map(element => element.text);

    cachedEmoticonList = promptForEmoticonList('sử dụng', availableEmoticonList);

    if (!cachedEmoticonList) { return; }

    GM_setValue('emoticonList', cachedEmoticonList);
  };

  return {
    emoticonListExists: () => {
      if (!cachedEmoticonList) initEmoticonList();
    },
    addToDom: async () => {
      emoGroupDetail.innerHTML = '';

      if (cachedEmoticonListHtml === '') {
        cachedEmoticonListHtml = (await Promise.all(cachedEmoticonList.map(async (item) => {
          return isNaN(item) ?
            await EmoticonService.getEmoticons(apiPath, item) :
            await EmoticonService.getEmoticon(item);
        }))).join('');

        GM_setValue('emoticonListHtml', cachedEmoticonListHtml);
      }

      emoGroupDetail.innerHTML = cachedEmoticonListHtml;
    },
    add: () => {
      const availableEmoticonList = [...emoGroup.options)]
        .map(item => item.text)
        .filter(item => !cachedEmoticonList.includes(item));

      const emoticonListToAdd = promptForEmoticonList('thêm', availableEmoticonList);

      if (!emoticonListToAdd) { return; }

      cachedEmoticonList = [
        ...cachedEmoticonList,
        ...emoticonListToAdd.filter(item => !cachedEmoticonList.includes(item))
      ];

      GM_setValue('emoticonList', cachedEmoticonList);
      GM_deleteValue('emoticonListHtml');
      location.href = location.pathname;
    },
    remove: () => {
      const emoticonListToRemove = promptForEmoticonList('xóa', cachedEmoticonList);

      if (!emoticonListToRemove) { return; }

      cachedEmoticonList =
        cachedEmoticonList.filter(item => !emoticonListToRemove.includes(item));

      GM_setValue('emoticonList', cachedEmoticonList);
      GM_deleteValue('emoticonListHtml');
      location.href = location.pathname;
    },
    clear: () => {
      GM_deleteValue('emoticonList');
      GM_deleteValue('emoticonListHtml');
      location.href = location.pathname;
    },
  };
})();
