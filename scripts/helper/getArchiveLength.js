const moment = require('moment')

hexo.extend.helper.register('getArchiveLength', function () {
    const posts = this.site.posts.sort('-date').data
    let year = {}
    posts.forEach(post => {
        const postdate = moment(post.date).year()
        if(!year[postdate]){
            year[postdate] = 1
        } else {
            year[postdate] ++
        }
    });
    return year
})