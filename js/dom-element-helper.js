class DomElementHelper {
    /**
     * Adds an element to after the reference element. Returns true if the element is added successfully and false if failed.
     * 
     * @static
     * @param {HTMLElement} newElement - The element to be added.
     * @param {HTMLElement} referenceElement - The element to be added after.
     * @returns {Boolean}
     * 
     * @memberOf DomElementHelper
     */
    static addAfter(newElement, referenceElement) {
        if (!newElement) {
            console.error('New element is invalid.');
            return false;
        }

        if (!referenceElement) {
            console.error('Reference element is invalid.');
            return false;
        }

        referenceElement.parentNode
            .insertBefore(newElement, referenceElement.nextSibling);

        return true;
    }

    /**
     * Removes an element from the DOM. Returns true if the element is removed successfully and false if failed.
     * 
     * @static
     * @param {HTMLElement} element - The element to be removed.
     * @returns {Boolean}
     * 
     * @memberOf DomElementHelper
     */
    static remove(element) {
        if (!element) {
            console.error('Element to be removed is invalid.');
            return false;
        }

        element.parentNode.removeChild(element);

        return true;
    }
}

module.exports = DomElementHelper;
