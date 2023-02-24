
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
	tweet_array.sort((a, b) => a.time - b.time);

	document.getElementById('numberTweets').innerText = tweet_array.length;	
	document.getElementById('firstDate').innerText = tweet_array[1].time.toDateString();
	document.getElementById('lastDate').innerText = tweet_array[tweet_array.length-1].time.toDateString();

	function processClass(html_v, tweet_v){
		num=tweet_array.filter(tweet => tweet.source==tweet_v).length;
		pct=(num/parseFloat(tweet_array.length)).toFixed(2);
		collected=document.getElementsByClassName(html_v);
		collectedPCT=document.getElementsByClassName(html_v+"Pct");
		for(let i of collected){
			i.innerText=num;
		}
		for(let i of collectedPCT){
			i.innerText=pct;
		}
		
	}
	
	processClass("completedEvents", "completed_event")
	processClass('liveEvents', "live_event")
	processClass('achievements', "achievement")
	processClass('miscellaneous', "miscellaneous")

	num_comp=tweet_array.filter(tweet => tweet.source=="completed_event");
	num_written=num_comp.filter(tweet => tweet.written==true).length;
	pct=(num_written/parseFloat(num_comp.length)).toFixed(2);
	collected=document.getElementsByClassName("written");
	collectedPCT=document.getElementsByClassName("written"+"Pct");
	for(let i of collected){
		i.innerText=num_written;
	}
	for(let i of collectedPCT){
		i.innerText=pct;
	}

	console.log(tweet_array);
	
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});