function createPosts(template, beg, numOfPostsPerPage) {
	$("#post-previews").html('');

	for (var i = beg; i < Math.min(beg + numOfPostsPerPage, posts.length); i++) {
		$("#post-previews").append(template(posts[i]));
	}

	reassureButtonStates(beg, beg + numOfPostsPerPage);
}

function reassureButtonStates(beg, numOfPostsPerPage) {
	if (beg == 0) {
		$('#newer').addClass('disbaled');
	} else {
		$('#newer').removeClass('disbaled');
	}

	if (Math.floor(beg/numOfPostsPerPage) == Math.floor(posts.length/numOfPostsPerPage)) {
		$('#older').addClass('disbaled');
	} else {
		$('#older').removeClass('disbaled');
	}
}

if ($("#post-previews")) {
	var source   = $("#post-preview-template").html(),
		template = Handlebars.compile(source),
		current = 0,
		numOfPostsPerPage = 3;

	createPosts(template, current, numOfPostsPerPage);

	$('#older').on('click', function() {
		if(!$(this).hasClass('disbaled')) {
			current += numOfPostsPerPage;
			createPosts(template, current, numOfPostsPerPage);
		}
	});

	$('#newer').on('click', function() {
		if(!$(this).hasClass('disbaled')) {
			current -= numOfPostsPerPage;
			createPosts(template, current, numOfPostsPerPage);
		}
	});
}