let stories = [];

collectTopStories('https://hacker-news.firebaseio.com/v0/topstories.json');

function collectTopStories(url) {
    fetch(url)
        .then(response => response.json().then(data => {
            reduceStories(data, 10).then(data => {
                data.map(data => {
                    stories.push(collectStoryData(data).then(story => {
                        console.log('Story', story);
                        generateStoryComponent(story)
                    }))
                });
            });
        }))
        .catch(e => console.log(e));
}

let reduceStories = (data, storyCount = 10) => {
    let randomTopStories = [];

    return new Promise((resolve, reject) =>  {
        for (let i = 0; i < storyCount; i++) {
            randomTopStories.push(data[ Math.floor(Math.random() * data.length) ]);
        }
        resolve(randomTopStories);
    });
};

collectStoryData = (id) => {
    let story = {};

    return new Promise((resolve, reject) => {
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            .then(response => {
                response.json().then(data => {
                    story.title = data.title;
                    story.url = data.url;
                    story.time = data.time;
                    collectUserData(data.by)
                        .then(data => {
                            story.authorId = data.id;
                            story.authorKarma = data.karma;

                            resolve(story);
                        });
                });
            });
    });
};

collectUserData = author => {
    return new Promise((resolve, reject) => {
        fetch(`https://hacker-news.firebaseio.com/v0/user/${author}.json`)
            .then(response => resolve(response.json()));
    });
};

generateStoryComponent = (story) => {
    $('.container').append(
        `<div class="flex-item">
					<a href='${story.url}'><h4>${story.title}</h4></a>
					<p>Timestamp: ${story.time}</p>
					<p>Score: ${story.score}</p>
					<p>Author Name: ${story.authorId}</p>
					<p>Author Karma: ${story.authorKarma} Karma</p>
			 </div>`)
};
