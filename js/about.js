function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	tweet_array.sort((a, b) => a.time - b.time)
	num_com=
	console.log(tweet_array)
	document.getElementById('numberTweets').innerText = tweet_array.length;	
	document.getElementById('firstDate').innerText = tweet_array[1].time.toDateString();
	document.getElementById('lastDate').innerText = tweet_array[tweet_array.length-1].time.toDateString();
	document.getElementById('completedEvents').innerText = tweet_array.filter;	
	document.getElementById('liveEvents').innerText = tweet_array.length;	
	document.getElementById('achievements').innerText = tweet_array.length;	
	document.getElementById('miscellaneous').innerText = tweet_array.length;	
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});