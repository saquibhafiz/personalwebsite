var fs = require('fs'),
    path = require('path'),
    handlebars = require('./handlebars'),
    _ = require('./underscore'),
    config_file = 'config.json';

function getFileContent(filePath) {
    return fs.readFileSync(filePath,'utf8')
}

function compileFile(filePath) {
    return handlebars.compile(getFileContent(filePath));
}

function createStaticFile(filePath, base, data, body) {
    if (body) {
        data['body'] = body;
    } else {
        data['body'] = getFileContent('template' + path.sep + filePath);        
    }

    fs.writeFileSync('public_html' + path.sep + filePath, base(data));
}

function createBlogPost(post, blogBase, base, data) {
    var filePath = post.entry,
        body = blogBase(_.extend(post, { entry: getFileContent('template' + path.sep + 'blog' + path.sep + post.entry) }));
    createStaticFile('blog' + path.sep + filePath, base, data, body);
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
    createStaticFile('contact.html', parts.base, data);
    createStaticFile('post.html', parts.base, data);

    data['depth'] = "../";
    updateData(data, parts);

    for (var i in posts) {
        var post = posts[i];

        createBlogPost(post, parts.blogBase, parts.base, data);
    }
}

if (process.argv[2] && process.argv[2] == "-p") {
    var posts = getPostsObject(),
        data = getDefaultData("../"),
        parts = compiledParts();

    updateData(data, parts);

    createBlogPost(post, blogBase, base, data);
} else {
    compileAll();
}