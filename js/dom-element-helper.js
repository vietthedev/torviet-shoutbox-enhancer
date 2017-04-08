class DomElementHelper {
  /**
   * Adds an element next to the reference element. Returns true if successful.
   *
   * @static
   * @param {HTMLElement} newElement - The element to be added.
   * @param {HTMLElement} referenceElement - The element to be added next to.
   * @returns {Boolean}
   *
   * @memberOf DomElementHelper
   */
  static appendSibling(newElement, referenceElement) {
    if (!newElement || !referenceElement) {
      return false;
    }

    referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);

    return true;
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
      return false;
    }

    element.parentNode.removeChild(element);

    return true;
  }
}

module.exports = DomElementHelper;
