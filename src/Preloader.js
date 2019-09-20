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

/**
 * Preload an image source
 *
 * NOTE: We persist the image source as a uniqueness constraint, and the actual
 *       preloaded image object. Many browsers will GC image roots as soon as
 *       all references to them are unreachable - so if we did not cache the
 *       new Image() object here as well, the browser would eventually GC our
 *       image - which is no fun.
 *
 * @param {PreloaderBackend} backend - Preloader backend
 * @param {*} image - Image source
 * @return {Promise<*>} - Resolves with Image source, or rejects with error message
 */
const preloadImage = (backend, image) => {
  return new Promise((resolve, reject) => {
    const preload = new Image();

    // Attach listeners to it
    preload.addEventListener("load", () => resolve(image));
    preload.addEventListener("error", () => reject(error));

    // Then set the src, which will begin the load
    preload.src = image;

    // Finally, we cache inside the store.
    backend.insert(image, preload);
  });
};

/**
 * Generate error messages
 *
 * @param {string} message - The error message
 * @return {Error} - An error object
 */
const error = message => {
  return new Error(message || "An unexpected error occurred.");
};

/**
 * Image preloader - given a backend and an image will preload the image
 */
export class Preloader {
  /**
   * Create a new ImagePreloader
   * @param {PreloaderBackend} backend - Preloader backend
   * @return {ImagePreloader} Configured image preloader
   */
  static create(backend) {
    if (!backend) {
      throw error("You must construct a Preloader with a backend.");
    }

    /**
     * Image Preloader class
     *
     */
    class ImagePreloader {
      /**
       * Preloads an image if has not been preloaded originally
       *
       * @param {*} image - Image source
       * @return {Promise<*>} - Resolves with Image source, or rejects with error message
       */
      preload(image) {
        if (!image) {
          return Promise.reject(
            error("You must call preload() with an image.")
          );
        }

        if (backend.contains(image)) {
          return Promise.resolve(image);
        } else {
          return preloadImage(backend, image);
        }
      }
    }

    return new ImagePreloader();
  }
}
