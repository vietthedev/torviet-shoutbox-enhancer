// ==UserScript==
// @name         TorViet Shoutbox Enhancer
// @namespace    http://torviet.com/userdetails.php?id=1662
// @version      1.0.0
// @license      http://www.wtfpl.net/txt/copying/
// @homepageURL  https://github.com/S-a-l-a-d/TorViet-Shoutbox-Enhancer
// @supportURL   https://github.com/S-a-l-a-d/TorViet-Shoutbox-Enhancer/issues
// @icon         http://torviet.com/pic/salad.png
// @description  A small script to tweak the shoutbox
// @author       Salad
// @match        http://torviet.com/qa.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// ==/UserScript==

(() => {
    'use strict';

    let allWrapper = document.getElementById('all-wrapper'),
        boxHead = document.getElementById('boxHead'),
        marquee = document.getElementById('marquee'),
        sltTheme = document.getElementById('sltTheme'),
        boxQuestion = document.getElementById('boxQuestion'),
        clock = document.getElementById('clock'),
        idQuestion = document.getElementById('idQuestion'),
        emoGroup = document.getElementById('emo-group'),
        emoGroupDetail = document.getElementById('emo-group-detail'),
        apiPath = 'qa_smiley_ajax.php';

    class DomElementHelper {
        static addAfter(newElement, referenceElement) {
            if (!newElement) {
                console.error('New element is invalid.');
                return;
            }

            if (!referenceElement) {
                console.error('Reference element is invalid.');
                return;
            }

            referenceElement.parentNode
                .insertBefore(newElement, referenceElement.nextSibling);
        }

        static remove(element) {
            if (!element) {
                console.error('Element to be removed is invalid.');
                return;
            }

            element.parentNode.removeChild(element);
        }
    }

    class EmoticonService {
        getEmoticon(emoticonName) {
            if (isNaN(emoticonName) || !this.isInteger(emoticonName))
                return '';

            return `
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
                      src="/pic/smilies/${emoticonName}.gif"
                      alt="[em${emoticonName}]">
            </div>
            `;
        }

        isInteger(number) {
            return number == parseInt(number, 10);
        }

        getEmoticons(url, emoticonGroupName) {
            if (!url || !emoticonGroupName || !isNaN(emoticonGroupName))
                return null;

            return new Promise((resolve, reject) => {
                let request = new XMLHttpRequest();

                request.open('POST', url);
                request.setRequestHeader('Content-type',
                    'application/x-www-form-urlencoded');

                request.onload = () => {
                    if (request.status === 200) {
                        resolve(JSON.parse(request.responseText)
                            .str);
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

    const EMOTICON = (emoticonService => {
        let cachedEmoticonList = GM_getValue('emoticonList'),
            cachedEmoticonListHtml = GM_getValue('emoticonListHtml') ||
            '',
            emoticonHtml = '';

        let promptForEmoticonList = (action, emoticonList) => {
            let message =
                `Chọn bộ emoticon bạn muốn ${action}:\n`,
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
            let availableEmoticonList = Array.apply(null,
                    emoGroup.options)
                .map(element => element.text);

            cachedEmoticonList =
                promptForEmoticonList('sử dụng',
                    availableEmoticonList);

            if (cachedEmoticonList === '') return;

            GM_setValue('emoticonList', cachedEmoticonList);
        };
        return {
            emoticonListExists: () => {
                if (!cachedEmoticonList) initEmoticonList();
            },
            addToDom: async () => {
                emoGroupDetail.innerHTML = '';

                if (cachedEmoticonListHtml === '') {
                    for (let item of cachedEmoticonList) {
                        cachedEmoticonListHtml += isNaN(item) ?
                            await emoticonService.getEmoticons(
                                apiPath,
                                item) :
                            emoticonService.getEmoticon(item);
                    }

                    GM_setValue(
                        'emoticonListHtml',
                        cachedEmoticonListHtml);
                }

                emoGroupDetail.innerHTML =
                    cachedEmoticonListHtml;
            },
            add: () => {
                let availableEmoticonList = Array.apply(null,
                        emoGroup.options)
                    .map(element => element.text)
                    .filter(element =>
                        !cachedEmoticonList.includes(element));

                let emoticonListToAdd =
                    promptForEmoticonList('thêm',
                        availableEmoticonList);

                if (emoticonListToAdd === '') return;

                for (let emoticonGroup of emoticonListToAdd) {
                    if (!cachedEmoticonList.includes(
                            emoticonGroup))
                        cachedEmoticonList.push(emoticonGroup);
                }

                GM_setValue('emoticonList', cachedEmoticonList);
                GM_deleteValue('emoticonListHtml');
                location.href = location.pathname;
            },
            remove: () => {
                let emoticonListToRemove =
                    promptForEmoticonList('xóa',
                        cachedEmoticonList);

                if (emoticonListToRemove === '') return;

                for (let emoticonGroup of emoticonListToRemove) {
                    if (cachedEmoticonList.includes(
                            emoticonGroup))
                        cachedEmoticonList.splice(
                            cachedEmoticonList.indexOf(
                                emoticonGroup),
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
    })(new EmoticonService());

    function isFirefoxBrowser() {
        return typeof InstallTrigger !== 'undefined';
    }

    function createButton(text, event) {
        let button = document.createElement('input');
        button.type = 'button';
        button.value = text;
        button.addEventListener('click', event);

        return button;
    }

    allWrapper.className = '';
    DomElementHelper.remove(boxHead);
    DomElementHelper.remove(marquee);
    DomElementHelper.remove(sltTheme);
    while (clock.lastChild) {
        DomElementHelper.remove(clock.lastChild);
    }

    let stylesheet = isFirefoxBrowser() ?
        `
    #wrapper-below {
        height: calc(100% - 67px);
    }

    #emo-section {
        height: calc(100% - 74px);
    }
    ` :
        `
    #wrapper-below {
        height: calc(100% - 62px);
    }

    #emo-section {
        height: calc(100% - 69px);
    }
    `;

    GM_addStyle(
        `
    .slimScrollDiv, #emo-group-detail {
        height: 100% !important;
    }
    ` +
        stylesheet);

    let clockChild = document.createDocumentFragment(),
        span = document.createElement('span');

    span.innerHTML = 'For custom emoticon group<br>';

    clockChild.appendChild(emoGroup.parentNode);
    clockChild.appendChild(span);
    clockChild.appendChild(createButton('Add', EMOTICON.add));
    clockChild.appendChild(createButton('Remove', EMOTICON.remove));
    clockChild.appendChild(createButton('Clear', EMOTICON.clear));
    clock.appendChild(clockChild);

    EMOTICON.emoticonListExists();
    EMOTICON.addToDom();

    idQuestion.focus();

})();
