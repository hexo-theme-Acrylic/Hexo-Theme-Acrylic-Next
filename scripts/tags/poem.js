// 'use strict'
//
// function poem (args, content) {
//   return `<div class="poem">${content}</div>`
// }
//
// hexo.extend.tag.register('poem', poem, { ends: true })

'use strict'

function poem (args, content) {
  args = args.join(' ').split(',')
  let p0 = args[0]
  let p1 = args[1]?args[1]:''
  return `<div class='poem'><div class='poem-title'>${p0}</div><div class='poem-author'>${p1}</div>${hexo.render.renderSync({ text: content, engine: 'markdown' })}</div>`
}

hexo.extend.tag.register('poem',poem,{ ends: true });
