hexo.extend.helper.register('export_config', function() {
    const { config, theme } = this, lang = hexo.theme.i18n.get(config.language || 'zh-CN')
    const exportGlobalConfig = {
        root: config.root,
        runtime: theme.aside.siteinfo.runtimeenable ? theme.aside.siteinfo.runtime : false,
        lazyload: {
            enable: theme.lazyload.enable,
            error: theme.lazyload.errorimg
        },
        lightbox: theme.lightbox,
        randomlinks: theme.footer.randomlink,
        lang: {
            theme: {
                dark: lang['theme.dark'],
                light: lang['theme.light'],
            },
            copy: {
                success: lang['copy.success'],
                error: lang['copy.error'],
            },
            backtop: lang['nav.backtop'],
            time: {
                recent: lang['time.recent'],
                yesterday: lang['time.yesterday'],
                berforeyesterday: lang['time.berforeyesterday'],
                daybefore: lang['time.daybefore'],
                runtime: lang['time.runtime'],
            },
            sayhello: {
                morning: lang['sayhello.morning'],
                noon: lang['sayhello.noon'],
                afternoon: lang['sayhello.afternoon'],
                night: lang['sayhello.night'],
                goodnight: lang['sayhello.goodnight'],
                iam: lang['sayhello.iam'],
            },
            search: {
                empty: lang['search.empty'],
                hit: lang['search.hit'],
                placeholder: lang['search.placeholder'],
            }
        },
        localsearch: {
            preload: theme.thirdparty.search.local_search.preload,
            path: theme.thirdparty.search.local_search.path || '/search.xml'
        },    
        algolia: {
            appId: config.algolia.appId,
            apiKey: config.algolia.apiKey,
            indexName: config.algolia.indexName
        },
        covercolor: theme.post.covercolor
    }
    const exportPageConfig = {
        is_home: this.is_home(),
        is_post: this.is_post(),
        is_page: this.is_page(),
        page: this.is_page() && (this.page.type || 'default'),
        toc: this.page.toc,
        comment: this.page.comment,
    }
    return `<script>var GLOBALCONFIG = ${JSON.stringify(exportGlobalConfig)};</script><script id="site-config">var PAGECONFIG = ${JSON.stringify(exportPageConfig)};</script>`;
})