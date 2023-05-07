define([ "exports" ], (function(e) {
    "use strict";
    try {
        self["workbox:core:6.5.3"] && _();
    } catch (e) {}
    const t = (() => {
        "__WB_DISABLE_DEV_LOGS" in self || (self.__WB_DISABLE_DEV_LOGS = !1);
        let e = !1;
        const t = {
            debug: "#7f8c8d",
            log: "#2ecc71",
            warn: "#f39c12",
            error: "#c0392b",
            groupCollapsed: "#3498db",
            groupEnd: null
        }, print = function(r, a) {
            if (self.__WB_DISABLE_DEV_LOGS) return;
            if ("groupCollapsed" === r && /^((?!chrome|android).)*safari/i.test(navigator.userAgent)) return void console[r](...a);
            const s = e ? [] : [ "%cworkbox", [ `background: ${t[r]}`, "border-radius: 0.5em", "color: white", "font-weight: bold", "padding: 2px 0.5em" ].join(";") ];
            console[r](...s, ...a), "groupCollapsed" === r && (e = !0), "groupEnd" === r && (e = !1);
        }, r = {}, a = Object.keys(t);
        for (const e of a) {
            const t = e;
            r[t] = (...e) => {
                print(t, e);
            };
        }
        return r;
    })(), r = {
        "invalid-value": ({paramName: e, validValueDescription: t, value: r}) => {
            if (!e || !t) throw new Error("Unexpected input to 'invalid-value' error.");
            return `The '${e}' parameter was given a value with an unexpected value. ${t} Received a value of ${JSON.stringify(r)}.`;
        },
        "not-an-array": ({moduleName: e, className: t, funcName: r, paramName: a}) => {
            if (!(e && t && r && a)) throw new Error("Unexpected input to 'not-an-array' error.");
            return `The parameter '${a}' passed into '${e}.${t}.${r}()' must be an array.`;
        },
        "incorrect-type": ({expectedType: e, paramName: t, moduleName: r, className: a, funcName: s}) => {
            if (!(e && t && r && s)) throw new Error("Unexpected input to 'incorrect-type' error.");
            return `The parameter '${t}' passed into '${r}.${a ? `${a}.` : ""}${s}()' must be of type ${e}.`;
        },
        "incorrect-class": ({expectedClassName: e, paramName: t, moduleName: r, className: a, funcName: s, isReturnValueProblem: n}) => {
            if (!e || !r || !s) throw new Error("Unexpected input to 'incorrect-class' error.");
            const o = a ? `${a}.` : "";
            return n ? `The return value from '${r}.${o}${s}()' must be an instance of class ${e}.` : `The parameter '${t}' passed into '${r}.${o}${s}()' must be an instance of class ${e}.`;
        },
        "missing-a-method": ({expectedMethod: e, paramName: t, moduleName: r, className: a, funcName: s}) => {
            if (!(e && t && r && a && s)) throw new Error("Unexpected input to 'missing-a-method' error.");
            return `${r}.${a}.${s}() expected the '${t}' parameter to expose a '${e}' method.`;
        },
        "add-to-cache-list-unexpected-type": ({entry: e}) => `An unexpected entry was passed to 'workbox-precaching.PrecacheController.addToCacheList()' The entry '${JSON.stringify(e)}' isn't supported. You must supply an array of strings with one or more characters, objects with a url property or Request objects.`,
        "add-to-cache-list-conflicting-entries": ({firstEntry: e, secondEntry: t}) => {
            if (!e || !t) throw new Error("Unexpected input to 'add-to-cache-list-duplicate-entries' error.");
            return `Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${e} but different revision details. Workbox is unable to cache and version the asset correctly. Please remove one of the entries.`;
        },
        "plugin-error-request-will-fetch": ({thrownErrorMessage: e}) => {
            if (!e) throw new Error("Unexpected input to 'plugin-error-request-will-fetch', error.");
            return `An error was thrown by a plugins 'requestWillFetch()' method. The thrown error message was: '${e}'.`;
        },
        "invalid-cache-name": ({cacheNameId: e, value: t}) => {
            if (!e) throw new Error("Expected a 'cacheNameId' for error 'invalid-cache-name'");
            return `You must provide a name containing at least one character for setCacheDetails({${e}: '...'}). Received a value of '${JSON.stringify(t)}'`;
        },
        "unregister-route-but-not-found-with-method": ({method: e}) => {
            if (!e) throw new Error("Unexpected input to 'unregister-route-but-not-found-with-method' error.");
            return `The route you're trying to unregister was not  previously registered for the method type '${e}'.`;
        },
        "unregister-route-route-not-registered": () => "The route you're trying to unregister was not previously registered.",
        "queue-replay-failed": ({name: e}) => `Replaying the background sync queue '${e}' failed.`,
        "duplicate-queue-name": ({name: e}) => `The Queue name '${e}' is already being used. All instances of backgroundSync.Queue must be given unique names.`,
        "expired-test-without-max-age": ({methodName: e, paramName: t}) => `The '${e}()' method can only be used when the '${t}' is used in the constructor.`,
        "unsupported-route-type": ({moduleName: e, className: t, funcName: r, paramName: a}) => `The supplied '${a}' parameter was an unsupported type. Please check the docs for ${e}.${t}.${r} for valid input types.`,
        "not-array-of-class": ({value: e, expectedClass: t, moduleName: r, className: a, funcName: s, paramName: n}) => `The supplied '${n}' parameter must be an array of '${t}' objects. Received '${JSON.stringify(e)},'. Please check the call to ${r}.${a}.${s}() to fix the issue.`,
        "max-entries-or-age-required": ({moduleName: e, className: t, funcName: r}) => `You must define either config.maxEntries or config.maxAgeSecondsin ${e}.${t}.${r}`,
        "statuses-or-headers-required": ({moduleName: e, className: t, funcName: r}) => `You must define either config.statuses or config.headersin ${e}.${t}.${r}`,
        "invalid-string": ({moduleName: e, funcName: t, paramName: r}) => {
            if (!r || !e || !t) throw new Error("Unexpected input to 'invalid-string' error.");
            return `When using strings, the '${r}' parameter must start with 'http' (for cross-origin matches) or '/' (for same-origin matches). Please see the docs for ${e}.${t}() for more info.`;
        },
        "channel-name-required": () => "You must provide a channelName to construct a BroadcastCacheUpdate instance.",
        "invalid-responses-are-same-args": () => "The arguments passed into responsesAreSame() appear to be invalid. Please ensure valid Responses are used.",
        "expire-custom-caches-only": () => "You must provide a 'cacheName' property when using the expiration plugin with a runtime caching strategy.",
        "unit-must-be-bytes": ({normalizedRangeHeader: e}) => {
            if (!e) throw new Error("Unexpected input to 'unit-must-be-bytes' error.");
            return `The 'unit' portion of the Range header must be set to 'bytes'. The Range header provided was "${e}"`;
        },
        "single-range-only": ({normalizedRangeHeader: e}) => {
            if (!e) throw new Error("Unexpected input to 'single-range-only' error.");
            return `Multiple ranges are not supported. Please use a  single start value, and optional end value. The Range header provided was "${e}"`;
        },
        "invalid-range-values": ({normalizedRangeHeader: e}) => {
            if (!e) throw new Error("Unexpected input to 'invalid-range-values' error.");
            return `The Range header is missing both start and end values. At least one of those values is needed. The Range header provided was "${e}"`;
        },
        "no-range-header": () => "No Range header was found in the Request provided.",
        "range-not-satisfiable": ({size: e, start: t, end: r}) => `The start (${t}) and end (${r}) values in the Range are not satisfiable by the cached response, which is ${e} bytes.`,
        "attempt-to-cache-non-get-request": ({url: e, method: t}) => `Unable to cache '${e}' because it is a '${t}' request and only 'GET' requests can be cached.`,
        "cache-put-with-no-response": ({url: e}) => `There was an attempt to cache '${e}' but the response was not defined.`,
        "no-response": ({url: e, error: t}) => {
            let r = `The strategy could not generate a response for '${e}'.`;
            return t && (r += ` The underlying error is ${t}.`), r;
        },
        "bad-precaching-response": ({url: e, status: t}) => `The precaching request for '${e}' failed` + (t ? ` with an HTTP status of ${t}.` : "."),
        "non-precached-url": ({url: e}) => `createHandlerBoundToURL('${e}') was called, but that URL is not precached. Please pass in a URL that is precached instead.`,
        "add-to-cache-list-conflicting-integrities": ({url: e}) => `Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${e} with different integrity values. Please remove one of them.`,
        "missing-precache-entry": ({cacheName: e, url: t}) => `Unable to find a precached response in ${e} for ${t}.`,
        "cross-origin-copy-response": ({origin: e}) => `workbox-core.copyResponse() can only be used with same-origin responses. It was passed a response with origin ${e}.`,
        "opaque-streams-source": ({type: e}) => {
            const t = `One of the workbox-streams sources resulted in an '${e}' response.`;
            return "opaqueredirect" === e ? `${t} Please do not use a navigation request that results in a redirect as a source.` : `${t} Please ensure your sources are CORS-enabled.`;
        }
    }, messageGenerator = (e, t = {}) => {
        const a = r[e];
        if (!a) throw new Error(`Unable to find message for code '${e}'.`);
        return a(t);
    };
    class a extends Error {
        constructor(e, t) {
            super(messageGenerator(e, t)), this.name = e, this.details = t;
        }
    }
    const finalAssertExports_hasMethod = (e, t, r) => {
        if ("function" !== typeof e[t]) throw r.expectedMethod = t, new a("missing-a-method", r);
    }, finalAssertExports_isArray = (e, t) => {
        if (!Array.isArray(e)) throw new a("not-an-array", t);
    }, finalAssertExports_isInstance = (e, t, r) => {
        if (!(e instanceof t)) throw r.expectedClassName = t.name, new a("incorrect-class", r);
    }, finalAssertExports_isOneOf = (e, t, r) => {
        if (!t.includes(e)) throw r.validValueDescription = `Valid values are ${JSON.stringify(t)}.`, 
        new a("invalid-value", r);
    }, finalAssertExports_isType = (e, t, r) => {
        if (typeof e !== t) throw r.expectedType = t, new a("incorrect-type", r);
    };
    try {
        self["workbox:routing:6.5.3"] && _();
    } catch (e) {}
    const s = [ "DELETE", "GET", "HEAD", "PATCH", "POST", "PUT" ], normalizeHandler = e => e && "object" == typeof e ? (finalAssertExports_hasMethod(e, "handle", {
        moduleName: "workbox-routing",
        className: "Route",
        funcName: "constructor",
        paramName: "handler"
    }), e) : (finalAssertExports_isType(e, "function", {
        moduleName: "workbox-routing",
        className: "Route",
        funcName: "constructor",
        paramName: "handler"
    }), {
        handle: e
    });
    class n {
        constructor(e, t, r = "GET") {
            finalAssertExports_isType(e, "function", {
                moduleName: "workbox-routing",
                className: "Route",
                funcName: "constructor",
                paramName: "match"
            }), r && finalAssertExports_isOneOf(r, s, {
                paramName: "method"
            }), this.handler = normalizeHandler(t), this.match = e, this.method = r;
        }
        setCatchHandler(e) {
            this.catchHandler = normalizeHandler(e);
        }
    }
    class o extends n {
        constructor(e, r, a) {
            finalAssertExports_isInstance(e, RegExp, {
                moduleName: "workbox-routing",
                className: "RegExpRoute",
                funcName: "constructor",
                paramName: "pattern"
            });
            super((({url: r}) => {
                const a = e.exec(r.href);
                if (a) {
                    if (r.origin === location.origin || 0 === a.index) return a.slice(1);
                    t.debug(`The regular expression '${e.toString()}' only partially matched against the cross-origin URL '${r.toString()}'. RegExpRoute's will only handle cross-origin requests if they match the entire URL.`);
                }
            }), r, a);
        }
    }
    const getFriendlyURL = e => new URL(String(e), location.href).href.replace(new RegExp(`^${location.origin}`), "");
    class i {
        constructor() {
            this._routes = new Map, this._defaultHandlerMap = new Map;
        }
        get routes() {
            return this._routes;
        }
        addFetchListener() {
            self.addEventListener("fetch", (e => {
                const {request: t} = e, r = this.handleRequest({
                    request: t,
                    event: e
                });
                r && e.respondWith(r);
            }));
        }
        addCacheListener() {
            self.addEventListener("message", (e => {
                if (e.data && "CACHE_URLS" === e.data.type) {
                    const {payload: r} = e.data;
                    t.debug("Caching URLs from the window", r.urlsToCache);
                    const a = Promise.all(r.urlsToCache.map((t => {
                        "string" == typeof t && (t = [ t ]);
                        const r = new Request(...t);
                        return this.handleRequest({
                            request: r,
                            event: e
                        });
                    })));
                    e.waitUntil(a), e.ports && e.ports[0] && a.then((() => e.ports[0].postMessage(!0)));
                }
            }));
        }
        handleRequest({request: e, event: r}) {
            finalAssertExports_isInstance(e, Request, {
                moduleName: "workbox-routing",
                className: "Router",
                funcName: "handleRequest",
                paramName: "options.request"
            });
            const a = new URL(e.url, location.href);
            if (!a.protocol.startsWith("http")) return void t.debug("Workbox Router only supports URLs that start with 'http'.");
            const s = a.origin === location.origin, {params: n, route: o} = this.findMatchingRoute({
                event: r,
                request: e,
                sameOrigin: s,
                url: a
            });
            let i = o && o.handler;
            const c = [];
            i && (c.push([ "Found a route to handle this request:", o ]), n && c.push([ "Passing the following params to the route's handler:", n ]));
            const h = e.method;
            if (!i && this._defaultHandlerMap.has(h) && (c.push(`Failed to find a matching route. Falling back to the default handler for ${h}.`), 
            i = this._defaultHandlerMap.get(h)), !i) return void t.debug(`No route found for: ${getFriendlyURL(a)}`);
            let l;
            t.groupCollapsed(`Router is responding to: ${getFriendlyURL(a)}`), c.forEach((e => {
                Array.isArray(e) ? t.log(...e) : t.log(e);
            })), t.groupEnd();
            try {
                l = i.handle({
                    url: a,
                    request: e,
                    event: r,
                    params: n
                });
            } catch (e) {
                l = Promise.reject(e);
            }
            const u = o && o.catchHandler;
            return l instanceof Promise && (this._catchHandler || u) && (l = l.catch((async s => {
                if (u) {
                    t.groupCollapsed(`Error thrown when responding to:  ${getFriendlyURL(a)}. Falling back to route's Catch Handler.`), 
                    t.error("Error thrown by:", o), t.error(s), t.groupEnd();
                    try {
                        return await u.handle({
                            url: a,
                            request: e,
                            event: r,
                            params: n
                        });
                    } catch (e) {
                        e instanceof Error && (s = e);
                    }
                }
                if (this._catchHandler) return t.groupCollapsed(`Error thrown when responding to:  ${getFriendlyURL(a)}. Falling back to global Catch Handler.`), 
                t.error("Error thrown by:", o), t.error(s), t.groupEnd(), this._catchHandler.handle({
                    url: a,
                    request: e,
                    event: r
                });
                throw s;
            }))), l;
        }
        findMatchingRoute({url: e, sameOrigin: r, request: a, event: s}) {
            const n = this._routes.get(a.method) || [];
            for (const o of n) {
                let n;
                const i = o.match({
                    url: e,
                    sameOrigin: r,
                    request: a,
                    event: s
                });
                if (i) return i instanceof Promise && t.warn(`While routing ${getFriendlyURL(e)}, an async matchCallback function was used. Please convert the following route to use a synchronous matchCallback function:`, o), 
                n = i, (Array.isArray(n) && 0 === n.length || i.constructor === Object && 0 === Object.keys(i).length || "boolean" == typeof i) && (n = void 0), 
                {
                    route: o,
                    params: n
                };
            }
            return {};
        }
        setDefaultHandler(e, t = "GET") {
            this._defaultHandlerMap.set(t, normalizeHandler(e));
        }
        setCatchHandler(e) {
            this._catchHandler = normalizeHandler(e);
        }
        registerRoute(e) {
            finalAssertExports_isType(e, "object", {
                moduleName: "workbox-routing",
                className: "Router",
                funcName: "registerRoute",
                paramName: "route"
            }), finalAssertExports_hasMethod(e, "match", {
                moduleName: "workbox-routing",
                className: "Router",
                funcName: "registerRoute",
                paramName: "route"
            }), finalAssertExports_isType(e.handler, "object", {
                moduleName: "workbox-routing",
                className: "Router",
                funcName: "registerRoute",
                paramName: "route"
            }), finalAssertExports_hasMethod(e.handler, "handle", {
                moduleName: "workbox-routing",
                className: "Router",
                funcName: "registerRoute",
                paramName: "route.handler"
            }), finalAssertExports_isType(e.method, "string", {
                moduleName: "workbox-routing",
                className: "Router",
                funcName: "registerRoute",
                paramName: "route.method"
            }), this._routes.has(e.method) || this._routes.set(e.method, []), this._routes.get(e.method).push(e);
        }
        unregisterRoute(e) {
            if (!this._routes.has(e.method)) throw new a("unregister-route-but-not-found-with-method", {
                method: e.method
            });
            const t = this._routes.get(e.method).indexOf(e);
            if (!(t > -1)) throw new a("unregister-route-route-not-registered");
            this._routes.get(e.method).splice(t, 1);
        }
    }
    let c;
    const getOrCreateDefaultRouter = () => (c || (c = new i, c.addFetchListener(), c.addCacheListener()), 
    c);
    function registerRoute(e, r, s) {
        let i;
        if ("string" == typeof e) {
            const o = new URL(e, location.href);
            {
                if (!e.startsWith("/") && !e.startsWith("http")) throw new a("invalid-string", {
                    moduleName: "workbox-routing",
                    funcName: "registerRoute",
                    paramName: "capture"
                });
                const r = e.startsWith("http") ? o.pathname : e, s = "[*:?+]";
                new RegExp(`${s}`).exec(r) && t.debug(`The '$capture' parameter contains an Express-style wildcard character (${s}). Strings are now always interpreted as exact matches; use a RegExp for partial or wildcard matches.`);
            }
            i = new n((({url: r}) => (r.pathname === o.pathname && r.origin !== o.origin && t.debug(`${e} only partially matches the cross-origin URL ${r.toString()}. This route will only handle cross-origin requests if they match the entire URL.`), 
            r.href === o.href)), r, s);
        } else if (e instanceof RegExp) i = new o(e, r, s); else if ("function" == typeof e) i = new n(e, r, s); else {
            if (!(e instanceof n)) throw new a("unsupported-route-type", {
                moduleName: "workbox-routing",
                funcName: "registerRoute",
                paramName: "capture"
            });
            i = e;
        }
        return getOrCreateDefaultRouter().registerRoute(i), i;
    }
    try {
        self["workbox:strategies:6.5.3"] && _();
    } catch (e) {}
    const h = {
        cacheWillUpdate: async ({response: e}) => 200 === e.status || 0 === e.status ? e : null
    }, l = {
        googleAnalytics: "googleAnalytics",
        precache: "precache-v2",
        prefix: "workbox",
        runtime: "runtime",
        suffix: "undefined" != typeof registration ? registration.scope : ""
    }, _createCacheName = e => [ l.prefix, e, l.suffix ].filter((e => e && e.length > 0)).join("-"), cacheNames_updateDetails = e => {
        (e => {
            for (const t of Object.keys(l)) e(t);
        })((t => {
            "string" == typeof e[t] && (l[t] = e[t]);
        }));
    }, cacheNames_getPrecacheName = e => e || _createCacheName(l.precache), cacheNames_getRuntimeName = e => e || _createCacheName(l.runtime);
    function stripParams(e, t) {
        const r = new URL(e);
        for (const e of t) r.searchParams.delete(e);
        return r.href;
    }
    class u {
        constructor() {
            this.promise = new Promise(((e, t) => {
                this.resolve = e, this.reject = t;
            }));
        }
    }
    const d = new Set;
    function toRequest(e) {
        return "string" == typeof e ? new Request(e) : e;
    }
    class p {
        constructor(e, t) {
            this._cacheKeys = {}, finalAssertExports_isInstance(t.event, ExtendableEvent, {
                moduleName: "workbox-strategies",
                className: "StrategyHandler",
                funcName: "constructor",
                paramName: "options.event"
            }), Object.assign(this, t), this.event = t.event, this._strategy = e, this._handlerDeferred = new u, 
            this._extendLifetimePromises = [], this._plugins = [ ...e.plugins ], this._pluginStateMap = new Map;
            for (const e of this._plugins) this._pluginStateMap.set(e, {});
            this.event.waitUntil(this._handlerDeferred.promise);
        }
        async fetch(e) {
            const {event: r} = this;
            let s = toRequest(e);
            if ("navigate" === s.mode && r instanceof FetchEvent && r.preloadResponse) {
                const e = await r.preloadResponse;
                if (e) return t.log(`Using a preloaded navigation response for '${getFriendlyURL(s.url)}'`), 
                e;
            }
            const n = this.hasCallback("fetchDidFail") ? s.clone() : null;
            try {
                for (const e of this.iterateCallbacks("requestWillFetch")) s = await e({
                    request: s.clone(),
                    event: r
                });
            } catch (e) {
                if (e instanceof Error) throw new a("plugin-error-request-will-fetch", {
                    thrownErrorMessage: e.message
                });
            }
            const o = s.clone();
            try {
                let e;
                e = await fetch(s, "navigate" === s.mode ? void 0 : this._strategy.fetchOptions), 
                t.debug(`Network request for '${getFriendlyURL(s.url)}' returned a response with status '${e.status}'.`);
                for (const t of this.iterateCallbacks("fetchDidSucceed")) e = await t({
                    event: r,
                    request: o,
                    response: e
                });
                return e;
            } catch (e) {
                throw t.log(`Network request for '${getFriendlyURL(s.url)}' threw an error.`, e), 
                n && await this.runCallbacks("fetchDidFail", {
                    error: e,
                    event: r,
                    originalRequest: n.clone(),
                    request: o.clone()
                }), e;
            }
        }
        async fetchAndCachePut(e) {
            const t = await this.fetch(e), r = t.clone();
            return this.waitUntil(this.cachePut(e, r)), t;
        }
        async cacheMatch(e) {
            const r = toRequest(e);
            let a;
            const {cacheName: s, matchOptions: n} = this._strategy, o = await this.getCacheKey(r, "read"), i = Object.assign(Object.assign({}, n), {
                cacheName: s
            });
            a = await caches.match(o, i), a ? t.debug(`Found a cached response in '${s}'.`) : t.debug(`No cached response found in '${s}'.`);
            for (const e of this.iterateCallbacks("cachedResponseWillBeUsed")) a = await e({
                cacheName: s,
                matchOptions: n,
                cachedResponse: a,
                request: o,
                event: this.event
            }) || void 0;
            return a;
        }
        async cachePut(e, r) {
            const s = toRequest(e);
            var n;
            await (n = 0, new Promise((e => setTimeout(e, n))));
            const o = await this.getCacheKey(s, "write");
            {
                if (o.method && "GET" !== o.method) throw new a("attempt-to-cache-non-get-request", {
                    url: getFriendlyURL(o.url),
                    method: o.method
                });
                const e = r.headers.get("Vary");
                e && t.debug(`The response for ${getFriendlyURL(o.url)} has a 'Vary: ${e}' header. Consider setting the {ignoreVary: true} option on your strategy to ensure cache matching and deletion works as expected.`);
            }
            if (!r) throw t.error(`Cannot cache non-existent response for '${getFriendlyURL(o.url)}'.`), 
            new a("cache-put-with-no-response", {
                url: getFriendlyURL(o.url)
            });
            const i = await this._ensureResponseSafeToCache(r);
            if (!i) return t.debug(`Response '${getFriendlyURL(o.url)}' will not be cached.`, i), 
            !1;
            const {cacheName: c, matchOptions: h} = this._strategy, l = await self.caches.open(c), u = this.hasCallback("cacheDidUpdate"), p = u ? await async function(e, t, r, a) {
                const s = stripParams(t.url, r);
                if (t.url === s) return e.match(t, a);
                const n = Object.assign(Object.assign({}, a), {
                    ignoreSearch: !0
                }), o = await e.keys(t, n);
                for (const t of o) if (s === stripParams(t.url, r)) return e.match(t, a);
            }(l, o.clone(), [ "__WB_REVISION__" ], h) : null;
            t.debug(`Updating the '${c}' cache with a new Response for ${getFriendlyURL(o.url)}.`);
            try {
                await l.put(o, u ? i.clone() : i);
            } catch (e) {
                if (e instanceof Error) throw "QuotaExceededError" === e.name && await async function() {
                    t.log(`About to run ${d.size} callbacks to clean up caches.`);
                    for (const e of d) await e(), t.log(e, "is complete.");
                    t.log("Finished running callbacks.");
                }(), e;
            }
            for (const e of this.iterateCallbacks("cacheDidUpdate")) await e({
                cacheName: c,
                oldResponse: p,
                newResponse: i.clone(),
                request: o,
                event: this.event
            });
            return !0;
        }
        async getCacheKey(e, t) {
            const r = `${e.url} | ${t}`;
            if (!this._cacheKeys[r]) {
                let a = e;
                for (const e of this.iterateCallbacks("cacheKeyWillBeUsed")) a = toRequest(await e({
                    mode: t,
                    request: a,
                    event: this.event,
                    params: this.params
                }));
                this._cacheKeys[r] = a;
            }
            return this._cacheKeys[r];
        }
        hasCallback(e) {
            for (const t of this._strategy.plugins) if (e in t) return !0;
            return !1;
        }
        async runCallbacks(e, t) {
            for (const r of this.iterateCallbacks(e)) await r(t);
        }
        * iterateCallbacks(e) {
            for (const t of this._strategy.plugins) if ("function" == typeof t[e]) {
                const r = this._pluginStateMap.get(t), statefulCallback = a => {
                    const s = Object.assign(Object.assign({}, a), {
                        state: r
                    });
                    return t[e](s);
                };
                yield statefulCallback;
            }
        }
        waitUntil(e) {
            return this._extendLifetimePromises.push(e), e;
        }
        async doneWaiting() {
            let e;
            for (;e = this._extendLifetimePromises.shift(); ) await e;
        }
        destroy() {
            this._handlerDeferred.resolve(null);
        }
        async _ensureResponseSafeToCache(e) {
            let r = e, a = !1;
            for (const e of this.iterateCallbacks("cacheWillUpdate")) if (r = await e({
                request: this.request,
                response: r,
                event: this.event
            }) || void 0, a = !0, !r) break;
            return a || (r && 200 !== r.status && (r = void 0), r && 200 !== r.status && (0 === r.status ? t.warn(`The response for '${this.request.url}' is an opaque response. The caching strategy that you're using will not cache opaque responses by default.`) : t.debug(`The response for '${this.request.url}' returned a status code of '${e.status}' and won't be cached as a result.`))), 
            r;
        }
    }
    class f {
        constructor(e = {}) {
            this.cacheName = cacheNames_getRuntimeName(e.cacheName), this.plugins = e.plugins || [], 
            this.fetchOptions = e.fetchOptions, this.matchOptions = e.matchOptions;
        }
        handle(e) {
            const [t] = this.handleAll(e);
            return t;
        }
        handleAll(e) {
            e instanceof FetchEvent && (e = {
                event: e,
                request: e.request
            });
            const t = e.event, r = "string" == typeof e.request ? new Request(e.request) : e.request, a = "params" in e ? e.params : void 0, s = new p(this, {
                event: t,
                request: r,
                params: a
            }), n = this._getResponse(s, r, t);
            return [ n, this._awaitComplete(n, s, r, t) ];
        }
        async _getResponse(e, r, s) {
            let n;
            await e.runCallbacks("handlerWillStart", {
                event: s,
                request: r
            });
            try {
                if (n = await this._handle(r, e), !n || "error" === n.type) throw new a("no-response", {
                    url: r.url
                });
            } catch (a) {
                if (a instanceof Error) for (const t of e.iterateCallbacks("handlerDidError")) if (n = await t({
                    error: a,
                    event: s,
                    request: r
                }), n) break;
                if (!n) throw a;
                t.log(`While responding to '${getFriendlyURL(r.url)}', an ${a instanceof Error ? a.toString() : ""} error occurred. Using a fallback response provided by a handlerDidError plugin.`);
            }
            for (const t of e.iterateCallbacks("handlerWillRespond")) n = await t({
                event: s,
                request: r,
                response: n
            });
            return n;
        }
        async _awaitComplete(e, t, r, a) {
            let s, n;
            try {
                s = await e;
            } catch (n) {}
            try {
                await t.runCallbacks("handlerDidRespond", {
                    event: a,
                    request: r,
                    response: s
                }), await t.doneWaiting();
            } catch (e) {
                e instanceof Error && (n = e);
            }
            if (await t.runCallbacks("handlerDidComplete", {
                event: a,
                request: r,
                response: s,
                error: n
            }), t.destroy(), n) throw n;
        }
    }
    const messages_strategyStart = (e, t) => `Using ${e} to respond to '${getFriendlyURL(t.url)}'`, messages_printFinalResponse = e => {
        e && (t.groupCollapsed("View the final response here."), t.log(e || "[No response returned]"), 
        t.groupEnd());
    };
    function waitUntil(e, t) {
        const r = t();
        return e.waitUntil(r), r;
    }
    try {
        self["workbox:precaching:6.5.3"] && _();
    } catch (e) {}
    function createCacheKey(e) {
        if (!e) throw new a("add-to-cache-list-unexpected-type", {
            entry: e
        });
        if ("string" == typeof e) {
            const t = new URL(e, location.href);
            return {
                cacheKey: t.href,
                url: t.href
            };
        }
        const {revision: t, url: r} = e;
        if (!r) throw new a("add-to-cache-list-unexpected-type", {
            entry: e
        });
        if (!t) {
            const e = new URL(r, location.href);
            return {
                cacheKey: e.href,
                url: e.href
            };
        }
        const s = new URL(r, location.href), n = new URL(r, location.href);
        return s.searchParams.set("__WB_REVISION__", t), {
            cacheKey: s.href,
            url: n.href
        };
    }
    class g {
        constructor() {
            this.updatedURLs = [], this.notUpdatedURLs = [], this.handlerWillStart = async ({request: e, state: t}) => {
                t && (t.originalRequest = e);
            }, this.cachedResponseWillBeUsed = async ({event: e, state: t, cachedResponse: r}) => {
                if ("install" === e.type && t && t.originalRequest && t.originalRequest instanceof Request) {
                    const e = t.originalRequest.url;
                    r ? this.notUpdatedURLs.push(e) : this.updatedURLs.push(e);
                }
                return r;
            };
        }
    }
    class m {
        constructor({precacheController: e}) {
            this.cacheKeyWillBeUsed = async ({request: e, params: t}) => {
                const r = (null == t ? void 0 : t.cacheKey) || this._precacheController.getCacheKeyForURL(e.url);
                return r ? new Request(r, {
                    headers: e.headers
                }) : e;
            }, this._precacheController = e;
        }
    }
    function printCleanupDetails(e) {
        const r = e.length;
        r > 0 && (t.groupCollapsed(`During precaching cleanup, ${r} cached request${1 === r ? " was" : "s were"} deleted.`), 
        ((e, r) => {
            t.groupCollapsed(e);
            for (const e of r) t.log(e);
            t.groupEnd();
        })("Deleted Cache Requests", e), t.groupEnd());
    }
    function _nestedGroup(e, r) {
        if (0 !== r.length) {
            t.groupCollapsed(e);
            for (const e of r) t.log(e);
            t.groupEnd();
        }
    }
    let w, y;
    async function copyResponse(e, t) {
        let r = null;
        if (e.url) {
            r = new URL(e.url).origin;
        }
        if (r !== self.location.origin) throw new a("cross-origin-copy-response", {
            origin: r
        });
        const s = e.clone(), n = {
            headers: new Headers(s.headers),
            status: s.status,
            statusText: s.statusText
        }, o = t ? t(n) : n, i = function() {
            if (void 0 === w) {
                const e = new Response("");
                if ("body" in e) try {
                    new Response(e.body), w = !0;
                } catch (e) {
                    w = !1;
                }
                w = !1;
            }
            return w;
        }() ? s.body : await s.blob();
        return new Response(i, o);
    }
    class b extends f {
        constructor(e = {}) {
            e.cacheName = cacheNames_getPrecacheName(e.cacheName), super(e), this._fallbackToNetwork = !1 !== e.fallbackToNetwork, 
            this.plugins.push(b.copyRedirectedCacheableResponsesPlugin);
        }
        async _handle(e, t) {
            const r = await t.cacheMatch(e);
            return r || (t.event && "install" === t.event.type ? await this._handleInstall(e, t) : await this._handleFetch(e, t));
        }
        async _handleFetch(e, r) {
            let s;
            const n = r.params || {};
            if (!this._fallbackToNetwork) throw new a("missing-precache-entry", {
                cacheName: this.cacheName,
                url: e.url
            });
            {
                t.warn(`The precached response for ${getFriendlyURL(e.url)} in ${this.cacheName} was not found. Falling back to the network.`);
                const a = n.integrity, o = e.integrity, i = !o || o === a;
                if (s = await r.fetch(new Request(e, {
                    integrity: "no-cors" !== e.mode ? o || a : void 0
                })), a && i && "no-cors" !== e.mode) {
                    this._useDefaultCacheabilityPluginIfNeeded();
                    await r.cachePut(e, s.clone()) && t.log(`A response for ${getFriendlyURL(e.url)} was used to "repair" the precache.`);
                }
            }
            {
                const a = n.cacheKey || await r.getCacheKey(e, "read");
                t.groupCollapsed("Precaching is responding to: " + getFriendlyURL(e.url)), t.log(`Serving the precached url: ${getFriendlyURL(a instanceof Request ? a.url : a)}`), 
                t.groupCollapsed("View request details here."), t.log(e), t.groupEnd(), t.groupCollapsed("View response details here."), 
                t.log(s), t.groupEnd(), t.groupEnd();
            }
            return s;
        }
        async _handleInstall(e, t) {
            this._useDefaultCacheabilityPluginIfNeeded();
            const r = await t.fetch(e);
            if (!await t.cachePut(e, r.clone())) throw new a("bad-precaching-response", {
                url: e.url,
                status: r.status
            });
            return r;
        }
        _useDefaultCacheabilityPluginIfNeeded() {
            let e = null, t = 0;
            for (const [r, a] of this.plugins.entries()) a !== b.copyRedirectedCacheableResponsesPlugin && (a === b.defaultPrecacheCacheabilityPlugin && (e = r), 
            a.cacheWillUpdate && t++);
            0 === t ? this.plugins.push(b.defaultPrecacheCacheabilityPlugin) : t > 1 && null !== e && this.plugins.splice(e, 1);
        }
    }
    b.defaultPrecacheCacheabilityPlugin = {
        cacheWillUpdate: async ({response: e}) => !e || e.status >= 400 ? null : e
    }, b.copyRedirectedCacheableResponsesPlugin = {
        cacheWillUpdate: async ({response: e}) => e.redirected ? await copyResponse(e) : e
    };
    class R {
        constructor({cacheName: e, plugins: t = [], fallbackToNetwork: r = !0} = {}) {
            this._urlsToCacheKeys = new Map, this._urlsToCacheModes = new Map, this._cacheKeysToIntegrities = new Map, 
            this._strategy = new b({
                cacheName: cacheNames_getPrecacheName(e),
                plugins: [ ...t, new m({
                    precacheController: this
                }) ],
                fallbackToNetwork: r
            }), this.install = this.install.bind(this), this.activate = this.activate.bind(this);
        }
        get strategy() {
            return this._strategy;
        }
        precache(e) {
            this.addToCacheList(e), this._installAndActiveListenersAdded || (self.addEventListener("install", this.install), 
            self.addEventListener("activate", this.activate), this._installAndActiveListenersAdded = !0);
        }
        addToCacheList(e) {
            finalAssertExports_isArray(e, {
                moduleName: "workbox-precaching",
                className: "PrecacheController",
                funcName: "addToCacheList",
                paramName: "entries"
            });
            const r = [];
            for (const s of e) {
                "string" == typeof s ? r.push(s) : s && void 0 === s.revision && r.push(s.url);
                const {cacheKey: e, url: n} = createCacheKey(s), o = "string" != typeof s && s.revision ? "reload" : "default";
                if (this._urlsToCacheKeys.has(n) && this._urlsToCacheKeys.get(n) !== e) throw new a("add-to-cache-list-conflicting-entries", {
                    firstEntry: this._urlsToCacheKeys.get(n),
                    secondEntry: e
                });
                if ("string" != typeof s && s.integrity) {
                    if (this._cacheKeysToIntegrities.has(e) && this._cacheKeysToIntegrities.get(e) !== s.integrity) throw new a("add-to-cache-list-conflicting-integrities", {
                        url: n
                    });
                    this._cacheKeysToIntegrities.set(e, s.integrity);
                }
                if (this._urlsToCacheKeys.set(n, e), this._urlsToCacheModes.set(n, o), r.length > 0) {
                    const e = `Workbox is precaching URLs without revision info: ${r.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
                    t.warn(e);
                }
            }
        }
        install(e) {
            return waitUntil(e, (async () => {
                const r = new g;
                this.strategy.plugins.push(r);
                for (const [t, r] of this._urlsToCacheKeys) {
                    const a = this._cacheKeysToIntegrities.get(r), s = this._urlsToCacheModes.get(t), n = new Request(t, {
                        integrity: a,
                        cache: s,
                        credentials: "same-origin"
                    });
                    await Promise.all(this.strategy.handleAll({
                        params: {
                            cacheKey: r
                        },
                        request: n,
                        event: e
                    }));
                }
                const {updatedURLs: a, notUpdatedURLs: s} = r;
                return function(e, r) {
                    const a = e.length, s = r.length;
                    if (a || s) {
                        let n = `Precaching ${a} file${1 === a ? "" : "s"}.`;
                        s > 0 && (n += ` ${s} file${1 === s ? " is" : "s are"} already cached.`), t.groupCollapsed(n), 
                        _nestedGroup("View newly precached URLs.", e), _nestedGroup("View previously precached URLs.", r), 
                        t.groupEnd();
                    }
                }(a, s), {
                    updatedURLs: a,
                    notUpdatedURLs: s
                };
            }));
        }
        activate(e) {
            return waitUntil(e, (async () => {
                const e = await self.caches.open(this.strategy.cacheName), t = await e.keys(), r = new Set(this._urlsToCacheKeys.values()), a = [];
                for (const s of t) r.has(s.url) || (await e.delete(s), a.push(s.url));
                return printCleanupDetails(a), {
                    deletedURLs: a
                };
            }));
        }
        getURLsToCacheKeys() {
            return this._urlsToCacheKeys;
        }
        getCachedURLs() {
            return [ ...this._urlsToCacheKeys.keys() ];
        }
        getCacheKeyForURL(e) {
            const t = new URL(e, location.href);
            return this._urlsToCacheKeys.get(t.href);
        }
        getIntegrityForCacheKey(e) {
            return this._cacheKeysToIntegrities.get(e);
        }
        async matchPrecache(e) {
            const t = e instanceof Request ? e.url : e, r = this.getCacheKeyForURL(t);
            if (r) {
                return (await self.caches.open(this.strategy.cacheName)).match(r);
            }
        }
        createHandlerBoundToURL(e) {
            const t = this.getCacheKeyForURL(e);
            if (!t) throw new a("non-precached-url", {
                url: e
            });
            return r => (r.request = new Request(e), r.params = Object.assign({
                cacheKey: t
            }, r.params), this.strategy.handle(r));
        }
    }
    const getOrCreatePrecacheController = () => (y || (y = new R), y);
    class N extends n {
        constructor(e, r) {
            super((({request: a}) => {
                const s = e.getURLsToCacheKeys();
                for (const t of function*(e, {ignoreURLParametersMatching: t = [ /^utm_/, /^fbclid$/ ], directoryIndex: r = "index.html", cleanURLs: a = !0, urlManipulation: s} = {}) {
                    const n = new URL(e, location.href);
                    n.hash = "", yield n.href;
                    const o = function(e, t = []) {
                        for (const r of [ ...e.searchParams.keys() ]) t.some((e => e.test(r))) && e.searchParams.delete(r);
                        return e;
                    }(n, t);
                    if (yield o.href, r && o.pathname.endsWith("/")) {
                        const e = new URL(o.href);
                        e.pathname += r, yield e.href;
                    }
                    if (a) {
                        const e = new URL(o.href);
                        e.pathname += ".html", yield e.href;
                    }
                    if (s) {
                        const e = s({
                            url: n
                        });
                        for (const t of e) yield t.href;
                    }
                }(a.url, r)) {
                    const r = s.get(t);
                    if (r) {
                        return {
                            cacheKey: r,
                            integrity: e.getIntegrityForCacheKey(r)
                        };
                    }
                }
                t.debug("Precaching did not find a match for " + getFriendlyURL(a.url));
            }), e.strategy);
        }
    }
    e.StaleWhileRevalidate = class extends f {
        constructor(e = {}) {
            super(e), this.plugins.some((e => "cacheWillUpdate" in e)) || this.plugins.unshift(h);
        }
        async _handle(e, r) {
            const s = [];
            finalAssertExports_isInstance(e, Request, {
                moduleName: "workbox-strategies",
                className: this.constructor.name,
                funcName: "handle",
                paramName: "request"
            });
            const n = r.fetchAndCachePut(e).catch((() => {}));
            r.waitUntil(n);
            let o, i = await r.cacheMatch(e);
            if (i) s.push(`Found a cached response in the '${this.cacheName}' cache. Will update with the network response in the background.`); else {
                s.push(`No response found in the '${this.cacheName}' cache. Will wait for the network response.`);
                try {
                    i = await n;
                } catch (e) {
                    e instanceof Error && (o = e);
                }
            }
            t.groupCollapsed(messages_strategyStart(this.constructor.name, e));
            for (const e of s) t.log(e);
            if (messages_printFinalResponse(i), t.groupEnd(), !i) throw new a("no-response", {
                url: e.url,
                error: o
            });
            return i;
        }
    }, e.clientsClaim = function() {
        self.addEventListener("activate", (() => self.clients.claim()));
    }, e.precacheAndRoute = function(e, t) {
        !function(e) {
            getOrCreatePrecacheController().precache(e);
        }(e), function(e) {
            const t = getOrCreatePrecacheController();
            registerRoute(new N(t, e));
        }(t);
    }, e.registerRoute = registerRoute, e.setCacheNameDetails = function(e) {
        if (Object.keys(e).forEach((t => {
            finalAssertExports_isType(e[t], "string", {
                moduleName: "workbox-core",
                funcName: "setCacheNameDetails",
                paramName: `details.${t}`
            });
        })), "precache" in e && 0 === e.precache.length) throw new a("invalid-cache-name", {
            cacheNameId: "precache",
            value: e.precache
        });
        if ("runtime" in e && 0 === e.runtime.length) throw new a("invalid-cache-name", {
            cacheNameId: "runtime",
            value: e.runtime
        });
        if ("googleAnalytics" in e && 0 === e.googleAnalytics.length) throw new a("invalid-cache-name", {
            cacheNameId: "googleAnalytics",
            value: e.googleAnalytics
        });
        cacheNames_updateDetails(e);
    };
}));