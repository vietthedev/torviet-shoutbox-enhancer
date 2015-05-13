// ==UserScript==
// @name         TorViet Shoutbox Enhancer
// @namespace    http://torviet.com/userdetails.php?id=1662
// @version      0.4.10
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
    // Remove unneeded elements
    $('#boxHead, .marquee, #sltTheme, #clock').remove();

    // Alter existing element CSS
    $('.all-wrapper').css({
        'background-image': 'none',
        'margin': 'auto',
        'height': $(window).height()
    });
    $('.input-section').parent().css('padding', '0px');
    $('.navigation_page').css('width', 'auto');
    $('#boxQuestion').css('height', $(window).height() - getRemainingHeight() - 20);
    $('#emo-section').css('height', $(window).height() - getRemainingHeight() - 22);
    $('.slimScrollDiv, .emo-group-detail').css('height', $(window).height() - getRemainingHeight() - 32);

    // Alter existing elements
    $('.emo-group-detail').empty();
    $('.emo-group-detail').append(getEmoticons(524, 574));
    $('.emo-group-detail').append(getEmoticons(707, 707));
    $('.emo-group-detail').append(getEmoticons(200, 234));

    // Add elements
    var myScript = document.createElement('script');
    myScript.type = 'text/javascript';
    myScript.innerHTML = 'function toggleEmoSlt() {' +
        '$(".emo-group-title-wrapper").slideToggle();' +
        '}';
    $('.input-section-a').append(myScript);
    $('.input-section-a').append('<input type="button" value="Toggle" onclick="toggleEmoSlt()" />');

    // Functions
    toggleEmoSlt();
    $('#idQuestion').focus();

    $('a.btuEmotion').click(function(){
        var x = $('#idQuestion').attr('value');
        $('#idQuestion').attr('value', x + $(this).attr('alt'));
        $('#idQuestion').focus();
    });

    if ($.browser.mozilla)
        $(document).keypress(changeEmoticonCollection);
    else
        $(document).keydown(changeEmoticonCollection);

    function getRemainingHeight() {
        return $('.input-section').parent().height() + $('.navigation_page').height();
    }

    function getEmoticons(start, end) {
        var emos = '';

        for (i = start; i <= end; i++) {
            var emo = '<div style="height:43px;width:43px;float:left;display:inline-block;margin:1px;"><a style="margin:0px 0px 0px 0px;" class="btuEmotion" alt="[em' + i + ']"><img style="max-width: 43px; max-height: 43px" src="/pic/smilies/' + i + '.gif" alt=""></a></div>';
            emos += emo;
        }

        return emos;
    }

    function changeEmoticonCollection(e) {
        if (e.keyCode == 40) {
            $('#emogroup option:selected').next().prop('selected', true);
            $('#emogroup').change();
        }
        if (e.keyCode == 38) {
            $('#emogroup option:selected').prev().prop('selected', true);
            $('#emogroup').change();
        }
    }
});
