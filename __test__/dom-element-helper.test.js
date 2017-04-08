const DomElementHelper = require('../js/dom-element-helper');

test('adds the marquee element to after the clock element', () => {
  const marquee = document.getElementById('marquee');
  const clock = document.getElementById('clock');

  const result = DomElementHelper.appendSibling(marquee, clock);

  expect(result).toBeTruthy();
});

test('adds the marquee element to an invalid element', () => {
  const result = DomElementHelper.appendSibling(
    document.getElementById('marquee'),
    document.getElementById('invalid'));

  expect(result).toBeFalsy();
});

test('removes an element from the DOM', () => {
  const result = DomElementHelper.remove(document.getElementById('clock'));

  expect(document.getElementById('clock')).toBeNull();
  expect(result).toBeTruthy();
});

test('removes an invalid element', () => {
  const result = DomElementHelper.remove(document.getElementById('invalid'));

  expect(result).toBeFalsy();
});
