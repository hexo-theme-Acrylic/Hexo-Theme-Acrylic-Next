/**
{% msgbox %}
{% msgguest name,avatar %}
对话内容
{% endmsgguest %}
{% msgadmin name,avatar %}
对话内容
{% endmsgadmin %}
{% endmsgbox %}
*/

'use strict'

const urlFor = require('hexo-util').url_for.bind(hexo)

function msgbox (args, content) {
  return `<div class="msgbox">${hexo.render.renderSync({ text: content, engine: 'markdown' }).split('\n').join('')}
          </div>`
}

function msgguest (args, content) {
  args = args.join(' ').split(',')
  let guestname = args[0]?args[0].trim():'noname' //默认无名
  let guestavatar = args[1]?args[1].trim():hexo.theme.config.error_img.flink //默认友链错误头像

  return `<div class="msgguest msg-main"><div class="msg-avatar-box"><img class="msg-avatar no-lightbox" title="${guestname}" src="${guestavatar}"/></div><div class="msg-content"><div class="msg-name">${guestname}</div><div class="msg-content-text">${hexo.render.renderSync({ text: content, engine: 'markdown' }).split('\n').join('')}</div></div></div>`
}
function msgadmin (args, content) {
  args = args.join(' ').split(',')
  let adminname = args[0]?args[0].trim():hexo.config.author //默认作者
  let adminavatar = args[1]?args[1].trim():hexo.theme.config.avatar.img //默认作者头像

  return `<div class="msgadmin msg-main"><div class="msg-avatar-box"><img class="msg-avatar no-lightbox" title="${adminname}" src="${adminavatar}"/></div><div class="msg-content"><div class="msg-name">${adminname}</div><div class="msg-content-text">${hexo.render.renderSync({ text: content, engine: 'markdown' }).split('\n').join('')}</div></div></div>`
}


hexo.extend.tag.register('msgbox', msgbox, { ends: true })
hexo.extend.tag.register('msgguest', msgguest, { ends: true })
hexo.extend.tag.register('msgadmin', msgadmin, { ends: true })