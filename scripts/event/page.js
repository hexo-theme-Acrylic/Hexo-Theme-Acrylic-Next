hexo.extend.generator.register('404', function (locals) {
  return {
    path: '404.html',
    layout: ['404'],
    data: {
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
        type: 'categories',
        comment: false
      }
    };
});
