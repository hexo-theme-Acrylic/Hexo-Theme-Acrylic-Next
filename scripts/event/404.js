hexo.extend.generator.register('404', function (locals) {
    return {
      path: '404.html',
      layout: ['404'],
      data: {
        type: '404',
      }
    }
  })