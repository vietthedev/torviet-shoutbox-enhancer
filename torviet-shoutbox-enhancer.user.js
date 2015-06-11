// ==UserScript==
// @name         TorViet Shoutbox Enhancer
// @namespace    http://torviet.com/userdetails.php?id=1662
// @version      0.6.2
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

(function() {
    // First let's get the elements which we will work on.
    var boxHead        = document.getElementById('boxHead'),
        marquee        = document.getElementsByClassName('marquee')[0],
        sltTheme       = document.getElementById('sltTheme'),
        clock          = document.getElementById('clock'),
        inputSection   = document.getElementsByClassName('input-section')[0],
        idQuestion     = document.getElementById('idQuestion'),
        navigationPage = document.getElementsByClassName('navigation_page')[0],
        emoGroup       = document.getElementById('emogroup'),
        emoGroupDetail = document.getElementsByClassName('emo-group-detail')[0];

    // Also create a namespace.
    var EMOTICON = (function() {
        var emoList = GM_getValue('emoList'),
            emoHtml = '';

        var promptForEmoList = function(action, list) {
            var message = 'Chọn bộ emoticon bạn muốn' + ' ' + action + ':\n',
                answer;

            for (var i = 0, len = list.length; i < len; i++) {
                message += i + 1 + '. ' + list[i] + '\n';
            }
            message += 'Điền tên bộ emoticon, ngăn cách bằng dấu phẩy, phân biệt hoa/thường.' + ' ' +
                'Có thể điền emoticon đơn bằng cách điền tên tập tin emoticon đó.\nVí dụ: Voz,707,Rage';

            do {
                answer = prompt(message);
            }
            while (!answer || answer.trim() === '');

            return answer.replace(/\s+/g, '').split(',');
        };
        var initemoList = function() {
            emoList = promptForEmoList('sử dụng');
            GM_setValue('emoList', emoList);
        };
        var requestEmoticons = function(groupName) {
            var request = new XMLHttpRequest();
            /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
             * Using synchronous request here is the simplest implementation to make it work.      *
             * This process is fast enough so the user will hardly notice the unresponsive moment  *
             * while the browser is sending the request and receiving the response.                *
             * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
            request.open('POST', 'qa_smiley_ajax.php', false);
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            request.onreadystatechange = function() {
                request.readyState == 4 && request.status == 200 &&
                    (emoHtml = JSON.parse(request.responseText).str);
            };
            request.send('group=' + groupName);
        };
        var makeEmoticonHtml = function(emoName) {
            emoHtml = '<div style="height:43px;width:43px;float:left;display:inline-block;margin:1px;">' +
                '<a style="margin: 0;" class="btuEmotion" alt="[em' + emoName                            +
                ']"><img style="max-width: 43px; max-height: 43px" src="/pic/smilies/' + emoName         +
                '.gif" alt=""></a></div>';   
        };

        return {
            checkemoList: function() {
                !emoList && initemoList();
            },
            add: function() {
                var emoGroupRemain = [];
                for (var i = 0, options = emoGroup.options, len = options.length; i < len; i++) {
                    (emoList.indexOf(options[i].text) === -1) &&
                        emoGroupRemain.push(options[i].text);
                }

                var emoListToAdd = promptForEmoList('thêm', emoGroupRemain);
                for (var i = 0, len = emoListToAdd.length; i < len; i++) {
                    (emoList.indexOf(emoListToAdd[i]) === -1) &&
                        emoList.push(emoListToAdd[i]);
                }

                GM_setValue('emoList', emoList);
                location.href = 'qa.php';
            },
            remove: function() {
                var emoListToRemove = promptForEmoList('xóa', emoList);
                for (var i = 0, len = emoListToRemove.length; i < len; i++) {
                    var index = emoList.indexOf(emoListToRemove[i]);
                    (index > -1) && emoList.splice(index, 1);
                }

                GM_setValue('emoList', emoList);
                location.href = 'qa.php';
            },
            clear: function() {
                GM_deleteValue('emoList');
                location.href = 'qa.php';
            },
            getEmoticons: function(groupName) {
                requestEmoticons(groupName);
                return emoHtml;
            },
            generateEmoticons: function(emoName) {
                makeEmoticonHtml(emoName);
                return emoHtml;
            },
            addEmosToEmoGroup: function() {
                emoGroupDetail.innerHTML = '';
                for (var i = 0, len = emoList.length; i < len; i++) {
                    emoGroupDetail.innerHTML += isNaN(emoList[i]) ?
                        this.getEmoticons(emoList[i]) :
                    this.generateEmoticons(emoList[i]);
                }
            },
            addEmoGroupEvent: function() {
                // Let's add click events for the newly added emoticons.
                for (var i = 0, emos = emoGroupDetail.childNodes, len = emos.length; i < len; i++)
                    emos[i].addEventListener('click', function(e) {
                        idQuestion.value += e.target.parentNode.getAttribute('alt');
                        idQuestion.focus();
                    });
            }
        };
    })();

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Now remove the unnecessary elements including the box containing new torrents *
     * and football news, the warning, the theme drop-down list and the clock.       *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    boxHead.parentNode.removeChild(boxHead);
    marquee.parentNode.removeChild(marquee);
    sltTheme.parentNode.removeChild(sltTheme);
    clock.innerHTML = '';

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Here we get the window height of the current window size and the height *
     * without the input section and the div holding the navigation.           *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    var windowHeight    = window.innerHeight,
        remainingHeight = inputSection.parentNode.offsetHeight + navigationPage.offsetHeight - 100;

    // And polish things with our custom CSS.
    GM_addStyle(
        '.all-wrapper {'                                                               +
        '    background-image: none !important;'                                       +
        '    height          : ' + windowHeight + 'px;'                                +
        '    margin          : auto;'                                                  +
        '}'                                                                            +
        '.all-wrapper > :nth-child(2) {'                                               +
        '    padding: 0 !important;'                                                   +
        '}'                                                                            +
        '.navigation_page {'                                                           +
        '    width: auto;'                                                             +
        '}'                                                                            +
        '#boxQuestion {'                                                               +
        '    height: ' + (windowHeight - remainingHeight) + 'px;'                      +
        '}'                                                                            +
        '.q-head {'                                                                    +
        '    border-radius: 0;'                                                        +
        '}'                                                                            +
        '#clock {'                                                                     +
        '    height    : 72px;'                                                        +
        '    text-align: center;'                                                      +
        '}'                                                                            +
        '#emo-section, .slimScrollDiv, .emo-group-detail {'                            +
        '    height : ' + (windowHeight - remainingHeight - 72 - 6) + 'px !important;' +
        '    padding: 0 !important;'                                                   +
        '}'
    );

    var toBeAppendedToClock = document.createDocumentFragment(),
        someText            = document.createElement('span'),
        btnAdd              = document.createElement('input'),
        btnRemove           = document.createElement('input'),
        btnClear            = document.createElement('input');

    someText.innerHTML = 'For custom emoticon group<br />';

    btnAdd.type  = 'button';
    btnAdd.value = 'Add';
    btnAdd.addEventListener('click', EMOTICON.add);

    btnRemove.type  = 'button';
    btnRemove.value = 'Remove';
    btnRemove.addEventListener('click', EMOTICON.remove);

    btnClear.type  = 'button';
    btnClear.value = 'Clear';
    btnClear.addEventListener('click', EMOTICON.clear);

    toBeAppendedToClock.appendChild(emoGroup.parentNode);
    toBeAppendedToClock.appendChild(someText);
    toBeAppendedToClock.appendChild(btnAdd);
    toBeAppendedToClock.appendChild(btnRemove);
    toBeAppendedToClock.appendChild(btnClear);
    clock.appendChild(toBeAppendedToClock);

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Let's see if the user is using Firefox to add the required key mapping event. *
     * This method is taken from http://stackoverflow.com/questions/9847580/         *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    var isFirefox = typeof InstallTrigger !== 'undefined';
    isFirefox ? document.addEventListener('keypress', keyEvent) :
    document.addEventListener('keydown', keyEvent);

    // Here comes our own functions.
    function changeEmoGroup() {
        emoGroupDetail.innerHTML = EMOTICON.getEmoticons(emoGroup.value);
        EMOTICON.addEmoGroupEvent();
    }

    function keyEvent(e) {
        switch (e.keyCode) {
                // Down arrow.
            case 40:
                emoGroup !== document.activeElement &&
                    emoGroup.selectedIndex !== emoGroup.length - 1 &&
                    emoGroup.selectedIndex++;
                changeEmoGroup();
                break;
                // Up arrow.
            case 38:
                emoGroup !== document.activeElement &&
                    emoGroup.selectedIndex !== 0 &&
                    emoGroup.selectedIndex--;
                changeEmoGroup();
                break;
            default:
        }
    }

    // The following should run at startup.
    EMOTICON.checkemoList();
    EMOTICON.addEmosToEmoGroup();
    !isFirefox && EMOTICON.addEmoGroupEvent();
    idQuestion.focus();
})();
