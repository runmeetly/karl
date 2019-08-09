/**
 * Future Open Source ?
 *
 * peter
 */

import { MemoryPreloaderBackend } from "./MemoryPreloaderBackend";
import { Preloader } from "./Preloader";

/**
 * @typedef {{contains: (function(*): boolean), insert: insert}} PreloaderBackend
 *
 * Creates the default PreloaderBackend
 *
 * @return {PreloaderBackend}
 */
const createDefaultPreloaderBackend = function createDefaultPreloaderBackend() {
  return MemoryPreloaderBackend.create();
};

/**
 * Default PreloaderBackend
 *
 * @type {PreloaderBackend}
 */
const DEFAULT_BACKEND = createDefaultPreloaderBackend();

/**
 * Default Preloader
 *
 * @type {Preloader}
 */
const DEFAULT_PRELOADER = new Preloader(DEFAULT_BACKEND);

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
   * @return {Promise<*>} - Resolves with Image source, or rejects with error message
   */
  static preload(image) {
    return DEFAULT_PRELOADER.preload(image);
  }

  /**
   * Constructs a Preloader with a custom PreloaderBackend
   *
   * @param {PreloaderBackend} backend - Preloader backend
   * @return {Preloader}
   */
  static withBackend(backend) {
    return new Preloader(backend);
  }
}
