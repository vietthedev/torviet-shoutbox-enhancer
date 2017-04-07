function isFirefoxBrowser() {
  return typeof InstallTrigger !== 'undefined';
}

function createButton(text, event) {
  const button = document.createElement('input');
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

const stylesheet = isFirefoxBrowser() ?
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
    ${stylesheet}`);

const clockChild = document.createDocumentFragment();
const span = document.createElement('span');

span.innerHTML = 'For custom emoticon group<br>';

clockChild.appendChild(emoGroup.parentNode);
clockChild.appendChild(span)
  .parentNode.appendChild(createButton('Add', EMOTICON.add))
  .parentNode.appendChild(createButton('Remove', EMOTICON.remove))
  .parentNode.appendChild(createButton('Clear', EMOTICON.clear));
clock.appendChild(clockChild);

EMOTICON.emoticonListExists();
EMOTICON.addToDom();

idQuestion.focus();