// ==UserScript==
// @name         TorViet Shoutbox Enhancer
// @namespace    http://torviet.com/userdetails.php?id=1662
// @version      0.4.7
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
    // Remove unneeded stuffs
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

    // Alter existing element attributes
    $('#emogroup option:contains("Voz")').prop('selected', true);

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
    $('#emogroup').change();
    $('#idQuestion').focus();
    
    setTimeout(function(){
        addEmoticons(707, 707);
        addEmoticons(200, 234);

        $('a.btuEmotion').click(function(){
            var number = parseInt($(this).attr('alt').substr(3));
            if (number >= 524 && number <= 574)
                return;

            var x = $('#idQuestion').attr('value');
            $('#idQuestion').attr('value', x + $(this).attr('alt'));
            $('#idQuestion').focus();
        });
    }, 200);

    function getRemainingHeight() {
        return $('.input-section').parent().height() + $('.navigation_page').height();
    }

    function addEmoticons(start, end) {
        for (i = start; i <= end; i++) {
            var emo = '<div style="height:43px;width:43px;float:left;display:inline-block;margin:1px;"><a style="margin:0px 0px 0px 0px;" class="btuEmotion" alt="[em' + i + ']"><img style="max-width: 43px; max-height: 43px" src="/pic/smilies/' + i + '.gif" alt=""></a></div>';
            $('.emo-group-detail').append(emo);
        }
    }
});
