/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Drawer} from '@material/mwc-drawer';
import {html} from 'lit-html';

import {fixture, TestFixture, waitForEvent} from '../../../test/src/util/helpers';

const SCRIM_SELECTOR = '.mdc-drawer-scrim';
const HEADER_SELECTOR = '.mdc-drawer__header';
const DISMISSIBLE_CLASS = 'mdc-drawer--dismissible';

interface DrawerProps {
  hasHeader: boolean;
  type: string;
}

const defaultDrawer = html`<mwc-drawer></mwc-drawer>`;

const drawer = (propsInit: Partial<DrawerProps>) => {
  return html`
    <mwc-drawer
      .hasHeader=${propsInit.hasHeader === true}
      .type=${propsInit.type ?? ''}>
    </mwc-drawer>
  `;
};

const IS_SAFARI_13 =
    window.navigator.appVersion?.indexOf('AppleWebKit') !== -1 &&
    window.navigator.appVersion?.indexOf('Version/13.1') !== -1;

const transitionend = async (drawer: Element) => {
  if (IS_SAFARI_13) {
    await new Promise((resolve) => {
      setTimeout(resolve, 400);
    });
  } else {
    await waitForEvent(drawer, 'transitionend');
  }
};

suite('mwc-drawer', () => {
  let fixt: TestFixture;
  let element: Drawer;

  teardown(() => {
    fixt.remove();
  });

  suite('basic', () => {
    setup(async () => {
      fixt = await fixture(defaultDrawer);
      element = fixt.root.querySelector('mwc-drawer')!;
    });

    test('initializes as an mwc-drawer', () => {
      assert.instanceOf(element, Drawer);
      assert.equal(element.type, '');
      assert.equal(element.open, false);
      assert.equal(element.hasHeader, false);
    });

    test('opening/closing events are fired', async () => {
      const drawer = element.shadowRoot!.querySelector('.mdc-drawer')!;
      let openedFired = false;
      let closedFired = false;
      element.addEventListener('MDCDrawer:opened', () => {
        openedFired = true;
      });
      element.addEventListener('MDCDrawer:closed', () => {
        closedFired = true;
      });
      element.type = 'dismissible';
      element.open = true;
      await transitionend(drawer);
      assert.equal(openedFired, true);
      element.open = false;
      await transitionend(drawer);

      assert.equal(closedFired, true);
    });
  });

  suite('hasHeader', () => {
    setup(async () => {
      fixt = await fixture(drawer({hasHeader: true}));
      element = fixt.root.querySelector('mwc-drawer')!;
      await element.updateComplete;
    });

    test('displays a header if set', async () => {
      let header = element.shadowRoot!.querySelector(HEADER_SELECTOR);
      assert.instanceOf(header, Element);
      element.hasHeader = false;
      await element.updateComplete;
      header = element.shadowRoot!.querySelector(HEADER_SELECTOR);
      assert.equal(header, null);
    });
  });

  suite('modal type', () => {
    setup(async () => {
      fixt = await fixture(drawer({type: 'modal'}));
      element = fixt.root.querySelector('mwc-drawer')!;
      await element.updateComplete;
    });

    test('displays scrim', async () => {
      const drawer = element.shadowRoot!.querySelector('.mdc-drawer')!;
      const scrim = element.shadowRoot!.querySelector(SCRIM_SELECTOR)!;
      assert.instanceOf(scrim, Element);
      assert.isTrue(drawer.classList.contains('mdc-drawer--modal'));
    });

    test('closes on scrim click', async () => {
      const drawer = element.shadowRoot!.querySelector('.mdc-drawer')!;
      const scrim =
          element.shadowRoot!.querySelector<HTMLElement>(SCRIM_SELECTOR)!;
      element.open = true;
      await transitionend(drawer);

      scrim.click();
      await transitionend(drawer);

      assert.equal(element.open, false);
    });
  });

  suite('dismissible type', () => {
    setup(async () => {
      fixt = await fixture(drawer({type: 'dismissible'}));
      element = fixt.root.querySelector('mwc-drawer')!;
      await element.updateComplete;
    });

    test('sets correct classes', async () => {
      const drawer = element.shadowRoot!.querySelector('.mdc-drawer')!;
      assert.isTrue(drawer.classList.contains(DISMISSIBLE_CLASS));
    });
  });
});
