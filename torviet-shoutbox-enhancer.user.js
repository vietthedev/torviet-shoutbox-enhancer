// ==UserScript==
// @name         TorViet Shoutbox Enhancer
// @namespace    http://torviet.com/userdetails.php?id=1662
// @version      0.5.12
// @license      http://www.wtfpl.net/txt/copying/
// @homepageURL  https://github.com/S-a-l-a-d/TorViet-Shoutbox-Enhancer
// @supportURL   https://github.com/S-a-l-a-d/TorViet-Shoutbox-Enhancer/issues
// @icon         http://torviet.com/pic/salad.png
// @description  A small script to tweak the shoutbox
// @author       Salad
// @match        http://torviet.com/qa.php*
// @grant        GM_getValue
// @grant        GM_setValue
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

    inputSection.parentNode.style.padding = '0';

    // Override the default emoticons with the frequently used ones.
    emoGroupDetail.innerHTML = getEmoticons(524, 574) + getEmoticons(707) + getEmoticons(200, 234);

    clock.appendChild(emoGroup.parentNode);

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Let's see if the user is using Firefox to add the required key mapping event.  *
     * This method is taken from http://stackoverflow.com/questions/9847580/         *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    typeof InstallTrigger !== 'undefined' ?
        document.addEventListener('keypress', keyEvent) :
        document.addEventListener('keydown', keyEvent);

    // Here comes our own functions.
    function getEmoticons(start, end) {
        var emos = '';

        // We won't use a loop if we need only one emoticon.
        if (!end)
            emos = '<div style="height:43px;width:43px;float:left;display:inline-block;margin:1px;">' +
                '<a style="margin: 0;" class="btuEmotion" alt="[em' + start +
                ']"><img style="max-width: 43px; max-height: 43px" src="/pic/smilies/' + start +
                '.gif" alt=""></a></div>';
        else
            for (var i = start; i <= end; i++)
                emos += '<div style="height:43px;width:43px;float:left;display:inline-block;margin:1px;">' +
                    '<a style="margin: 0;" class="btuEmotion" alt="[em' + i +
                    ']"><img style="max-width: 43px; max-height: 43px" src="/pic/smilies/' + i +
                    '.gif" alt=""></a></div>';

        return emos;
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
                // Ctrl.
            case 17:
                // Ctrl + C.
            case 17 && 67:
                break;
            default:
                idQuestion.focus();
        }
    }

    function changeEmoGroup() {
        // Native JavaScript method to send an AJAX request.
        var request = new XMLHttpRequest();
        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
         * Asynchronous request sometimes doesn't work properly so we'll make it synchronous.  *
         * This process is fast enough so the user will hardly notice the unresponsive moment  *
         * while the browser is sending the request and receiving the response.                *
         * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
        request.open('POST', 'qa_smiley_ajax.php', false);
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.onreadystatechange = function() {
            request.readyState == 4 && request.status == 200 &&
                (emoGroupDetail.innerHTML = JSON.parse(request.responseText).str, addEmoGroupEvent())
        };
        request.send('group=' + emoGroup.value);
    }

    function addEmoGroupEvent() {
        // Let's add click events for the newly added emoticons.
        for (var i = 0, emos = emoGroupDetail.childNodes, len = emos.length; i < len; i++)
            emos[i].addEventListener('click', function(e) {
                idQuestion.value += e.target.parentNode.getAttribute('alt');
                idQuestion.focus();
            });
    }

    // The following should run at startup.
    addEmoGroupEvent();
    idQuestion.focus();
})();
