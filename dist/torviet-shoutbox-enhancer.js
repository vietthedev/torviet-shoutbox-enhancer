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
        /**
         * Adds an element to after the reference element. Returns true if the element is added successfully and false if failed.
         * 
         * @static
         * @param {HTMLElement} newElement - The element to be added.
         * @param {HTMLElement} referenceElement - The element to be added after.
         * @returns
         * 
         * @memberOf DomElementHelper
         */
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

        /**
         * Removes an element from the DOM. Returns true if the element is removed successfully and false if failed.
         * 
         * @static
         * @param {HTMLElement} element - The element to be removed.
         * @returns
         * 
         * @memberOf DomElementHelper
         */
        static remove(element) {
            if (!element) {
                console.error('Element to be removed is invalid.');
                return;
            }

            element.parentNode.removeChild(element);
        }
    }

    let allWrapper = document.getElementById("all-wrapper"),
        boxHead = document.getElementById("boxHead"),
        marquee = document.getElementById("marquee"),
        sltTheme = document.getElementById("sltTheme"),
        boxQuestion = document.getElementById("boxQuestion"),
        clock = document.getElementById("clock"),
        idQuestion = document.getElementById("idQuestion"),
        emoGroup = document.getElementById("emo-group"),
        emoGroupDetail = document.getElementById("emo-group-detail");

})();
