class DomElementHelper {
    /**
     * Adds an element to after the reference element.
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
     * Removes an element from the DOM.
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

module.exports = DomElementHelper;
