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
 * A preloader backend which is backed by short term memory storage
 */
export class MemoryPreloaderBackend {
  /**
   * Create a new MemoryPreloaderBackend
   *
   * @returns {PreloaderBackend}
   */
  static create() {
    const PRELOADED_IMAGES = {};

    return Object.freeze({
      contains: function contains(key) {
        return !!PRELOADED_IMAGES[key];
      },

      set: function set(key, value) {
        PRELOADED_IMAGES[key] = value;
      }
    });
  }
}
