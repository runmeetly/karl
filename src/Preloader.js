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
function preloadImage(backend, image, onLoaded, onError) {
  if (!document) {
    // No document, no dice
    onError(error("Missing document - are you running on a backend?"));
    return;
  }

  try {
    const preload = new Image();

    // Attach listeners to it
    preload.addEventListener("load", () => onLoaded(preload));
    preload.addEventListener("error", e => onError(e));

    // Then set the src, which will begin the load
    preload.src = image;

    const img = document.createElement("img");

    // Style the img as a hidden (don't mark as display none or it won't render)
    img.width = 0;
    img.height = 0;
    img.style.width = "0px";
    img.style.height = "0px";
    img.style.color = "transparent";
    img.alt = `runmeetly-karl`;

    img.setAttribute("class", `runmeetly-karl bg-transparent`);

    // Add the div to the document body
    document.body.appendChild(img);
  } catch (e) {
    onError(e);
  }
}

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
function preloadTextIcon(backend, iconClass, iconName, onLoaded, onError) {
  if (!document) {
    // No document, no dice
    onError(error("Missing document - are you running on a backend?"));
    return;
  }

  try {
    // Create a div from the document
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

    onLoaded(iconName);
  } catch (e) {
    onError(e);
  }
}

/**
 * Generate error messages
 *
 * @param {string} message - The error message
 * @returns {Error} - An error object
 */
function error(message) {
  return new Error(message || "An unexpected error occurred.");
}

/**
 * Image preloader - given a backend and an image will preload the image
 */
export class Preloader {
  /**
   * Create a new ImagePreloader
   * @param {PreloaderBackend} backend - Preloader backend
   * @returns {Preloader}
   */
  static create(backend) {
    if (!backend) {
      throw error("You must construct a Preloader with a backend.");
    }

    const activePreloads = {};

    return Object.freeze({
      /**
       * Preloads an image if has not been preloaded originally
       *
       * @param {*} image - Image source
       * @param {Function?} onLoaded - Callback on load complete
       * @param {Function?} onError - Callback on load error
       */
      preload: function preload(image, onLoaded, onError) {
        if (!image) {
          const err = error("You must call preload() with an image.");
          if (!!onError) {
            onError(err);
            return;
          } else {
            return Promise.reject(err);
          }
        }

        if (backend.contains(image)) {
          if (!!onLoaded) {
            onLoaded(image);
            return;
          } else {
            return Promise.resolve(image);
          }
        }
        if (!activePreloads[image]) {
          activePreloads[image] = new Promise((resolve, reject) => {
            preloadImage(
              backend,
              image,
              result => {
                // Clear the active
                activePreloads[image] = null;

                // Save the result
                backend.set(image, result);

                if (!!onLoaded) {
                  onLoaded(result);
                } else {
                  resolve(result);
                }
              },
              err => {
                // Clear the active
                activePreloads[image] = null;

                // Remove the result
                backend.set(image, null);

                if (!!onError) {
                  onError(err);
                } else {
                  reject(err);
                }
              }
            );
          });
        }

        return activePreloads[image];
      },

      /**
       * Preloads a material text icon into a hidden div if has not been preloaded originally
       *
       * @param {string} iconName - material icon name
       * @param {Function?} onLoaded - Callback on load complete
       * @param {Function?} onError - Callback on load error
       */
      preloadMaterialTextIcon: function preloadMaterialTextIcon(
        iconName,
        onLoaded,
        onError
      ) {
        if (!iconName) {
          const err = error("Call preloadMaterialTextIcon() with iconName.");
          if (!!onError) {
            onError(err);
            return;
          } else {
            return Promise.reject(err);
          }
        }

        if (backend.contains(iconName)) {
          if (!!onLoaded) {
            onLoaded(iconName);
            return;
          } else {
            return Promise.resolve(iconName);
          }
        }

        if (!activePreloads[iconName]) {
          activePreloads[iconName] = new Promise((resolve, reject) => {
            preloadTextIcon(
              backend,
              MATERIAL_ICONS_CLASS_NAME,
              iconName,
              result => {
                // Clear the active
                activePreloads[iconName] = null;

                // Insert the result
                backend.set(iconName, result);

                if (!!onLoaded) {
                  onLoaded(result);
                } else {
                  resolve(result);
                }
              },
              err => {
                // Clear the active
                activePreloads[iconName] = null;

                // Clear the result
                backend.set(iconName, null);

                if (!!onError) {
                  onError(err);
                } else {
                  reject(err);
                }
              }
            );
          });
        }
        return activePreloads[iconName];
      }
    });
  }
}
