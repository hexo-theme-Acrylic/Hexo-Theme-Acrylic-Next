const $searchMask = document.getElementById('search-mask'), 
$searchDialog = document.querySelector('#local-search .search-dialog'),
$input = document.querySelector('#search-input'),
$resultContent = document.getElementById('search-results'),
$loadingStatus = document.getElementById('loading-status')
let dataObj = null

class search{
  static openSearch(){
    utils.fadeIn($searchMask, '0.5')
    utils.fadeIn($searchDialog, '0.5')
    setTimeout(() => { document.querySelector('#search-input').focus() }, 100)
    search.search()
    document.addEventListener('keydown', function f (event) {
      if (event.code === 'Escape') {
        closeSearch()
        document.removeEventListener('keydown', f)
      }
    })
  }

  static closeSearch(){
    utils.fadeOut($searchDialog, '0.5')
    utils.fadeOut($searchMask, '0.5')
  }

  static async fetchData(path){
    let data = []
    const response = await fetch(path)
    const res = await new window.DOMParser().parseFromString(await response.text(), 'text/xml')
    data = [...res.querySelectorAll('entry')].map(item => {
      return {
        title: item.querySelector('title').textContent,
        content: item.querySelector('content') && item.querySelector('content').textContent,
        url: item.querySelector('url').textContent
      }
    })
    if (response.ok) {
      const $loadDataItem = document.getElementById('loading-database')
      $loadDataItem.nextElementSibling.style.display = 'block'
      $loadDataItem.remove()
    }
    return data
  }

  static search(){
    if (!GOBALCONFIG.localsearch.preload && dataObj === null) dataObj = this.fetchData(GOBALCONFIG.localsearch.path)
    $input.addEventListener('input', function type() {
      const keywords = this.value.trim().toLowerCase().split(/[\s]+/)
      if (keywords[0] !== '') $loadingStatus.innerHTML = '<i class="fas fa-spinner fa-pulse"></i><span>加载中</span>'
      else {
        $resultContent.innerHTML = ''
        return
      }

      if (keywords.length <= 0) return
      let count = 0, str = '<div class="search-result-list">'
      // perform local searching
      dataObj.then(data => {
        data.forEach(data => {
          let isMatch = true
          let dataTitle = data.title ? data.title.trim().toLowerCase() : ''
          const dataContent = data.content ? data.content.trim().replace(/<[^>]+>/g, '').toLowerCase() : ''
          const dataUrl = data.url.startsWith('/') ? data.url : GOBALCONFIG.root + data.url
          let indexTitle = -1
          let indexContent = -1
          let firstOccur = -1
          // only match articles with not empty titles and contents
          if (dataTitle !== '' || dataContent !== '') {
            keywords.forEach((keyword, i) => {
              indexTitle = dataTitle.indexOf(keyword)
              indexContent = dataContent.indexOf(keyword)
              if (indexTitle < 0 && indexContent < 0) {
                isMatch = false
              } else {
                if (indexContent < 0) {
                  indexContent = 0
                }
                if (i === 0) {
                  firstOccur = indexContent
                }
              }
            })
          } else {
            isMatch = false
          }

          // show search results
          if (isMatch) {
            if (firstOccur >= 0) {
              // cut out 130 characters
              let start = firstOccur - 30
              let end = firstOccur + 100
              let pre = ''
              let post = ''

              if (start < 0) {
                start = 0
              }

              if (start === 0) {
                end = 100
              } else {
                pre = '...'
              }

              if (end > dataContent.length) {
                end = dataContent.length
              } else {
                post = '...'
              }

              let matchContent = dataContent.substring(start, end)

              // highlight all keywords
              keywords.forEach(keyword => {
                matchContent = matchContent.replaceAll(keyword, '<span class="search-keyword">' + keyword + '</span>')
                dataTitle = dataTitle.replaceAll(keyword, '<span class="search-keyword">' + keyword + '</span>')
              })

              str += '<div class="search__hit-item"><a href="' + dataUrl + '"><span class="search-result-title">' + dataTitle + '</span>'
              count += 1

              if (dataContent !== '') {
                str += '<p class="search-result">' + pre + matchContent + post + '</p>'
              }
            }
            str += '</a></div>'
          }
        })
        if (count === 0) {
          str += '<div id="search__hits-empty">' + '搜索为空' +
            '</div>'
        }
        str += '</div>'
        $resultContent.innerHTML = str
        if (keywords[0] !== '') $loadingStatus.innerHTML = ''
      })
    })
  }
}

const searchClickFn = () => {
  document.querySelector('#search-button > .search').addEventListener('click', search.openSearch)
}

const searchClickFnOnce = () => {
  document.querySelector('#local-search .search-close-button').addEventListener('click', search.closeSearch)
  $searchMask.addEventListener('click', search.closeSearch)
  if (GOBALCONFIG.localsearch.preload) dataObj = search.fetchData(GOBALCONFIG.localsearch.path)
}

window.addEventListener('load', () => {
  searchClickFn()
  searchClickFnOnce()
})

window.addEventListener('pjax:complete', () => {
  searchClickFn()
})