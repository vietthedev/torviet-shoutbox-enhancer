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
// ==/UserScript==

(function () {
    'use strict';

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
            return `<div style="height:43px;width:43px;float:left;display:inline-block;margin:0 0 1px 1px;">
            "<img style="max-width: 43px; max-height: 43px; cursor: pointer;" src="/pic/smilies/
            ${emoticonName}.gif" alt="[em${emoticonName}]"></div>`;
        }

        getEmoticonGroup(url, emoticonGroupName) {
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

    let allWrapper = document.getElementById('all-wrapper'),
        boxHead = document.getElementById('boxHead'),
        marquee = document.getElementById('marquee'),
        sltTheme = document.getElementById('sltTheme'),
        boxQuestion = document.getElementById('boxQuestion'),
        clock = document.getElementById('clock'),
        idQuestion = document.getElementById('idQuestion'),
        emoGroup = document.getElementById('emo-group'),
        emoGroupDetail = document.getElementById('emo-group-detail');

    allWrapper.className = '';
    DomElementHelper.remove(boxHead);
    DomElementHelper.remove(marquee);
    DomElementHelper.remove(sltTheme);
    while (clock.lastChild) {
        DomElementHelper.remove(clock.lastChild);
    }

})();
