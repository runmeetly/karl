/**
 * A preloader backend which is backed by short term memory storage
 */
export class MemoryPreloaderBackend {
  /**
   * Create a new MemoryPreloaderBackend
   *
   * @return {PreloaderBackend}
   */
  static create() {
    const PRELOADED_IMAGES = {};

    return {
      contains: function contains(key) {
        return !!PRELOADED_IMAGES[key];
      },

      insert: function insert(key, value) {
        PRELOADED_IMAGES[key] = value;
      }
    };
  }
}
