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
