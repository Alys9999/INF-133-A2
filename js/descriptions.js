function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	written_text_array=tweet_array.filter(tweet => tweet.written==true);

	//have the tweet_array of text
	let searchText = document.getElementById("textFilter");
	searchText.addEventListener('input', function() {
		table=document.getElementById("tweetTable");
		table.innerHTML='';
		if (searchText.value==''){
			
		}else{
			count = 0;
			for(let tweet of written_text_array){
				if (tweet.writtenText.includes(searchText.value)){
					
					row=table.insertRow(count);
					row.insertCell().innerHTML=count;
					row.insertCell().innerHTML=tweet.activityType;
					row.insertCell().innerHTML=tweet.getHTMLTableRow;
					//console.log(tweet.text)
					count+=1;
				}
			}
		}
		document.getElementById("searchCount").innerText = count;
		document.getElementById("searchText").innerText = searchText.value;
	})
	
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
}

//function addEventHandlerForSearch() {
	
//}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	//addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});