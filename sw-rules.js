module.exports.config = {
    /* @type {?ServiceWorkerConfig|boolean} */
    serviceWorker: {
        /* @type {number} */
        escape: 0,
        /* @type {string} */
        cacheName: 'LCTTBlogCache'
    },
    /* @type {?RegisterConfig|boolean} */
    register: {
        /* @type {?VoidFunction} */
        onsuccess: () => console.log('Service Worker 注册成功'),
        /* @type {?VoidFunction} */
        onerror: () => console.error('Service Worker 注册失败！可能是由于您的浏览器不支持该功能！'),
        /*
         * @param root {string} 网页根目录的 URL
         * @param framework {Object} 框架对象
         * @param pluginConfig {SwppConfig} swpp 配置项
         * @return {string} 一个 HTML 标签的字符串形式
         */
        builder: (root, framework, pluginConfig) => {
            const registerConfig = pluginConfig.register
            const {onerror, onsuccess} = registerConfig
            return `<script>
                (() => {
                    let sw = navigator.serviceWorker
                    let error = ${onerror.toString()}
                    if (!sw?.register('${new URL(root).pathname}sw.js')
                        ${onsuccess ? '?.then(' + onsuccess.toString() + ')' : ''}
                        ?.catch(error)
                    ) error()
                })()
            </script>`
        }
    },
    /* @type {?DomConfig|boolean} */
    dom: {
        /* @type {?VoidFunction} */
        onsuccess: () => console.log('缓存更新成功'),
    },
    /* @type {?VersionJsonConfig|boolean} */
    json: {
        /* @type {number} */
        maxHtml: 15,
        /* @type {number} */
        charLimit: 1024,
        /* @type {string[]} */
        merge: [],
        exclude: {
            /* @type {RegExp[]} */
            localhost: [],
            /* @type {RegExp[]} */
            other: []
        }
    },
    /* @type {?ExternalMonitorConfig|boolean} */
    external: {
        /* @type {number} */
        timeout: 5000,
        /* 拉取文件时地并发限制 */
        concurrencyLimit: 100,
        /* @type {({head: string, tail: string}|function(string):string[])[]} */
        js: [],
        /* @type {RegExp[]} */
        stable: [],
        /*
         * @param srcUrl {string} 原始 URL
         * @return {string[]|string}
         */
        replacer: srcUrl => srcUrl
    }
}
