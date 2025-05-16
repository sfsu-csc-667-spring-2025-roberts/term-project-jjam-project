// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  externals,
  distDir,
  publicUrl,
  devServer
) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        if (externals[name]) {
          return externals[name];
        }
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });
    }
  }
})({"9KHD9":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = 57373;
var HMR_SERVER_PORT = 57373;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "3593fada8670c589";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_SERVER_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_SERVER_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , disposedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ , bundleNotFound = false;
function getHostname() {
    return HMR_HOST || (typeof location !== 'undefined' && location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || (typeof location !== 'undefined' ? location.port : HMR_SERVER_PORT);
}
// eslint-disable-next-line no-redeclare
let WebSocket = globalThis.WebSocket;
if (!WebSocket && typeof module.bundle.root === 'function') try {
    // eslint-disable-next-line no-global-assign
    WebSocket = module.bundle.root('ws');
} catch  {
// ignore.
}
var hostname = getHostname();
var port = getPort();
var protocol = HMR_SECURE || typeof location !== 'undefined' && location.protocol === 'https:' && ![
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
].includes(hostname) ? 'wss' : 'ws';
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if (!parent || !parent.isParcelRequire) {
    // Web extension context
    var extCtx = typeof browser === 'undefined' ? typeof chrome === 'undefined' ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes('test.js');
    }
    var ws;
    if (HMR_USE_SSE) ws = new EventSource('/__parcel_hmr');
    else try {
        // If we're running in the dev server's node runner, listen for messages on the parent port.
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) {
            parentPort.on('message', async (message)=>{
                try {
                    await handleMessage(message);
                    parentPort.postMessage('updated');
                } catch  {
                    parentPort.postMessage('restart');
                }
            });
            // After the bundle has finished running, notify the dev server that the HMR update is complete.
            queueMicrotask(()=>parentPort.postMessage('ready'));
        }
    } catch  {
        if (typeof WebSocket !== 'undefined') try {
            ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
        } catch (err) {
            // Ignore cloudflare workers error.
            if (err.message && !err.message.includes('Disallowed operation called within global scope')) console.error(err.message);
        }
    }
    if (ws) {
        // $FlowFixMe
        ws.onmessage = async function(event /*: {data: string, ...} */ ) {
            var data /*: HMRMessage */  = JSON.parse(event.data);
            await handleMessage(data);
        };
        if (ws instanceof WebSocket) {
            ws.onerror = function(e) {
                if (e.message) console.error(e.message);
            };
            ws.onclose = function() {
                console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
            };
        }
    }
}
async function handleMessage(data /*: HMRMessage */ ) {
    checkedAssets = {} /*: {|[string]: boolean|} */ ;
    disposedAssets = {} /*: {|[string]: boolean|} */ ;
    assetsToAccept = [];
    assetsToDispose = [];
    bundleNotFound = false;
    if (data.type === 'reload') fullReload();
    else if (data.type === 'update') {
        // Remove error overlay if there is one
        if (typeof document !== 'undefined') removeErrorOverlay();
        let assets = data.assets;
        // Handle HMR Update
        let handled = assets.every((asset)=>{
            return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
        });
        // Dispatch a custom event in case a bundle was not found. This might mean
        // an asset on the server changed and we should reload the page. This event
        // gives the client an opportunity to refresh without losing state
        // (e.g. via React Server Components). If e.preventDefault() is not called,
        // we will trigger a full page reload.
        if (handled && bundleNotFound && assets.some((a)=>a.envHash !== HMR_ENV_HASH) && typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') handled = !window.dispatchEvent(new CustomEvent('parcelhmrreload', {
            cancelable: true
        }));
        if (handled) {
            console.clear();
            // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
            if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') window.dispatchEvent(new CustomEvent('parcelhmraccept'));
            await hmrApplyUpdates(assets);
            hmrDisposeQueue();
            // Run accept callbacks. This will also re-execute other disposed assets in topological order.
            let processedAssets = {};
            for(let i = 0; i < assetsToAccept.length; i++){
                let id = assetsToAccept[i][1];
                if (!processedAssets[id]) {
                    hmrAccept(assetsToAccept[i][0], id);
                    processedAssets[id] = true;
                }
            }
        } else fullReload();
    }
    if (data.type === 'error') {
        // Log parcel errors to console
        for (let ansiDiagnostic of data.diagnostics.ansi){
            let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
            console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
        }
        if (typeof document !== 'undefined') {
            // Render the fancy html overlay
            removeErrorOverlay();
            var overlay = createErrorOverlay(data.diagnostics.html);
            // $FlowFixMe
            document.body.appendChild(overlay);
        }
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="${protocol === 'wss' ? 'https' : 'http'}://${hostname}:${port}/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, '') : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + '</div>').join('')}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ''}
      </div>
    `;
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if (typeof location !== 'undefined' && 'reload' in location) location.reload();
    else if (typeof extCtx !== 'undefined' && extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
    else try {
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) parentPort.postMessage('restart');
    } catch (err) {
        console.error("[parcel] \u26A0\uFE0F An HMR update was not accepted. Please restart the process.");
    }
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', // $FlowFixMe
    href.split('?')[0] + '?' + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout || typeof document === 'undefined') return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === 'js') {
        if (typeof document !== 'undefined') {
            let script = document.createElement('script');
            script.src = asset.url + '?t=' + Date.now();
            if (asset.outputFormat === 'esmodule') script.type = 'module';
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === 'function') {
            // Worker scripts
            if (asset.outputFormat === 'esmodule') return import(asset.url + '?t=' + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + '?t=' + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != 'undefined' && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        }
        // Always traverse to the parent bundle, even if we already replaced the asset in this bundle.
        // This is required in case modules are duplicated. We need to ensure all instances have the updated code.
        if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    checkedAssets = {};
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else if (a !== null) {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) {
            bundleNotFound = true;
            return true;
        }
        return hmrAcceptCheckOne(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return null;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    if (!cached) return true;
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
    return false;
}
function hmrDisposeQueue() {
    // Dispose all old assets.
    for(let i = 0; i < assetsToDispose.length; i++){
        let id = assetsToDispose[i][1];
        if (!disposedAssets[id]) {
            hmrDispose(assetsToDispose[i][0], id);
            disposedAssets[id] = true;
        }
    }
    assetsToDispose = [];
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        let assetsToAlsoAccept = [];
        cached.hot._acceptCallbacks.forEach(function(cb) {
            let additionalAssets = cb(function() {
                return getParents(module.bundle.root, id);
            });
            if (Array.isArray(additionalAssets) && additionalAssets.length) assetsToAlsoAccept.push(...additionalAssets);
        });
        if (assetsToAlsoAccept.length) {
            let handled = assetsToAlsoAccept.every(function(a) {
                return hmrAcceptCheck(a[0], a[1]);
            });
            if (!handled) return fullReload();
            hmrDisposeQueue();
        }
    }
}

},{}],"8WnK3":[function(require,module,exports,__globalThis) {
//console.log("Hello from the client (games)");
const startGameButton = document.querySelector("#start-game-button");
const announcePresenceButton = document.querySelector("#announce-presence-button");
const showHandButton = document.querySelector("#show-hand-button");
const playerHandContainer = document.querySelector('#player-hand-container');
const playerHandDiv = document.querySelector('#player-hand');
const opponentCardCountsDiv = document.querySelector('#opponent-card-counts');
const gameIdDisplay = document.querySelector('#game-id-display');
const gameId = gameIdDisplay ? gameIdDisplay.textContent : null;
const currentUserId = document.body.dataset.userId;
const discardPileDiv = document.querySelector('#discard-pile');
const drawCardButton = document.querySelector("#draw-card-button");
const discardCard = document.querySelector("#hand-card-button");
const resetGameButton = document.querySelector("#reset-game-button");
const resetConfirmInput = document.querySelector("#resetConfirm");
const cardMap = {
    1: {
        value: 'A',
        suit: 'S',
        display: "A\u2660"
    },
    2: {
        value: '2',
        suit: 'S',
        display: "2\u2660"
    },
    3: {
        value: '3',
        suit: 'S',
        display: "3\u2660"
    },
    4: {
        value: '4',
        suit: 'S',
        display: "4\u2660"
    },
    5: {
        value: '5',
        suit: 'S',
        display: "5\u2660"
    },
    6: {
        value: '6',
        suit: 'S',
        display: "6\u2660"
    },
    7: {
        value: '7',
        suit: 'S',
        display: "7\u2660"
    },
    8: {
        value: '8',
        suit: 'W',
        display: '8'
    },
    9: {
        value: '9',
        suit: 'S',
        display: "9\u2660"
    },
    10: {
        value: '10',
        suit: 'S',
        display: "10\u2660"
    },
    11: {
        value: 'J',
        suit: 'S',
        display: "J\u2660"
    },
    12: {
        value: 'Q',
        suit: 'S',
        display: "Q\u2660"
    },
    13: {
        value: 'K',
        suit: 'S',
        display: "K\u2660"
    },
    14: {
        value: 'A',
        suit: 'H',
        display: "A\u2665"
    },
    15: {
        value: '2',
        suit: 'H',
        display: "2\u2665"
    },
    16: {
        value: '3',
        suit: 'H',
        display: "3\u2665"
    },
    17: {
        value: '4',
        suit: 'H',
        display: "4\u2665"
    },
    18: {
        value: '5',
        suit: 'H',
        display: "5\u2665"
    },
    19: {
        value: '6',
        suit: 'H',
        display: "6\u2665"
    },
    20: {
        value: '7',
        suit: 'H',
        display: "7\u2665"
    },
    21: {
        value: '8',
        suit: 'W',
        display: '8'
    },
    22: {
        value: '9',
        suit: 'H',
        display: "9\u2665"
    },
    23: {
        value: '10',
        suit: 'H',
        display: "10\u2665"
    },
    24: {
        value: 'J',
        suit: 'H',
        display: "J\u2665"
    },
    25: {
        value: 'Q',
        suit: 'H',
        display: "Q\u2665"
    },
    26: {
        value: 'K',
        suit: 'H',
        display: "K\u2665"
    },
    27: {
        value: 'A',
        suit: 'D',
        display: "A\u2666"
    },
    28: {
        value: '2',
        suit: 'D',
        display: "2\u2666"
    },
    29: {
        value: '3',
        suit: 'D',
        display: "3\u2666"
    },
    30: {
        value: '4',
        suit: 'D',
        display: "4\u2666"
    },
    31: {
        value: '5',
        suit: 'D',
        display: "5\u2666"
    },
    32: {
        value: '6',
        suit: 'D',
        display: "6\u2666"
    },
    33: {
        value: '7',
        suit: 'D',
        display: "7\u2666"
    },
    34: {
        value: '8',
        suit: 'W',
        display: '8'
    },
    35: {
        value: '9',
        suit: 'D',
        display: "9\u2666"
    },
    36: {
        value: '10',
        suit: 'D',
        display: "10\u2666"
    },
    37: {
        value: 'J',
        suit: 'D',
        display: "J\u2666"
    },
    38: {
        value: 'Q',
        suit: 'D',
        display: "Q\u2666"
    },
    39: {
        value: 'K',
        suit: 'D',
        display: "K\u2666"
    },
    40: {
        value: 'A',
        suit: 'C',
        display: "A\u2663"
    },
    41: {
        value: '2',
        suit: 'C',
        display: "2\u2663"
    },
    42: {
        value: '3',
        suit: 'C',
        display: "3\u2663"
    },
    43: {
        value: '4',
        suit: 'C',
        display: "4\u2663"
    },
    44: {
        value: '5',
        suit: 'C',
        display: "5\u2663"
    },
    45: {
        value: '6',
        suit: 'C',
        display: "6\u2663"
    },
    46: {
        value: '7',
        suit: 'C',
        display: "7\u2663"
    },
    47: {
        value: '8',
        suit: 'W',
        display: '8'
    },
    48: {
        value: '9',
        suit: 'C',
        display: "9\u2663"
    },
    49: {
        value: '10',
        suit: 'C',
        display: "10\u2663"
    },
    50: {
        value: 'J',
        suit: 'C',
        display: "J\u2663"
    },
    51: {
        value: 'Q',
        suit: 'C',
        display: "Q\u2663"
    },
    52: {
        value: 'K',
        suit: 'C',
        display: "K\u2663"
    }
};
function getGameId() {
    const path = window.location.pathname; //gets the pathname
    if (path.startsWith("/games/")) {
        const pathParts = path.split("/");
        if (pathParts.length > 2 && pathParts[2]) return pathParts[2];
    }
    return 0;
}
function getUserId() {
    const bodyElement = document.querySelector("body");
    return bodyElement?.dataset.userId || null;
}
async function fetchAndUpdateOpponentCardCounts() {
    if (gameId && opponentCardCountsDiv) try {
        const response = await fetch(`/games/${gameId}/players`);
        if (!response.ok) {
            console.error('Failed to fetch player info:', response.status);
            opponentCardCountsDiv.innerHTML = '<p>Failed to load opponent info.</p>';
            return;
        }
        const playersData = await response.json();
        opponentCardCountsDiv.innerHTML = '<h3>Opponent Card Counts</h3>';
        playersData.forEach((player)=>{
            if (player.id !== currentUserId && player.id !== '0' && player.id !== '-1') {
                const opponentInfo = document.createElement('p');
                if (player.hand_count != 0) opponentInfo.textContent = `${player.email}: ${player.hand_count} cards`;
                else opponentInfo.textContent = `${player.email}: WINNER!`;
                opponentCardCountsDiv.appendChild(opponentInfo);
            }
        });
    } catch (error) {
        console.error('Error fetching player info:', error);
        opponentCardCountsDiv.innerHTML = '<p>Failed to load opponent info.</p>';
    }
}
async function fetchAndUpdateDiscard() {
    if (gameId && discardPileDiv) try {
        const response = await fetch(`/games/${gameId}/discardTop`);
        if (!response.ok) {
            console.error('Failed to fetch discard top:', response.status);
            discardPileDiv.textContent = 'Discard pile is empty or failed to load.';
            return;
        }
        const discardData = await response.json();
        discardPileDiv.innerHTML = '<h3>Discard Pile</h3>';
        if (discardData) {
            //@ts-ignore
            const cardInfo = cardMap[discardData.card_id];
            const cardElement = document.createElement('div');
            cardElement.classList.add('card', cardInfo?.suit.toLowerCase());
            cardElement.textContent = cardInfo?.display || `ID: ${discardData.card_id}`;
            discardPileDiv.appendChild(cardElement);
        } else {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'Empty';
            discardPileDiv.appendChild(emptyMessage);
        }
    } catch (error) {
        console.error('Error fetching discard top:', error);
        discardPileDiv.textContent = 'Discard pile is empty or failed to load.';
    }
}
async function fetchAndUpdatePlayerHand() {
    if (gameId && playerHandDiv && playerHandContainer) try {
        const response = await fetch(`/games/${gameId}/hand`);
        if (!response.ok) {
            console.error('Failed to fetch hand:', response.status);
            playerHandDiv.textContent = 'Failed to load hand.';
            playerHandContainer.style.display = 'block';
            return;
        }
        const handData = await response.json();
        playerHandDiv.innerHTML = ''; //Clear previous hand
        if (handData && handData.length > 0) {
            handData.forEach((card)=>{
                //@ts-ignore
                const cardInfo = cardMap[card.card_id];
                //check if card is an 8 or not
                if ((card.card_id - 1) % 13 === 7) console.log("8 on screen!");
                const cardElement = document.createElement('div');
                cardElement.id = "hand-card-button";
                cardElement.classList.add('card', cardInfo?.suit.toLowerCase()); //Add suit as a class for styling
                cardElement.textContent = cardInfo?.display || `ID: ${card.card_id}`;
                cardElement.addEventListener('click', ()=>{
                    console.log(`Clicked card ID: ${card.card_id}`);
                    fetch(`${gameId}/${card.card_id}/discard`, {
                        method: "post",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).then(async (response)=>{
                        if (response.ok) {
                            console.log(`Successfully discarded card ID: ${card.card_id}`);
                            //Remove the card element from the DOM
                            cardElement.remove();
                            //update cards on screen
                            fetchAndUpdateDiscard();
                            fetchAndUpdateOpponentCardCounts();
                            console.log(`Turn Complete!`);
                            // Introduce a 2-second delay using setTimeout
                            setTimeout(async ()=>{
                                //get current turn player's name
                                try {
                                    const currNameResponse = await fetch(`/games/${gameId}/getCurrName`);
                                    if (currNameResponse.ok) {
                                        const currentPlayerName = await currNameResponse.text(); // Assuming server sends plain text
                                        console.log(`Current Player's Turn: ${currentPlayerName}`);
                                        //Send a chat message that it is now the next player's turn
                                        fetch(`/chat/${gameId}`, {
                                            method: "post",
                                            headers: {
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify({
                                                message: `It is now ${currentPlayerName}'s turn!`,
                                                senderId: 0
                                            })
                                        }).catch((error)=>{
                                            console.error("Error sending turn message:", error);
                                        });
                                    } else console.error("Failed to fetch current player name:", currNameResponse.status);
                                } catch (error) {
                                    console.error("Error fetching current player name:", error);
                                }
                            }, 750); //time delay, prevent code not being able to figure out who's turn it is and getting stuck on player 0
                        } else if (response.status === 403) response.text().then((message)=>{
                            console.log(`Discard failed: ${message}`);
                        });
                        else console.error("Error discarding card:", response.status);
                    }).catch((error)=>{
                        console.error("Error discarding card:", error);
                    });
                });
                playerHandDiv.appendChild(cardElement);
            });
            playerHandContainer.style.display = 'block';
        } else {
            //insert game win state here
            playerHandDiv.textContent = 'Your hand is empty.';
            playerHandContainer.style.display = 'block';
            fetch(`${gameId}/winner`, {
                method: "get"
            });
        }
    } catch (error) {
        console.error('Error fetching hand:', error);
        playerHandDiv.textContent = 'Failed to load hand.';
        playerHandContainer.style.display = 'block';
    }
    else console.error('Game ID or hand elements not found.');
}
startGameButton?.addEventListener("click", (event)=>{
    event.preventDefault();
    const gameId = getGameId();
    console.log(`games/${gameId}/start`);
    fetch(`${gameId}/start`, {
        method: "post"
    });
    // Send a chat message that the game has started
    fetch(`/chat/${gameId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "The game has started!",
            senderId: 0
        })
    }).catch((error)=>{
        console.error("Error sending game started message:", error);
    });
    // Make the start button disappear
    if (startGameButton) startGameButton.style.display = 'none';
});
drawCardButton?.addEventListener("click", (event)=>{
    event.preventDefault();
    const gameId = getGameId();
    fetch(`${gameId}/draw`, {
        method: "post"
    }).then((response)=>{
        if (response.ok) {
            console.log("Card drawn successfully. Updating UI.");
            fetchAndUpdatePlayerHand();
            fetchAndUpdateOpponentCardCounts();
            fetchAndUpdateDiscard();
        } else if (response.status === 403) response.text().then((message)=>{
            console.log(`Draw failed: ${message}`);
        });
        else console.error("Failed to draw card:", response.status);
    }).catch((error)=>{
        console.error("Could not draw card:", error);
    });
});
//test retrieve user and game id
announcePresenceButton?.addEventListener("click", (event)=>{
    event.preventDefault();
    const gameId = getGameId();
    const userId = getUserId();
    if (userId) fetch(`/chat/${gameId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: `I am player #${userId} in game room #${gameId}`,
            senderId: userId
        })
    }).catch((error)=>{
        console.error("Error sending announcement message:", error);
    });
    else console.error("Could not retrieve user ID from the body element.");
});
showHandButton?.addEventListener('click', async (event)=>{
    event.preventDefault();
    await fetchAndUpdatePlayerHand();
    await fetchAndUpdateOpponentCardCounts();
    await fetchAndUpdateDiscard();
});
resetGameButton?.addEventListener('click', async (event)=>{
    event.preventDefault();
    const gameId = getGameId();
    // Check if the input value is "reset" (case-insensitive)
    if (resetConfirmInput && resetConfirmInput.value.toLowerCase() === "reset") {
        //reset deck
        fetch(`${gameId}/resetGame`, {
            method: "get"
        });
        // Send a chat message that the deck has been reset
        fetch(`/chat/${gameId}`, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Deck reset!",
                senderId: 0
            })
        }).catch((error)=>{
            console.error("Error sending game deck reset message:", error);
        });
        //start new game
        console.log(`games/${gameId}/start`);
        fetch(`${gameId}/start`, {
            method: "post"
        });
        // Send a chat message that the game has started
        fetch(`/chat/${gameId}`, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "The game has started!",
                senderId: 0
            })
        }).catch((error)=>{
            console.error("Error sending game started message:", error);
        });
        // Make the start button disappear
        if (startGameButton) startGameButton.style.display = 'none';
        if (resetConfirmInput) resetConfirmInput.value = "";
    } else alert("Please type 'reset' to confirm game reset."); //added an alert
});
// drawCardButton?.addEventListener('click', async (event) => {
//     event.preventDefault();
//     await fetchAndUpdatePlayerHand();
//     await fetchAndUpdateOpponentCardCounts();
//     await fetchAndUpdateDiscard();
// });
//Fetch and update opponent card counts, player hand, and discard every 10 seconds
setInterval(async ()=>{
    await fetchAndUpdateOpponentCardCounts();
    await fetchAndUpdatePlayerHand();
    await fetchAndUpdateDiscard(); // Call the new function in the interval
}, 5000);
//Initial fetch of opponent card counts and discard pile
fetchAndUpdateOpponentCardCounts();
fetchAndUpdateDiscard();

},{}]},["9KHD9","8WnK3"], "8WnK3", "parcelRequirea38c", {})

//# sourceMappingURL=index.js.map
