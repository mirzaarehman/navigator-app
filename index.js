// --- Polyfills (must load before app) ---
import 'assert/';
import 'browserify-zlib'; // zlib
import 'https-browserify'; // https
import 'react-native-url-polyfill/auto'; // URL polyfill
import 'stream-browserify'; // stream
import 'stream-http'; // http
import 'util/'; // util

import './index.native.tsx';

