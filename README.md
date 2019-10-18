# Karl

`Karl` is an ES6  Image preloader. It requires zero dependencies.

## Install

```shell script

$ npm i @runmeetly/karl

$ yarn add @runmeetly/karl

```

## TL;DR

```javascript
import PngFile from "./images/pngs/image.png";
import SvgFile from "./images/svgs/image.svg";
import { Karl } from "@runmeetly/karl";

Karl.preload(PngFile);
Karl.preload(SvgFile);
Karl.preload("/path/to/image/file.png");
Karl.preload(BASE64_PNG_OR_SVG_DATA);

Karl.preloadMaterialTextIcon("close");
Karl.preloadMaterialTextIcon("add");
Karl.preloadMaterialTextIcon("arrow_up");

Karl.withBackend(MyCustomBackend).preload(PngFile);
Karl.withBackend(MyCustomBackend).preloadMaterialTextIcon("person");
```

## API

`Karl` has a small API surface - but can prove rather powerful.  
`Karl` exposes a couple functions, `preload()`, `preloadMaterialTextIcon()`,
and `withBackend()`.

`preload` accepts a single parameter of basically anything - as
long as it ultimately represents image `data`. A path to a file,
a Webpack parsed import, base 64 encoded png or svg data - anything.
It optionally accepts callbacks for `onLoaded` and `onError` events.
It is optional to attach callbacks, and in many cases you won't need to.
`Karl` will always attempt to preload the image data you pass it silently.
Once you call `preload`, the image will be cached for later use and will
persist for as long as the backend and the browser allows.

`preloadMaterialTextIcon` accepts a single parameter which is the name of a
`material-icons` text icon. It will preload the icon by creating a hidden div
at the bottom of your document body. This will help prevent instances where
upon the first load of the material-icon, you would briefly see the actual
text while the CSS icon is loading. Once you call `preloadMaterialTextIcon`,
the div will be inserted only once and will persist for as long as the
backend and the browser allows.

NOTE: `preloadMaterialTextIcon` does not set up the project to work with
Material Icon fonts automatically - you must do this setup manually.

`withBackend` is a more advanced method, and accepts an object which
conforms to the `PreloaderBackend` interface. A backend implementation
is backed by whatever kind of storage you want - the default
implementation is simply in-memory. A backend has both `contains` and
`insert` functions. `contains` is called with a `key` parameter from
the `preload` method - and should return a boolean based on whether that
`key` is already cached in the backend. `insert` is called with a `key`
and a `value`, and should insert the value into the backend and mark it
with the key.

The `withBackend` returns a new `Karl`, which exposes the `preload` and
`preloadMaterialTextIcon` methods and is powered by your provided backend.

For most cases, you will be fine using the default backend, which is
automatically injected for you when you call `Karl.preload()` or
`Karl.preloadMaterialTextIcon()`.

## Caveats

Browsers are ultimately in control of when and how they allocate their
resources. If you ask `Karl` to preload a whole bunch of images - the
browser can at its discretion evict previously loaded images.

Karl may not be perfect, but he's trying his best.

# Credit

`Karl` is primarily developed and maintained by
[Peter](https://github.com/pyamsoft) at
[Meetly](https://www.runmeetly.com).

# License

```
 Copyright 2019 Meetly Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
```
