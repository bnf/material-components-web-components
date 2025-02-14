/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {IconButton} from '@material/mwc-icon-button';

const ICON_SELECTOR = 'i.material-icons';


suite('mwc-icon-button', () => {
  /** @type {HTMLElement} */
  let element: IconButton;

  setup(() => {
    element = document.createElement('mwc-icon-button');
    document.body.appendChild(element);
  });

  teardown(() => {
    document.body.removeChild(element);
  });

  test('initializes as an mwc-icon-button', () => {
    assert.instanceOf(element, IconButton);
  });

  test(
      'setting `icon` updates the textContent inside <i class="mdc-icon-button__icon mdc-icon-button__icon--on">',
      async () => {
        element.icon = 'check';
        await element.updateComplete;
        const icon = element.shadowRoot!.querySelector(ICON_SELECTOR)!;
        assert.instanceOf(icon, HTMLElement);
        assert.equal(icon.textContent!.trim(), 'check');
        element.icon = 'menu';
        await element.updateComplete;
        assert.equal(icon.textContent!.trim(), 'menu');
      });

  test(
      'setting `ariaLabel` updates the aria-label attribute on the native button element',
      async () => {
        const ariaLabel = 'hello';
        element.ariaLabel = ariaLabel;
        await element.updateComplete;
        const button = element.shadowRoot!.querySelector('button')!;
        assert.equal(button.getAttribute('aria-label'), ariaLabel);
      });

  test(
      'setting `disabled` updates the disabled attribute on the native button element',
      async () => {
        element.disabled = true;
        await element.updateComplete;
        const button = element.shadowRoot!.querySelector('button')!;
        assert.equal(button.hasAttribute('disabled'), true);

        element.disabled = false;
        await element.updateComplete;
        assert.equal(button.hasAttribute('disabled'), false);
      });

  const svgTemplate = document.createElement('template');
  svgTemplate.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`;

  test('default node will serve as the on icon', async () => {
    const iconQuery = svgTemplate.content.querySelector('svg')!;
    assert.instanceOf(iconQuery, SVGElement);

    const icon = iconQuery.cloneNode(true);
    element.appendChild(icon);
    await element.updateComplete;
    const root = element.shadowRoot!;
    const iconSlot = root.querySelector('slot') as HTMLSlotElement;
    assert.include(iconSlot.assignedNodes(), icon);
  });
});
