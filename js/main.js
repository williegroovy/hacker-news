let storyCount = 12;

collectTopStories(storyCount)
    .then(storyArray => storyArray.map(data => {
        //Curry functions for api call chain.
        promiseSeries([(() => Promise.resolve(data)), collectStoryData,  collectUserData]).then(story => generateStoryComponent(story));
    }));


function collectTopStories(storyNum = 10) {
    return new Promise((resolve, reject) => {
        fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
            .then(response => response.json())
            .then(data => resolve(reduceStories(data, storyNum)))
            .catch(e => console.log(e))
    })
}

function collectStoryData(id) {
    return new Promise((resolve, reject) => {
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            .then(response => resolve(response.json()))
            .catch(e => console.log(e));
    });
}

function collectUserData(storyData) {
    return new Promise((resolve, reject) => {
        fetch(`https://hacker-news.firebaseio.com/v0/user/${storyData.by}.json`)
            .then(response => response.json())
            .then(authorData => resolve(buildStoryObj(storyData, authorData)))
            .catch(e => console.log(e))
    })
}

let reduceStories = (data, storyNum) => {
    let randomTopStories = [];
    return new Promise((resolve, reject) =>  {
        for (let i = 0; i < storyNum; i++) {
            randomTopStories.push(data[ Math.floor(Math.random() * data.length) ]);
        }
        return resolve(randomTopStories);
    });
};

let generateStoryComponent = story => {
    let date = new Date(story.time*1000).toLocaleDateString();

    $('.container').append(
        `<div class='flex-box'>
            <div class='card mdl-card mdl-shadow--2dp'>
                <div class='mdl-card__title mdl-card--expand'>
                    <h2 class='mdl-card__title-text'>${story.title}</h2>
                </div>
                <div class='mdl-card__supporting-text'>
                    <ul class='story-list-icon mdl-list'>
                        <li class='mdl-list__item'>
                            <span class='mdl-list__item-primary-content'>
                                <i class='material-icons mdl-list__item-icon'>account_circle</i>
                                ${story.authorId}
                            </span>
                            <span class='mdl-list__item-primary-content'>
                                <i class='material-icons mdl-list__item-icon'>whatshot</i>
                                ${story.authorKarma}
                            </span>
                        </li>
                        <li class='mdl-list__item'>
                            <span class='mdl-list__item-primary-content'>
                                <i class='material-icons mdl-list__item-icon'>access_time</i>
                                ${date}
                            </span>
                            <span class='mdl-list__item-primary-content'>
                                <i class='material-icons mdl-list__item-icon'>star</i>
                                ${story.score}
                            </span>
                        </li>
				    </ul>
                </div>
                <div class='mdl-card__actions mdl-card--border'>
                    <a class='mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect' href='${story.url}'>View Full Article</a>
                </div>
            </div>
	    </div>`)
};

let buildStoryObj = (storyData, authorData) => {
    let story = {};
    story.title = storyData.title;
    story.score = storyData.score;
    story.url = storyData.url;
    story.time = storyData.time;
    story.authorId = authorData.id;
    story.authorKarma = authorData.karma;
    return story;
};

function promiseSeries(list) {
    let p = Promise.resolve();
    return list.reduce(function(pacc, fn) {
        return pacc = pacc.then(fn);
    }, p);
}
