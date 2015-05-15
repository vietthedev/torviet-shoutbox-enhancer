// ==UserScript==
// @name         TorViet Shoutbox Enhancer
// @namespace    http://torviet.com/userdetails.php?id=1662
// @version      0.4.16
// @license      http://www.wtfpl.net/txt/copying/
// @homepageURL  https://github.com/S-a-l-a-d/TorViet-Shoutbox-Enhancer
// @supportURL   https://github.com/S-a-l-a-d/TorViet-Shoutbox-Enhancer/issues
// @icon         http://torviet.com/pic/salad.png
// @description  A small script to simplify the shoutbox
// @author       Salad
// @match        http://torviet.com/qa.php*
// @grant        none
// ==/UserScript==

$(function(){
    // Remove unneeded elements.
    $('#boxHead, .marquee, #sltTheme, #clock').remove();

    // Alter existing element CSS.
    var windowHeight = $(window).height();
    var remainingHeight = $('.input-section').parent().height() + $('.navigation_page').height();

    $('.all-wrapper').css({
        'background-image': 'none',
        'margin': 'auto',
        'height': windowHeight
    });
    $('.input-section').parent().css('padding', '0px');
    $('.navigation_page').css('width', 'auto');
    $('#boxQuestion').css('height', windowHeight - remainingHeight - 20);
    $('#emo-section').css('height', windowHeight - remainingHeight - 22);
    $('.slimScrollDiv, .emo-group-detail').css('height', windowHeight - remainingHeight - 32);

    // Alter existing elements.
    $('.emo-group-detail').empty().append(getEmoticons(524, 574), getEmoticons(707), getEmoticons(200, 234));

    // Add elements.
    var myScript = document.createElement('script');
    myScript.type = 'text/javascript';
    myScript.innerHTML = 'function toggleEmoSlt(){$(".emo-group-title-wrapper").slideToggle();}';
    $('.input-section-a').append(myScript, '<input type="button" value="Toggle" onclick="toggleEmoSlt()" />');

    // Firefox detection.
    if (typeof InstallTrigger !== 'undefined')
        $(window).keypress(changeEmoGroup);
    else
        $(window).keydown(changeEmoGroup);

    // Override functions.
    $('a.btuEmotion').click(function() {
        $('#idQuestion').get(0).value += $(this).attr('alt');
        $('#idQuestion').focus();
    });

    // Custom functions.
    function getEmoticons(start, end) {
        var emos = '';

        if (end === undefined)
            emos = '<div style="height:43px;width:43px;float:left;display:inline-block;margin:1px;"><a style="margin:0px 0px 0px 0px;" class="btuEmotion" alt="[em' + start +
                ']"><img style="max-width: 43px; max-height: 43px" src="/pic/smilies/' + start +
                '.gif" alt=""></a></div>';
        else
            for (i = start; i <= end; i++)
                emos += '<div style="height:43px;width:43px;float:left;display:inline-block;margin:1px;"><a style="margin:0px 0px 0px 0px;" class="btuEmotion" alt="[em' + i +
                    ']"><img style="max-width: 43px; max-height: 43px" src="/pic/smilies/' + i +
                    '.gif" alt=""></a></div>';

        return emos;
    }

    function changeEmoGroup(e) {
        switch (e.keyCode) {
            case 40:
                $('#emogroup option:selected').next().prop('selected', true);
                $('#emogroup').change();
                break;
            case 38:
                $('#emogroup option:selected').prev().prop('selected', true);
                $('#emogroup').change();
                break;
            default:
        }
    }

    // Run at startup.
    toggleEmoSlt();
    $('#idQuestion').focus();
});
