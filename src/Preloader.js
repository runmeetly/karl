/**
 * Preload an image source
 *
 * NOTE: We persist the image source as a uniqueness constraint, and the actual
 *       preloaded image object. Many browsers will GC image roots as soon as
 *       all references to them are unreachable - so if we did not cache the
 *       new Image() object here as well, the browser would eventually GC our
 *       image - which is no fun.
 *
 * @param {*} image - Image source
 * @param {PreloaderBackend} backend - Preloader backend
 * @return {Promise<*>} - Resolves with Image source, or rejects with error message
 */
const preloadImage = (image, backend) => {
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
   * Creates a new preloader
   *
   * @param {PreloaderBackend} backend - Preloader backend
   */
  constructor(backend) {
    if (!backend) {
      throw error("You must construct a Preloader with a backend.");
    }

    this._backend = backend;
  }

  /**
   * Preloads an image if has not been preloaded originally
   *
   * @param {*} image - Image source
   * @return {Promise<*>} - Resolves with Image source, or rejects with error message
   */
  preload(image) {
    if (!image) {
      return Promise.reject(error("You must call preload() with an image."));
    }

    const backend = this._backend;
    if (backend.contains(image)) {
      return Promise.resolve(image);
    } else {
      return preloadImage(image, backend);
    }
  }
}
