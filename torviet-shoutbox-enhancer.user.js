// ==UserScript==
// @name         TorViet Shoutbox Enhancer
// @namespace    http://torviet.com/userdetails.php?id=1662
// @version      0.8.6
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
        var emoList     = GM_getValue('emoList'),
            emoListHtml = GM_getValue('emoListHtml') || '',
            emoHtml     = '';

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

            return answer.replace(/\s{2,}/g, ' ').trim().split(',');
        };
        var initemoList = function() {
            var emoListAvailable = [];
            for (var i = 0, options = emoGroup.options, len = options.length; i < len; i++) {
                emoListAvailable.push(options[i].text);
            }

            emoList = promptForEmoList('sử dụng', emoListAvailable);
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
                var emoListAvailable = [];
                for (var i = 0, options = emoGroup.options, len = options.length; i < len; i++) {
                    (emoList.indexOf(options[i].text) === -1) &&
                        emoListAvailable.push(options[i].text);
                }

                var emoListToAdd = promptForEmoList('thêm', emoListAvailable);
                for (var i = 0, len = emoListToAdd.length; i < len; i++) {
                    (emoList.indexOf(emoListToAdd[i]) === -1) &&
                        emoList.push(emoListToAdd[i]);
                }

                GM_setValue('emoList', emoList);
                GM_deleteValue('emoListHtml');
                location.href = 'qa.php';
            },
            remove: function() {
                var emoListToRemove = promptForEmoList('xóa', emoList);
                for (var i = 0, len = emoListToRemove.length; i < len; i++) {
                    var index = emoList.indexOf(emoListToRemove[i]);
                    (index > -1) && emoList.splice(index, 1);
                }

                GM_setValue('emoList', emoList);
                GM_deleteValue('emoListHtml');
                location.href = 'qa.php';
            },
            clear: function() {
                GM_deleteValue('emoList');
                GM_deleteValue('emoListHtml');
                location.href = 'qa.php';
            },
            getEmoticons: function(groupName) {
                var emoHtmlOld = emoHtml;
                do {
                    requestEmoticons(groupName);
                }
                while (emoHtml === emoHtmlOld);
                return emoHtml;
            },
            generateEmoticons: function(emoName) {
                makeEmoticonHtml(emoName);
                return emoHtml;
            },
            addEmosToEmoGroup: function() {
                emoGroupDetail.innerHTML = '';

                if (emoListHtml === '') {
                    for (var i = 0, len = emoList.length; i < len; i++) {
                        emoListHtml += isNaN(emoList[i]) ?
                            this.getEmoticons(emoList[i]) :
                        this.generateEmoticons(emoList[i]);
                    }

                    GM_setValue('emoListHtml', emoListHtml);
                }

                emoGroupDetail.innerHTML = emoListHtml;
            },
            addEmoGroupEvent: function() {
                // Let's add click events for the newly added emoticons.
                for (var i = 0, emos = emoGroupDetail.childNodes, len = emos.length; i < len; i++)
                    emos[i].firstChild.addEventListener('click', function(e) {
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
    while (clock.lastChild) {
        clock.removeChild(clock.lastChild);
    }

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
        '    margin          : 0 auto;'                                                +
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
                // Enter.
            case 13:
                var inputText = idQuestion.value;
                inputText = inputText.replace(/(:\^\))|(\/:\))/g, '[em528]');
                inputText = inputText.replace(/:\)/g, '[em564]');
                inputText = inputText.replace(/:\({2}/g, '[em7]');
                inputText = inputText.replace(/:\(/g, '[em561]');
                inputText = inputText.replace(/:x/g, '[em535]');
                inputText = inputText.replace(/:"\>/g, '[em23]');
                inputText = inputText.replace(/:\-?\*/g, '[em570]');
                inputText = inputText.replace(/=\(\(/g, '[em572]');
                inputText = inputText.replace(/:\-?[oO]/g, '[em222]');
                inputText = inputText.replace(/[xX]\-?\(/g, '[em541]');
                inputText = inputText.replace(/[bB]\-\)/g, '[em555]');
                inputText = inputText.replace(/\>:\)/g, '[em552]');
                inputText = inputText.replace(/\(:\|/g, '[em571]');
                inputText = inputText.replace(/:\|/g, '[em206]');
                inputText = inputText.replace(/:\-&/g, '[em37]');
                inputText = inputText.replace(/:\-?\?/g, '[em223]');
                inputText = inputText.replace(/=\)\)/g, '[em707]');
                inputText = inputText.replace(/:\-?[dD]/g, '[em536]');
                inputText = inputText.replace(/;;\)/g, '[em524]');
                inputText = inputText.replace(/:\-?\>/g, '[em537]');
                inputText = inputText.replace(/:\-[sS]/g, '[em558]');
                inputText = inputText.replace(/\[\-\(/g, '[em200]');
                inputText = inputText.replace(/=[pP]~/g, '[em566]');
                inputText = inputText.replace(/;\)\)/g, '[em18]');
                inputText = inputText.replace(/[tT]_[tT]/g, '[em544]');
                inputText = inputText.replace(/\-_\-/g, '[em136]');
                inputText = inputText.replace(/\(finger\)/g, '[em720]');
                idQuestion.value = inputText;
                break;
            default:
        }
    }

    // The following should run at startup.
    document.addEventListener('keydown', keyEvent);
    EMOTICON.checkemoList();
    EMOTICON.addEmosToEmoGroup();
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Let's see if the user is using Firefox.                                       *
     * This method is taken from http://stackoverflow.com/questions/9847580/         *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    typeof InstallTrigger === 'undefined' && EMOTICON.addEmoGroupEvent();
    idQuestion.focus();
})();
