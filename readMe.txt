Main.js is where all the magic happens.

Control amount of stories with storyCount

-> collectTopStories(storyCount)
    - Fetch the top stories json.
        - reduceStories is called returning an array of story id's
    - Map over returned array
        - Each index is passed into an empty promise.
        - Promise is then used to start a curry chain 'promiseSeries'
        - Resolve data is past to the subsequent promise to chain the api calls.
            - collectStoryData
            - collectUserData
                - buildStoryObj is called to pull together the api data in a story object
                - story is returned to promiseSeries
                - .then calls generateStoryComponent which generates a component.
                    - component is rendered to the DOM using jquery append();
                        - es6 template string used to build up html data
                        - singleLineString
                            - first combines the variables into the actual string data
                            - split the existing strings on line breaks and/or returns
                            - replace white space with '', join with ' ', and then trim.
