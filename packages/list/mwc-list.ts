/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit-element';

import {ListBase} from './mwc-list-base';
import {styles} from './mwc-list.css';

export {ActionDetail, createSetFromIndex, IndexDiff, isEventMulti, isIndexSet, MWCListIndex, SelectedDetail} from './mwc-list-foundation';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-list': List;
  }
}

@customElement('mwc-list')
export class List extends ListBase {
  static styles = styles;
}
