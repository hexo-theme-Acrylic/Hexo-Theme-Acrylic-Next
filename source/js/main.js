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
        const timeNow = new Date(), hours = timeNow.getHours(), lang = GOBALCONFIG.lang.sayhello;
        let text = '';
        if (hours >= 0 && hours <= 5) {
            text = lang.goodnight;
        } else if (hours > 5 && hours <= 10) {
            text = lang.morning;
        } else if (hours > 10 && hours <= 14) {
            text = lang.noon;
        } else if (hours > 14 && hours <= 18) {
            text = lang.afternoon;
        } else if (hours > 18 && hours <= 24) {
            text = lang.night;
        }
        el.innerText = text + lang.iam;
    }
};

const chageTimeFormate = () => {
    const timeElements = document.getElementsByTagName("time"), lang = GOBALCONFIG.lang.time
    for (var i = 0; i < timeElements.length; i++) {
        const datetime = timeElements[i].getAttribute("datetime"), timeObj = new Date(datetime), daysDiff = utils.timeDiff(timeObj, new Date())
        var timeString;
        if (daysDiff === 0) {
            timeString = lang.recent;
        } else if (daysDiff === 1) {
            timeString = lang.yesterday;
        } else if (daysDiff === 2) {
            timeString = lang.berforeyesterday;
        } else if (daysDiff <= 7) {
            timeString = daysDiff + lang.daybefore;
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
        btn.innerHTML = GOBALCONFIG.lang.backtop;
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
            utils.snackbarShow(GOBALCONFIG.lang.theme.dark, false, 2000)
        } else {
            document.documentElement.setAttribute('data-theme', 'light')
            localStorage.setItem('theme', 'light')
            utils.snackbarShow(GOBALCONFIG.lang.theme.light, false, 2000)
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
            utils.snackbarShow(GOBALCONFIG.lang.copy.success, false, 2000)
        } catch (err) {
            utils.snackbarShow(GOBALCONFIG.lang.copy.error, false, 2000)
        }
    }
    static lightbox(el) {
        window.ViewImage && ViewImage.init(el);
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
          $runtimeCount.innerText = utils.timeDiff(new Date(runtime), new Date()) + GOBALCONFIG.lang.time.runtime
          console.log(new Date(runtime), new Date())
        }
    }
    static lazyloadImg(){
        window.lazyLoadInstance = new LazyLoad({
          elements_selector: 'img',
          threshold: 0,
          data_src: 'lazy-src',
          callback_error: (img) => {
            img.setAttribute("src", GOBALCONFIG.lazyload.error);
          }
        })
      }
    static initbbtalk(){
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



function coverColor() {
    var path = document.getElementById("post-cover")?.src;
    if (path !== undefined) {
      var httpRequest = new XMLHttpRequest();
      httpRequest.open('GET', path + '?imageAve', true); 
      httpRequest.send(); 
      httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
          var json = httpRequest.responseText; 
          var obj = eval('(' + json + ')');
          var value = obj.RGB;
          value = "#" + value.slice(2)
          if (getContrastYIQ(value) == "light") {
            value = LightenDarkenColor(colorHex(value), -50)
          }
  
          document.documentElement.style.setProperty('--heo-main', value);
          document.documentElement.style.setProperty('--heo-main-op', value + '23');
          document.documentElement.style.setProperty('--heo-main-op-deep', value + 'dd');
          document.documentElement.style.setProperty('--heo-main-none', value + '00');
          utils.initThemeColor()
          document.getElementById("coverdiv").classList.add("loaded");
        }
      };
    } else {
      document.documentElement.style.setProperty('--heo-main', 'var(--heo-theme)');
      document.documentElement.style.setProperty('--heo-main-op', 'var(--heo-theme-op)');
      document.documentElement.style.setProperty('--heo-main-op-deep', 'var(--heo-theme-op-deep)');
      document.documentElement.style.setProperty('--heo-main-none', 'var(--heo-theme-none)');
      utils.initThemeColor()
    }
  }
  


function colorHex(colorString) {
    const hexRegex = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    let color = colorString;
  
    if (/^(rgb|RGB)/.test(color)) {
      const colorArr = color.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
      const hexArr = colorArr.map(c => {
        const hex = Number(c).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      });
      return "#" + hexArr.join("");
    } else if (hexRegex.test(color)) {
      const hexDigits = color.replace(/#/, "").split("");
      if (hexDigits.length === 6) {
        return color;
      } else if (hexDigits.length === 3) {
        const hexArr = hexDigits.map(c => c + c);
        return "#" + hexArr.join("");
      }
    }
    return color;
  }
  
  

function colorRgb(str) {
    const HEX_SHORT_REGEX = /^#([0-9a-fA-f]{3})$/;
    const HEX_LONG_REGEX = /^#([0-9a-fA-f]{6})$/;
    const HEX_SHORT_LENGTH = 4;
  
    const sColor = str.toLowerCase();
    let hexValue = "";
  
    if (sColor && (HEX_SHORT_REGEX.test(sColor) || HEX_LONG_REGEX.test(sColor))) {
      hexValue = sColor.length === HEX_SHORT_LENGTH ?
        sColor.replace(/^#(.)/g, "#$1$1") :
        sColor;
  
      const rgbValue = hexValue.slice(1)
        .match(/.{2}/g)
        .map(val => parseInt(val, 16))
        .join(",");
  
      return `rgb(${rgbValue})`;
    } else {
      return sColor;
    }
  }
  

function LightenDarkenColor(col, amt) {
    let usePound = false;
  
    if (col[0] === "#") {
      col = col.slice(1);
      usePound = true;
    }
  
    const num = parseInt(col, 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amt));
    const b = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amt));
    const g = Math.min(255, Math.max(0, (num & 0xff) + amt));
  
    return `${usePound ? "#" : ""}${(g | (b << 8) | (r << 16)).toString(16).padStart(6, "0")}`;
  }
  

function getContrastYIQ(hexcolor) {
    var colorrgb = colorRgb(hexcolor);
    var colors = colorrgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    var red = colors[1];
    var green = colors[2];
    var blue = colors[3];
    var brightness;
    brightness = (red * 299) + (green * 587) + (blue * 114);
    brightness = brightness / 255000;
    if (brightness >= 0.5) {
      return "light";
    } else {
      return "dark";
    }
  }
  

window.refreshFn = () => {
    scrollFn()
    sidebarFn()
    setTimeState()
    chageTimeFormate()
    acrylic.addRuntime()
    GOBALCONFIG.lazyload.enable && acrylic.lazyloadImg()
    GOBALCONFIG.lightbox && acrylic.lightbox('#article-container img, #bber .bber-content-img img')
    GOBALCONFIG.randomlinks && randomLinksList()
    PAGECONFIG.toc && toc.init()
    PAGECONFIG.comment && initComment()
    if(PAGECONFIG.is_home){
        showTodayCard()
        acrylic.initbbtalk()
    }
    if(PAGECONFIG.is_page && PAGECONFIG.page === 'says')acrylic.reflashEssayWaterFall()
    GOBALCONFIG.lang.covercolor && coverColor()
}

acrylic.initTheme()
document.addEventListener('DOMContentLoaded', function () {
    refreshFn()
})

document.addEventListener('pjax:complete', () => { 
    window.refreshFn()
})