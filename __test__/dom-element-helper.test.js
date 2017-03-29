beforeEach(() => {
    DomElementHelper = require('../js/dom-element-helper');
    console.error = jest.fn();
});

test('adds the marquee element to after the clock element', () => {
    let marquee = document.getElementById('marquee'),
        clock = document.getElementById('clock');

    let result = DomElementHelper.addAfter(marquee, clock);

    expect(result).toBeTruthy();
    expect(clock.nextSibling).toBe(marquee);
});

test('adds the marquee element to an invalid element', () => {
    let result = DomElementHelper.addAfter(document.getElementById(
            'marquee'),
        document.getElementById('invalid'));

    expect(result).toBeFalsy();
    expect(console.error).toHaveBeenCalled();
});

test('removes an element from the DOM', () => {
    let result = DomElementHelper.remove(document.getElementById(
        'clock'));

    expect(result).toBeTruthy();
    expect(document.getElementById('clock')).toBeNull();
});

test('removes an invalid element', () => {
    let result = DomElementHelper.remove(document.getElementById(
        'invalid'));

    expect(result).toBeFalsy();
    expect(console.error).toHaveBeenCalled();
});
