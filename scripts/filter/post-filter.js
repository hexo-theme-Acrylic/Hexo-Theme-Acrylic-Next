'use strict';

const clearHtml = require('hexo-util').stripHTML.bind(hexo)

hexo.extend.filter.register('after_post_render', function(data){
    const config = hexo.theme.config.post.default
    data.title = data.title || '无标题';
    data.locate = data.locate || config.locate
    data.cc = data.cc || config.copyright
    data.cover = data.cover || config.cover
    data.excerpt =  data.description || data.excerpt || clearHtml(data.content).substr(0, config.excerpt).replaceAll(/[\r\n]/g, "");
    return data;
  });