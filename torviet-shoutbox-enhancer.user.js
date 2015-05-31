// ==UserScript==
// @name         TorViet Shoutbox Enhancer
// @namespace    http://torviet.com/userdetails.php?id=1662
// @version      0.5.10
// @license      http://www.wtfpl.net/txt/copying/
// @homepageURL  https://github.com/S-a-l-a-d/TorViet-Shoutbox-Enhancer
// @supportURL   https://github.com/S-a-l-a-d/TorViet-Shoutbox-Enhancer/issues
// @icon         http://torviet.com/pic/salad.png
// @description  A small script to simplify the shoutbox
// @author       Salad
// @match        http://torviet.com/qa.php*
// @grant        none
// ==/UserScript==

(function() {
    // Declare variables
    var boxHead = document.getElementById('boxHead'),
        marquee = document.getElementsByClassName('marquee')[0],
        sltTheme = document.getElementById('sltTheme'),
        clock = document.getElementById('clock'),
        allWrapper = document.getElementsByClassName('all-wrapper')[0],
        inputSection = document.getElementsByClassName('input-section')[0],
        idQuestion = document.getElementById('idQuestion'),
        navigationPage = document.getElementsByClassName('navigation_page')[0],
        boxQuestion = document.getElementById('boxQuestion'),
        emoGroup = document.getElementById('emogroup'),
        emoGroupDetail = document.getElementsByClassName('emo-group-detail')[0],
        windowHeight,
        remainingHeight,
        btnToggle;

    // Remove unneeded elements.
    boxHead.parentNode.removeChild(boxHead);
    marquee.parentNode.removeChild(marquee);
    sltTheme.parentNode.removeChild(sltTheme);
    clock.parentNode.removeChild(clock);

    // Alter existing element CSS.
    windowHeight = window.innerHeight;
    remainingHeight = inputSection.parentNode.offsetHeight + navigationPage.offsetHeight - 100;

    allWrapper.setAttribute('style', 'background: none; margin: auto; height: ' + windowHeight + 'px');
    inputSection.parentNode.style.padding = '0px';
    navigationPage.style.width = 'auto';
    boxQuestion.style.height = windowHeight - remainingHeight + 2 + 'px';
    emoGroupDetail.parentNode.parentNode.style.height =
        emoGroupDetail.parentNode.style.height =
        emoGroupDetail.style.height = windowHeight - remainingHeight + 'px';

    // Alter existing elements.
    emoGroupDetail.innerHTML = getEmoticons(524, 574) + getEmoticons(707) + getEmoticons(200, 234);

    // Add elements.
    btnToggle = document.createElement('input');
    btnToggle.type = 'button';
    btnToggle.value = 'Toggle';
    btnToggle.onclick = toggleEmoSlt;
    idQuestion.parentNode.insertBefore(btnToggle, null);

    // Add event listeners.
    // Firefox detection.
    typeof InstallTrigger !== 'undefined' ? document.addEventListener('keypress', keyEvent) : document.addEventListener('keydown', keyEvent);

    // Custom functions.
    function toggleEmoSlt() {
        emoGroup.parentNode.style.display = emoGroup.offsetParent ? 'none' : 'block';
    }

    function getEmoticons(start, end) {
        var emos = '';
        
        if (end === void 0)
            emos = '<div style="height:43px;width:43px;float:left;display:inline-block;margin:1px;"><a style="margin: 0;" class="btuEmotion" alt="[em' + start +
                ']"><img style="max-width: 43px; max-height: 43px" src="/pic/smilies/' + start +
                '.gif" alt=""></a></div>';
        else
            for (var i = start; i <= end; i++)
                emos += '<div style="height:43px;width:43px;float:left;display:inline-block;margin:1px;"><a style="margin: 0;" class="btuEmotion" alt="[em' + i +
                    ']"><img style="max-width: 43px; max-height: 43px" src="/pic/smilies/' + i +
                    '.gif" alt=""></a></div>';

        return emos;
    }

    function keyEvent(e) {
        switch (e.keyCode) {
            // Down arrow.
            case 40:
                (emoGroup !== document.activeElement) && (emoGroup.selectedIndex !== emoGroup.length - 1) && emoGroup.selectedIndex++;
                changeEmoGroup();
                break;
            // Up arrow.
            case 38:
                (emoGroup !== document.activeElement) && (emoGroup.selectedIndex !== 0) && emoGroup.selectedIndex--;
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
        var request = new XMLHttpRequest();
        request.open('POST', 'qa_smiley_ajax.php', 0);
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.onreadystatechange = function() {
            request.readyState == 4 && request.status == 200 &&
                (emoGroupDetail.innerHTML = JSON.parse(request.responseText).str, addEmoGroupEvent())
        };
        request.send('group=' + emoGroup.value);
    }

    function addEmoGroupEvent() {
        for (var i = 0, emos = emoGroupDetail.childNodes, len = emos.length; i < len; i++)
            emos[i].addEventListener('click', function(e) {
                idQuestion.value += e.target.parentNode.getAttribute('alt');
                idQuestion.focus();
            });
    }

    // Run at startup.
    toggleEmoSlt();
    addEmoGroupEvent();
    idQuestion.focus();
})();
