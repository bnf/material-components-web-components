/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {FormElement} from '@material/mwc-base/form-element';
import {customElement, LitElement, query} from 'lit-element';
import {html} from 'lit-html';

import {fixture, TestFixture} from '../../../test/src/util/helpers';


@customElement('test-form-element')
class TestFormElement extends FormElement {
  @query('#root') protected mdcRoot!: HTMLElement;
  @query('#input') protected formElement!: HTMLElement;

  protected mdcFoundation = undefined;
  protected mdcFoundationClass = undefined;
  protected createAdapter() {
    return {};
  }

  render() {
    return html`
      <label id="root" for="input">
        <input type="text" id="input"></input>
      </label>
    `;
  }
}

@customElement('custom-click-form-element')
class CustomClickFormElement extends FormElement {
  @query('#root') protected mdcRoot!: HTMLElement;
  @query('#indirect') indirectFormElement!: HTMLElement;
  @query('#direct') protected formElement!: HTMLElement;

  protected mdcFoundation = undefined;
  protected mdcFoundationClass = undefined;
  protected createAdapter() {
    return {};
  }
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  click() {
    if (this.indirectFormElement) {
      this.indirectFormElement.click();
    }
  }

  render() {
    return html`
      <section id="root">
        <label id="label_direct" for="direct">
          <input type="text" id="direct"></input>
        </label>
        <label id="label_indirect" for="indirect">
          <input type="text" id="indirect"></input>
        </label>
      </section>
    `;
  }
}

const testFormElement = html`
  <test-form-element></test-form-element>
`;

const testClickFormElement = html`
  <custom-click-form-element></custom-click-form-element>
`;

suite('form-element:', () => {
  suite('test-form-element', () => {
    let fixt: TestFixture;
    let component: TestFormElement|null;
    let formElement: HTMLElement|null;

    setup(async () => {
      fixt = await fixture(testFormElement);
      component = fixt.root.querySelector('test-form-element');

      if (component !== null && component.shadowRoot !== null) {
        formElement = component.shadowRoot.querySelector('#input');
      }
    });

    teardown(async () => {
      if (fixt) {
        fixt.remove();
      }
    });

    test('is an instance of form-element', () => {
      assert.instanceOf(component, TestFormElement);
      assert.instanceOf(component, FormElement);
    });

    test('shadowRoot focuses on formElement after click', async () => {
      if (component === null) {
        assert.isNotNull(component);
        return;
      }
      if (component.shadowRoot === null) {
        assert.isNotNull(component.shadowRoot);
        return;
      }
      if (formElement === null) {
        assert.isNotNull(formElement);
        return;
      }

      component.click();
      await component.updateComplete;

      assert.equal(component.shadowRoot.activeElement, formElement);
    });
  });

  suite('custom-click-form-element', () => {
    let fixt: TestFixture;
    let component: CustomClickFormElement|null;
    let formElement: HTMLElement|null;
    let indirectFormElement: HTMLElement|null;

    setup(async () => {
      fixt = await fixture(testClickFormElement);
      component = fixt.root.querySelector('custom-click-form-element');

      if (component !== null && component.shadowRoot !== null) {
        formElement = component.shadowRoot.querySelector('#direct');
        indirectFormElement = component.shadowRoot.querySelector('#indirect');
      }
    });

    teardown(async () => {
      if (fixt) {
        fixt.remove();
      }
    });

    test('is a descendant of FormElement', () => {
      assert.instanceOf(component, FormElement);
    });

    test('shadowRoot should not focus on #indirect after click', async () => {
      if (component === null) {
        assert.isNotNull(component);
        return;
      }
      if (component.shadowRoot === null) {
        assert.isNotNull(component.shadowRoot);
        return;
      }
      if (indirectFormElement === null) {
        assert.isNotNull(indirectFormElement);
        return;
      }

      component.click();
      await component.updateComplete;

      assert.notEqual(component.shadowRoot.activeElement, indirectFormElement);
    });

    test('shadowRoot should not focus on #root after click', async () => {
      if (component === null) {
        assert.isNotNull(component);
        return;
      }
      if (component.shadowRoot === null) {
        assert.isNotNull(component.shadowRoot);
        return;
      }
      if (formElement === null) {
        assert.isNotNull(formElement);
        return;
      }

      component.click();
      await component.updateComplete;

      assert.notEqual(component.shadowRoot.activeElement, formElement);
    });
  });
});
