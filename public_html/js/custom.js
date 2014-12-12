function createPosts(template, beg, numOfPostsPerPage) {
    $("#post-previews").html('');
    var limit = numOfPostsPerPage > 0 ? Math.min(beg + numOfPostsPerPage, posts.length) : posts.length;

    for (var i = beg; i < limit; i++) {
        $("#post-previews").append(template(posts[i]));
    }

    if (numOfPostsPerPage > 0) {
        reassureButtonStates(beg, beg + numOfPostsPerPage);
    }
}

function reassureButtonStates(beg, numOfPostsPerPage) {
    if (beg == 0) {
        $('#newer').addClass('disabled');
    } else {
        $('#newer').removeClass('disabled');
    }

    if (Math.floor(beg/numOfPostsPerPage) == Math.floor(posts.length/numOfPostsPerPage)) {
        $('#older').addClass('disabled');
    } else {
        $('#older').removeClass('disabled');
    }
}

if ($("#post-previews").length != 0) {
    var source   = $("#post-preview-template").html(),
        template = Handlebars.compile(source),
        current = 0,
        numOfPostsPerPage = 3;

    createPosts(template, current, numOfPostsPerPage);

    $('#older').on('click', function() {
        if(!$(this).hasClass('disabled')) {
            current += numOfPostsPerPage;
            createPosts(template, current, numOfPostsPerPage);
        }
    });

    $('#newer').on('click', function() {
        if(!$(this).hasClass('disabled')) {
            current -= numOfPostsPerPage;
            createPosts(template, current, numOfPostsPerPage);
        }
    });
}

if ($("#blog-table").length != 0) {
    console.log($("#blog-table"));
    var source   = $("#post-preview-template").html(),
        template = Handlebars.compile(source),
        current = 0,
        numOfPostsPerPage = -1;

    createPosts(template, current, numOfPostsPerPage);
}