hexo.extend.generator.register('404', function (locals) {
  return {
    path: '404.html',
    layout: ['404'],
    data: {
      title: '404',
      type: '404',
      comment: false
    }
  }
})

// generate tags Page
hexo.extend.generator.register('tags', function(locals) {
    return {
      path: 'tags/index.html',
      layout: ['page'],
      data: {
        title: '标签',
        type: 'tags',
        comment: false
      }
    };
});

// generate categories Page
hexo.extend.generator.register('categories', function(locals) {
    return {
      path: 'categories/index.html',
      layout: ['page'],
      data: {
        title: '分类',
        type: 'categories',
        comment: false
      }
    };
});