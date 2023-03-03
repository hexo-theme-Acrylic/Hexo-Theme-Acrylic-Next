const scrollFn = function () {
    const innerHeight = window.innerHeight + 0
    // 当页面不可滚动时跳出函数
    if (document.body.scrollHeight <= innerHeight) {
        return
    }
    let initTop = 0
    const $header = document.getElementById('page-header')
    window.addEventListener('scroll', utils.throttle(function (e) {
        const currentTop = window.scrollY || document.documentElement.scrollTop
        const isDown = scrollDirection(currentTop)
        if (currentTop > 0) {
            if (isDown) {
                if ($header.classList.contains('nav-visible')) $header.classList.remove(
                    'nav-visible')
            } else {
                if (!$header.classList.contains('nav-visible')) $header.classList.add(
                    'nav-visible')
            }
            $header.classList.add('nav-fixed')
        } else {
            if (currentTop === 0) {
                $header.classList.remove('nav-fixed', 'nav-visible')
            }
        }
        percent()
    }, 200))
    // find the scroll direction
    function scrollDirection(currentTop) {
        const result = currentTop > initTop
        initTop = currentTop
        return result
    }
}

const sidebarFn = () => {
    const $toggleMenu = document.getElementById('toggle-menu')
    const $mobileSidebarMenus = document.getElementById('sidebar-menus')
    const $menuMask = document.getElementById('menu-mask')
    const $body = document.body

    function openMobileSidebar() {
        utils.sidebarPaddingR()
        $body.style.overflow = 'hidden'
        utils.fadeIn($menuMask, 0.5)
        $mobileSidebarMenus.classList.add('open')
    }

    function closeMobileSidebar() {
        $body.style.overflow = ''
        $body.style.paddingRight = ''
        utils.fadeOut($menuMask, 0.5)
        $mobileSidebarMenus.classList.remove('open')
    }

    $toggleMenu.addEventListener('click', openMobileSidebar)

    $menuMask.addEventListener('click', e => {
        if ($mobileSidebarMenus.classList.contains('open')) {
            closeMobileSidebar()
        }
    })

    window.addEventListener('resize', e => {
        if ($mobileSidebarMenus.classList.contains('open')) closeMobileSidebar()
    })
}

const showTodayCard = () => {
    const el = document.getElementById('todayCard')
    if (el) {
        document.getElementsByClassName('topGroup')[0].addEventListener('mouseleave', () => {
            if (el.classList.contains('hide')) {
                el.classList.remove('hide')
            }
        })
    }
}

const setTimeState = () => {
    const el = document.getElementById('author-info__sayhi')
    if (el) {
        const timeNow = new Date();
        const hours = timeNow.getHours();
        let text = '';
        if (hours >= 0 && hours <= 5) {
            text = '晚安';
        } else if (hours > 5 && hours <= 10) {
            text = '早上好';
        } else if (hours > 10 && hours <= 14) {
            text = '中午好';
        } else if (hours > 14 && hours <= 18) {
            text = '下午好';
        } else if (hours > 18 && hours <= 24) {
            text = '晚上好';
        }
        el.innerText = text + ' !  我是'
    }
};

const percent = () => {
    let a = document.documentElement.scrollTop || window.pageYOffset,
        b = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight) - document.documentElement.clientHeight, // 整个网页高度
        result = Math.round(a / b * 100),
        btn = document.querySelector("#percent");
    const visibleBottom = window.scrollY + document.documentElement.clientHeight;
    const eventlistner = document.getElementById('post-tools') || document.getElementById('footer');
    const centerY = eventlistner.offsetTop + (eventlistner.offsetHeight / 2);
    if ((centerY < visibleBottom) || (result > 90)) {
        document.querySelector("#nav-totop").classList.add("long");
        btn.innerHTML = "返回顶部";
    } else {
        document.querySelector("#nav-totop").classList.remove("long");
        if (result >= 0) {
            btn.innerHTML = result;
        }
    }
}

