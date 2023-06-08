const changeContent = (content) => {
    if (content === '') return content
  
    content = content.replace(/<img.*?src="(.*?)"?[^\>]+>|<a[^>]+?href=["']?([^"']+)["']?[^>]*>([^<]+)<\/a>|<pre><code>.*?<\/pre>|<[^>]+>/g, (match, img, link, code) => {
      if (img) return '[图片]';
      if (link) return '[链接]';
      if (code) return '[代码]';
      return '';
    })
  
    if (content.length > 150) {
      content = content.substring(0,150) + '...'
    }
    return content
  }
  
  const getComment = () => {
    const $dom = document.querySelector('#card-newest-comments .aside-list')
  
    const runTwikoo = () => {
      twikoo.getRecentComments({
        envId: GLOBALCONFIG.comment.twikooUrl,
        region: '',
        pageSize: 6,
        includeReply: true
      }).then(function (res) {
        const twikooArray = res.map(e => ({
          'content': changeContent(e.comment),
          'avatar': e.avatar,
          'nick': e.nick,
          'url': `${e.url}#${e.id}`,
          'date': new Date(e.created).toISOString()
        }))
  
        generateHtml(twikooArray)
      }).catch(function (err) {
        $dom.innerHTML= "无法获取评论，请确认相关配置是否正确"
      })
    }
        runTwikoo()

  }
  
  const generateHtml = array => {
    const $dom = document.querySelector('#card-newest-comments .aside-list')
  
    let result = array.length ? array.map(item => `
    <div class='aside-list-item'>
      <a href='${item.url}' class='thumbnail'>
        <img src='${item.avatar}' alt='${item.nick}'>
        <div class='name'><span>${item.nick}</span></div>
      </a>
      <div class='content'>
        <a class='comment' href='${item.url}'>${item.content}</a>
        <time class="datetime" datetime="${item.date}"></time>
      </div>
    </div>
  `).join('') : '没有评论'
  
    $dom.innerHTML = result
    window.lazyLoadInstance && window.lazyLoadInstance.update()
    window.pjax && window.pjax.refresh($dom)
    chageTimeFormate()
  }
  
  const newestCommentInit = () => {
    const $asideList = document.querySelector('#card-newest-comments .aside-list')
    if ($asideList) {
      getComment()
    }
  }
  