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
 * @param {Function?} onLoaded - Callback on load complete
 * @param {Function?} onError - Callback on load error
 */
const preloadImage = (backend, image, onLoaded, onError) => {
  const preload = new Image();

  // Attach listeners to it
  if (!!onLoaded) {
    preload.addEventListener("load", () => onLoaded(image));
  }

  if (!!onError) {
    preload.addEventListener("error", () => onError(error));
  }

  // Then set the src, which will begin the load
  preload.src = image;

  // Finally, we cache inside the store.
  backend.insert(image, preload);
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
 * @param {Function?} onLoaded - Callback on load complete
 * @param {Function?} onError - Callback on load error
 */
const preloadTextIcon = (backend, iconClass, iconName, onLoaded, onError) => {
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

      if (!!onLoaded) {
        onLoaded(iconName);
      }
    } else {
      // No document, no dice
      if (!!onError) {
        onError(error("Missing document - are you running on a backend?"));
      }
    }
  } catch (e) {
    if (!!onError) {
      onError(e);
    }
  }
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
       * @param {Function?} onLoaded - Callback on load complete
       * @param {Function?} onError - Callback on load error
       */
      preload(image, onLoaded, onError) {
        if (!image) {
          if (!!onError) {
            onError(error("You must call preload() with an image."));
            return;
          }
        }

        if (backend.contains(image)) {
          if (!!onLoaded) {
            onLoaded(image);
          }
        } else {
          preloadImage(backend, image, onLoaded, onError);
        }
      }

      /**
       * Preloads a material text icon into a hidden div if has not been preloaded originally
       *
       * @param {string} iconName - material icon name
       * @param {Function?} onLoaded - Callback on load complete
       * @param {Function?} onError - Callback on load error
       */
      preloadMaterialTextIcon(iconName, onLoaded, onError) {
        if (!iconName) {
          if (!!onError) {
            onError(error("Call preloadMaterialTextIcon() with iconName."));
            return;
          }
        }

        if (backend.contains(iconName)) {
          if (!!onLoaded) {
            onLoaded(iconName);
          }
        } else {
          preloadTextIcon(
            backend,
            MATERIAL_ICONS_CLASS_NAME,
            iconName,
            onLoaded,
            onError
          );
        }
      }
    }

    return new ImagePreloader();
  }
}