class toc {
    static init() {
        const el = document.querySelectorAll('.toc a')
        if (!el) {
            return
        }
        el.forEach((e) => {
            e.addEventListener('click', (event) => {
                event.preventDefault()
                this.getAnchor(event.target.innerText.replaceAll(' ', '-'))
            })
        })
        this.active(el)
    }
    static scrollToAnchor(x, y) {
        scrollTo({
            top: y,
            left: x,
            behavior: 'smooth'
        })
    }
    static getAnchor(id) {
        const el = document.getElementById(id)
        this.scrollToAnchor(el.getBoundingClientRect().left, el.getBoundingClientRect().top + (window.scrollY ? window.scrollY : 0) - 60)
    }
    static active(toc) {
        const $article = document.getElementById('article-container')
        const list = $article.querySelectorAll('h1,h2,h3,h4,h5,h6')
        let detectItem = ''
        const findHeadPosition = function (top) {
            if (top === 0) {
                return false
            }

            let currentIndex = ''

            list.forEach(function (ele, index) {
                if (top > utils.getEleTop(ele) - 80) {
                    currentIndex = index
                }
            })

            if (detectItem === currentIndex) return
            detectItem = currentIndex
            document.querySelectorAll('.active').forEach((i) => {
                i.classList.remove('active')
            })
            if (toc[detectItem]) {
                let parent = toc[detectItem].parentNode
                toc[detectItem].classList.add('active')
                for (; !parent.matches('.toc'); parent = parent.parentNode) {
                    if (parent.matches('li')) parent.classList.add('active')
                }
            }
        }
        window.tocScrollFn = utils.throttle(function () {
            const currentTop = window.scrollY || document.documentElement.scrollTop
            findHeadPosition(currentTop)
        }, 100)

        window.addEventListener('scroll', tocScrollFn)
    }
}

class acrylic {
    static switchDarkMode() {
        const nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' :
            'light'
        if (nowMode === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark')
            localStorage.setItem('theme', 'dark')
            utils.snackbarShow('已切换至深色模式', false, 2000)
        } else {
            document.documentElement.setAttribute('data-theme', 'light')
            localStorage.setItem('theme', 'light')
            utils.snackbarShow('已切换至浅色模式', false, 2000)
        }
    }
    static hideTodayCard() {
        document.getElementById('todayCard').classList.add('hide')
    }
    static toTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }
    static showConsole() {
        const el = document.getElementById('console')
        if (!el.classList.contains('show')) {
            el.classList.add('show')
        }
    }
    static hideConsole() {
        const el = document.getElementById('console')
        if (el.classList.contains('show')) {
            el.classList.remove('show')
        }
    }
    static async copyPageUrl() {
        try {
            await navigator.clipboard.writeText(window.location.href)
            utils.snackbarShow('已将页面链接复制至剪贴板', false, 2000)
        } catch (err) {
            utils.snackbarShow('无法将页面链接复制至剪贴板 : ' + err, false, 2000)
        }
    }
    static lightbox() {
        window.ViewImage && ViewImage.init('#article-container img, #bber .bber-content-img img');
    }
    static initTheme() {
        const nowMode = localStorage.getItem('theme')
        if (nowMode === 'dark') document.documentElement.setAttribute('data-theme', 'dark')
        if (nowMode === 'light') document.documentElement.setAttribute('data-theme', 'light')
    }
    static reflashEssayWaterFall() {
        if (document.getElementById('waterfall')) {
            setTimeout(function(){
                waterfall('#waterfall');
                document.getElementById("waterfall").classList.add('show'); 
            },500);
        }
    }
}

const onlyHome = () => {
    if (GOBALPAGE === 'home') {
        showTodayCard()
        if (typeof randomLinksList === 'function') {
            randomLinksList();
        }
        if (document.querySelector('#bber-talk')) {
            var swiper = new Swiper('.swiper-container', {
              direction: 'vertical',
              loop: true,
              autoplay: {
              delay: 3000,
              pauseOnMouseEnter: true
            },
            });
        }
    }
}

const onlyPost = () => {
    if (GOBALPAGE === 'post') {
        toc.init()
    }
}

const onlyPostandPage = () => {
    if (GOBALPAGE === 'post' || GOBALPAGE === 'page') {
        acrylic.lightbox()
        if (typeof initComment === 'function') {
            initComment();
        }
    }
    acrylic.reflashEssayWaterFall()
}

window.addEventListener('resize', utils.throttle(function () {
    if (document.getElementById('waterfall')) {
        acrylic.reflashEssayWaterFall();
    }
}), 500);

window.addEventListener('DOMContentLoaded', () => {
    sidebarFn()
    scrollFn()
    onlyHome()
    onlyPost()
    onlyPostandPage()
    setTimeState()
    acrylic.initTheme()
})

document.addEventListener('pjax:complete', function () {
    sidebarFn()
    scrollFn()
    onlyHome()
    onlyPost()
    onlyPostandPage()
    setTimeState()
})
