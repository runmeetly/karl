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
 * Class name for material icons
 * @type {string}
 */
const MATERIAL_ICONS_CLASS_NAME = "material-icons";

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
 * Preload a text icon
 *
 * NOTE: We persist the image source as a uniqueness constraint, and the actual
 *       preloaded image object. Many browsers will GC image roots as soon as
 *       all references to them are unreachable - so if we did not cache the
 *       new Image() object here as well, the browser would eventually GC our
 *       image - which is no fun.
 *
 * @param {PreloaderBackend} backend - Preloader backend
 * @param {string} iconClass - css class name for text icon
 * @param {string} iconName - text icon name
 * @return {Promise<*>} - Resolves with icon name, or rejects with error message
 */
const preloadTextIcon = (backend, iconClass, iconName) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a div from the document
      if (!!document) {
        const div = document.createElement("div");

        // Style the div as a hidden (don't mark as display none or it won't render)
        div.style.width = "0px";
        div.style.height = "0px";
        div.style.color = "transparent";

        // Set the class name to the icon class so it can load the css icon
        // Apply d-none bg-transparent for bootstrap compat if possible
        div.setAttribute(
          "class",
          `${iconClass} runmeetly-karl-${iconName} bg-transparent`
        );

        // Set the inner html as the icon name so that the icon will begin loading.
        div.innerHTML = iconName;

        // Add the div to the document body
        document.body.appendChild(div);

        // Finally, we cache inside the store.
        backend.insert(iconName, iconName);
      } else {
        // No document, no dice
        reject(
          new Error("Missing document - are you running in a backend context?")
        );
      }
    } catch (e) {
      reject(e);
    }
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

      /**
       * Preloads a material text icon into a hidden div if has not been preloaded originally
       *
       * @param {string} iconName - material icon name
       * @return {Promise<*>} - Resolves with icon name, or rejects with error message
       */
      preloadMaterialTextIcon(iconName) {
        if (!iconName) {
          return Promise.reject(
            error("You must call preloadMaterialTextIcon() with an iconName.")
          );
        }

        if (backend.contains(iconName)) {
          return Promise.resolve(iconName);
        } else {
          return preloadTextIcon(backend, MATERIAL_ICONS_CLASS_NAME, iconName);
        }
      }
    }

    return new ImagePreloader();
  }
}
