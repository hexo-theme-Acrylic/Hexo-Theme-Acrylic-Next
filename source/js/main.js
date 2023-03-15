function setFixed(el) {
    if(!el)return
    const currentTop = window.scrollY || document.documentElement.scrollTop
    if (currentTop > 0) {
        el.classList.add('nav-fixed')
    } else {
        el.classList.remove('nav-fixed')
    }
}

const scrollFn = function () {
    const innerHeight = window.innerHeight + 0
    const $header = document.getElementById('page-header')
    setFixed($header)
    if (document.body.scrollHeight <= innerHeight) {
        return
    }
    let initTop = 0
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

    if(!$toggleMenu)return

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

const chageTimeFormate = () => {
    var timeElements = document.getElementsByTagName("time")
    for (var i = 0; i < timeElements.length; i++) {
        var datetime = timeElements[i].getAttribute("datetime")
        var timeObj = new Date(datetime)
        var daysDiff = utils.timeDiff(timeObj, new Date())
        var timeString;
        if (daysDiff === 0) {
            timeString = "最近";
        } else if (daysDiff === 1) {
            timeString = "昨天";
        } else if (daysDiff === 2) {
            timeString = "前天";
        } else if (daysDiff <= 7) {
            timeString = daysDiff + "天前";
        } else {
            if (timeObj.getFullYear() !== new Date().getFullYear()) {
                timeString = timeObj.getFullYear() + "/" + (timeObj.getMonth() + 1) + "/" + timeObj.getDate();
            } else {
                timeString = (timeObj.getMonth() + 1) + "/" + timeObj.getDate();
            }
        }
        timeElements[i].textContent = timeString;
    }
}

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
        if (!el)return
        el.forEach((e) => {
            e.addEventListener('click', (event) => {
                event.preventDefault()
                utils.scrollToDest(utils.getEleTop(document.getElementById(decodeURI((event.target.className === 'toc-text' ? event.target.parentNode.hash: event.target.hash).replace('#', '')))), 300)
            })
        })
        this.active(el)
    }

    static active(toc) {
        const $article = document.getElementById('article-container')
        const $tocContent = document.getElementById('toc-content')
        const list = $article.querySelectorAll('h1,h2,h3,h4,h5,h6')
        let detectItem = ''
        function autoScroll(el){
            const activePosition = el.getBoundingClientRect().top
            const sidebarScrollTop = $tocContent.scrollTop
            if (activePosition > (document.documentElement.clientHeight - 100)) {
              $tocContent.scrollTop = sidebarScrollTop + 150
            }
            if (activePosition < 100) {
              $tocContent.scrollTop = sidebarScrollTop - 150
            }
        }
        function findHeadPosition(top) {
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
            const activeitem = toc[detectItem]
            if (activeitem) {
                let parent = toc[detectItem].parentNode
                activeitem.classList.add('active')
                autoScroll(activeitem)
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
        utils.scrollToDest(0)
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
        if(nowMode){
            document.documentElement.setAttribute('data-theme', nowMode)
        }
    }
    static reflashEssayWaterFall() {
        if (document.getElementById('waterfall')) {
            setTimeout(function () {
                waterfall('#waterfall');
                document.getElementById("waterfall").classList.add('show');
            }, 500);
        }
    }
    static addRuntime() {
        const $runtimeCount = document.getElementById('runtimeshow')
        if ($runtimeCount) {
          const runtime = $runtimeCount.getAttribute('data-runtime')
          $runtimeCount.innerText = utils.timeDiff(new Date(runtime), new Date()) + ' 天'
          console.log(new Date(runtime), new Date())
        }
      }
}

const allPage = () => {
    scrollFn()
    sidebarFn()
    if (typeof randomLinksList === 'function') {
        randomLinksList();
    }
    setTimeState()
    chageTimeFormate()
    acrylic.initTheme()
    acrylic.addRuntime()
}

const onlyHome = () => {
    if (GOBALPAGE === 'home') {
        showTodayCard()
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
        acrylic.reflashEssayWaterFall()
    }
}

window.addEventListener('resize', utils.throttle(function () {
    if (document.getElementById('waterfall')) {
        acrylic.reflashEssayWaterFall();
    }
}), 500);

window.addEventListener('DOMContentLoaded', () => {
    allPage()
    onlyHome()
    onlyPost()
    onlyPostandPage()
})

document.addEventListener('pjax:complete',() => {
    allPage()
    onlyHome()
    onlyPost()
    onlyPostandPage()
})
