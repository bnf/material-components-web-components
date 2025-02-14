/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {customElement} from 'lit-element';

import {SliderBase} from './mwc-slider-base';
import {styles} from './mwc-slider.css';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-slider': Slider;
  }
}

@customElement('mwc-slider')
export class Slider extends SliderBase {
  static styles = styles;
}
