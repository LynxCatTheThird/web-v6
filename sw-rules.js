module.exports.config = {
    serviceWorker: {
        escape: 0,
        cacheName: 'LCTTBlogCache'
    },
    register: {
        onsuccess: undefined,
        onerror: () => console.error('Service Worker 注册失败，可能是由于您的浏览器不支持该功能！'),
        builder: (root, framework, pluginConfig) => {
            const { onerror, onsuccess } = pluginConfig.register;
            return `
            <script>
                (() => {
                    const sw = navigator.serviceWorker;
                    const error = ${onerror && onerror.toString()};
                    if (!sw?.register('${new URL(root).pathname}sw.js')
                        ${onsuccess ? `?.then(${onsuccess.toString()})` : ''}
                        ?.catch(error)
                    ) error()
                })()
            </script>`;
        }
    },
    dom: {
        onsuccess: () => {
            caches.match(location.href).then(res => {
                if (res)
                    res.json().then(json => {
                        utils && utils.snackbarShow(`已刷新缓存，更新为${json.global + '.' + json.local}版本最新内容`, false, 2000)
                    })
                else
                    console.info('未找到缓存')
            }).catch((error) => console.error("缓存匹配出错", error))
        }
    },
    json: {
        maxHtml: 15,
        charLimit: 1024,
        merge: [],
        exclude: {
            localhost: [],
            other: []
        }
    },
    external: {
        timeout: 5000,
        concurrencyLimit: 100,
        js: [],
        stable: [],
        replacer: srcUrl => srcUrl
    }
};

module.exports.cacheRules = {
    simple: {
        clean: true,
        search: false,
        match: (url, $eject) => url.pathname.match(/\.(js|css|woff2|woff|ttf|json|xml)$/),
    }
};

module.exports.getSpareUrls = srcUrl => {
    if (srcUrl.startsWith("https://npm.elemecdn.com")) {
        return {
            timeout: 3000,
            list: [srcUrl, `https://fastly.jsdelivr.net/${new URL(srcUrl).pathname}`],
        };
    }
}

module.exports.ejectValues = (hexo, rules) => {
    return {
        domain: {
            prefix: "const",
            value: new URL(hexo.config.url).host,
        },
    };
};