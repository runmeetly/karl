/*
 *  Copyright 2019 Meetly Inc.
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import { MemoryPreloaderBackend } from "./MemoryPreloaderBackend";
import { Preloader } from "./Preloader";

/**
 * Default Preloader
 *
 * @type {ImagePreloader|null}
 */
let defaultPreloader = null;

/**
 * Lazy resolves the default preloader
 *
 * @return {ImagePreloader}
 */
const getDefaultPreloader = () => {
  if (!defaultPreloader) {
    defaultPreloader = Preloader.create(MemoryPreloaderBackend.create());
  }

  return defaultPreloader;
};

/**
 * Stupid simple class for pre-loading image sources into browser memory at a point before they
 * may be needed by the DOM. Can help avoid screens where images all appear blank as they are
 * taking time to load by loading everything in advance.
 */
export class Karl {
  /**
   * Preloads an image if has not been preloaded originally
   *
   * @param {*} image - Image source
   * @param {Function?} onLoaded - Callback on load complete
   * @param {Function?} onError - Callback on load error
   */
  static preload(image, onLoaded, onError) {
    getDefaultPreloader().preload(image, onLoaded, onError);
  }

  /**
   * Preloads a material text icon into a hidden div if has not been preloaded originally
   *
   * @param {string} iconName - material icon name
   * @param {Function?} onLoaded - Callback on load complete
   * @param {Function?} onError - Callback on load error
   */
  static preloadMaterialTextIcon(iconName, onLoaded, onError) {
    getDefaultPreloader().preloadMaterialTextIcon(iconName, onLoaded, onError);
  }

  /**
   * Constructs a Preloader with a custom PreloaderBackend
   *
   * @param {PreloaderBackend} backend - Preloader backend
   * @return {ImagePreloader}
   */
  static withBackend(backend) {
    return Preloader.create(backend);
  }
}
