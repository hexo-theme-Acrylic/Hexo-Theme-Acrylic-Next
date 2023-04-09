/*
{% referto 'id','literature' %}
{% referfrom 'id','literature','url' %}
*/
'use strict'
const urlFor = require('hexo-util').url_for.bind(hexo)

function referto (args) {
  args = args.join(' ').split(',')
  let referid = args[0]
  let literature = args[1]
  return `<span class="hidden-anchor" id="referto_${referid}"></span><sup class="reference"><a href="#referfrom_${referid}">${referid}</a></sup><span class="reference-bubble"><span class="reference-item"><span class="reference-literature">${literature}</span><span class="reference-title">参考资料</span></span></span>`;
}


function referfrom (args) {
  args = args.join(' ').split(',')
  let fromid = args[0]
  let fromliterature = args[1]
  let referurl = args[2] ? urlFor(args[2]) : 'javascript:void'
  return `<div class="reference-source"><span class="hidden-anchor" id="referfrom_${fromid}"></span><a class="reference-anchor" href="#referto_${fromid}">${fromid}<div class="reference-anchor-up fa-solid fa-angles-up"></div></a><a class="reference-link" href="${referurl}">${fromliterature}</a></div>`;

}

hexo.extend.tag.register('referto',referto);
hexo.extend.tag.register('referfrom',referfrom);
