'use strict';
function postprogress(args) {
  args = args.join(',').split(',')
  if (args.length > 1) {
    let pwidth = args[0].trim()
    let pcolor = args[1].trim()
    let text = args[2].trim()
    return `<div class="progress"><div class="progress-bar-animated progress-bar progress-bar-striped bg-${pcolor}"  style="width: ${pwidth}%" aria-valuenow="${pwidth}" aria-valuemin="0" aria-valuemax="100">${hexo.render.renderSync({text: text, engine: 'markdown'}).split('\n').join('')}</div></div>`;
  }
}
hexo.extend.tag.register('progress', postprogress);
