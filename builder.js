var fs = require('fs'),
    https = require('https'),
    handlebars = require('./handlebars'),
    _ = require('./underscore'),
    config_file = 'config.json',
    flickr_api_key = getFileContent('flickr.key').substr(0, 32);

function getFileContent(filePath) {
    return fs.readFileSync(filePath,'utf8')
}

function compileFile(filePath) {
    return handlebars.compile(getFileContent(filePath));
}

function getFlickrInfo(data, imageID, callback) {
    https.get({
        host: 'api.flickr.com',
        path: '/services/rest/?method=flickr.photos.getInfo&api_key=' + flickr_api_key + '&photo_id=' + imageID + '&format=json&nojsoncallback=1'
    }, function(response) {
        var str = '';

        response.on('data', function(chunk) {
            str += chunk;
        })

        response.on('end', function() {
            var flickrOwner = JSON.parse(str);

            https.get({
                host: 'api.flickr.com',
                path: '/services/rest/?method=flickr.photos.getSizes&api_key=' + flickr_api_key + '&photo_id=' + imageID + '&format=json&nojsoncallback=1'
            }, function(response) {
                var str = '';

                response.on('data', function(chunk) {
                    str += chunk;
                })

                response.on('end', function() {
                    var flickrURL = JSON.parse(str);

                    callback({
                        owner: flickrOwner.photo.owner.realname,
                        user: flickrOwner.photo.owner.username,
                        page: flickrOwner.photo.urls.url[0]._content,
                        url: flickrURL.sizes.size.pop().source
                    });
                })
            }).end();
        })
    }).end();

}

function createStaticFile(filePath, base, data, body) {
    if (body) {
        data['body'] = body;
    } else {
        data['body'] = getFileContent('template/' + filePath);        
    }

    fs.writeFileSync('public_html/' + filePath, base(data));
}

function createBlogPost(post, blogBase, base, data) {
    var filePath = post.entry;

    getFlickrInfo(data, post.imageID, function(image) {
        var body = blogBase(_.extend(post, { 
            entry: getFileContent('template/' + 'blog/' + post.entry),
            image: image
        }));
        createStaticFile('blog/' + filePath, base, data, body);
    });
    
}

function getDefaultData(depth) {
    return {
        name: "Saquib Hafiz",
        description: "my opinion, my code, my life",
        depth: (depth ? depth : "")
    };
}

function compiledParts() {
    return {
        header: compileFile('template/header.html'),
        navbar: compileFile('template/navbar.html'),
        footer: compileFile('template/footer.html'),
        jsscripts: compileFile('template/jsscripts.html'),
        base: compileFile('template/base.html'),
        blogBase: compileFile('template/blog/base.html')
    }
}

function updateData(data, parts) {
    data['header'] = parts['header'](data);
    data['navbar'] = parts['navbar'](data);
    data['footer'] = parts['footer'](data);
    data['jsscripts'] = parts['jsscripts'](data);
}

function getPostsObject() {
    return JSON.parse(getFileContent('template/blog/posts.json'));
}

function compileAll() {
    var posts = getPostsObject(),
        data = getDefaultData(),
        parts = compiledParts();

    updateData(data, parts)

    createStaticFile('index.html', parts.base, data);
    createStaticFile('about.html', parts.base, data);
    createStaticFile('archive.html', parts.base, data);
    createStaticFile('contact.html', parts.base, data);

    data['depth'] = "../";
    updateData(data, parts);

    for (var i in posts) {
        createBlogPost(posts[i], parts.blogBase, parts.base, data);
    }
}

if (process.argv.length >= 3) {
    var posts = getPostsObject(),
        data = getDefaultData("../"),
        parts = compiledParts();

    updateData(data, parts);

    createBlogPost(posts[parseInt(process.argv[2])], parts.blogBase, parts.base, data);
} else {
    compileAll();
}

