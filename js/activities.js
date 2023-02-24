function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	let weekName=["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	//original array
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	//???????do we need to contain unknown type of sports?
	//an Object of pairs of types and number of each type in the array {"types":"number"}
	let types = new Object();
	for (const i of tweet_array){
		if(types.hasOwnProperty(i.activityType)){
			types[(i.activityType)]=types[(i.activityType)]+1;
		}else{
			types[(i.activityType)]=1;
		}
	}

	//convert Object to array in [["types, number"]]
	let item = Object.entries(types);
	//sort the array
	let sorted_item = item.sort((a, b) => b[1] - a[1]);
	
	//upload the span
	document.getElementById('numberActivities').innerText = sorted_item.length;	
	let first = sorted_item[0][0];
	let second = sorted_item[1][0];
	let third = sorted_item[2][0]
	document.getElementById('firstMost').innerText = first;
	document.getElementById('secondMost').innerText = second;
	document.getElementById('thirdMost').innerText = third;

	//array of only top three activity
	let three_act = tweet_array.filter(function(item){
		return item.activityType==first || item.activityType==second || item.activityType==third;
	})
	//sort the array of only top three activity
	three_act.sort((a, b) => b.distance - a.distance);
	//upload the span
	document.getElementById('longestActivityType').innerText = three_act[0].activityType;
	document.getElementById('shortestActivityType').innerText = three_act[three_act.length-1].activityType;
	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	//filter the longest activity 
	let most_act=tweet_array.filter(tweet=> tweet.activityType==three_act[0].activityType);
	let end_or_day = new Object();
	end_or_day["weekday"]=0;
	end_or_day["weekend"]=0;
	for (let i of most_act){
		if ([1,2,3,4,5].includes(i.time.getDay())){
			end_or_day["weekday"]=end_or_day["weekday"]+1;
		}else if([0,6].includes(i.time.getDay())){
			end_or_day["weekend"]=end_or_day["weekend"]+1;
		}
	}
	//average the result
	end_or_day["weekday"]=end_or_day["weekday"]/5;
	end_or_day["weekend"]=end_or_day["weekend"]/2;
	let result_e_or_d = "";
	if(end_or_day["weekday"]>end_or_day["weekend"]){
		result_e_or_d="weekday";
	}else if(end_or_day["weekday"]<end_or_day["weekend"]){
		result_e_or_d="weekend";
	}else{
		result_e_or_d="both";
	}
	document.getElementById('weekdayOrWeekendLonger').innerText = result_e_or_d;


	//Object to array of Objects {type: 'run', number: 4951}
	let result_firstpic = Object.entries(types)
                   .map(item => ({type: item[0], number: item[1]}));

	activity_vis_spec1 = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": result_firstpic
	  },
	  "mark": {"type": "point"},
	  "encoding": {
		"x": {"field": "type", "type": "ordinal"},
		"y": {"field": "number",  "type": "quantitative", "scale": {type:"log"}}}
	};
	function weekDigitToName(weeknum){
		return weekName[weeknum];
	}
	let result_secondpic = three_act
                   .map(item => ({day: weekDigitToName(item.time.getDay()), distance: item.distance, type: item.activityType}));

	activity_vis_spec2 = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
		  "values": result_secondpic
		},
		"param": [{"name": "showMean", "input": "aggregate"}],
		"mark": {"type": "point"},
		"encoding": {
		  "x": {"field": "day", "type": "nominal", 
		  "scale": {
			"domain": weekName
		  }
		},
		  "y": {"field": "distance",  "type": "quantitative"},
		  "color": {"field": "type", "type":"nominal"}
		}
		 
	  };

	  activity_vis_spec3 = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
		  "values": result_secondpic
		},
		"mark": {"type": "point"},
		"encoding": {
		  "x": {"field": "day", "type": "nominal"},
		  "y": {"aggregate":"average", "field": "distance",  "type": "quantitative"},
		  "color": {"field": "type", "type":"nominal"}
		}
	  };
	vegaEmbed('#activityVis', activity_vis_spec1);

	let is_clicked=false;
	vegaEmbed('#distanceVis', activity_vis_spec2);
	document.getElementById("aggregate").onclick=(function(){
		if (is_clicked==false){
			is_clicked=true;
			vegaEmbed('#distanceVis', activity_vis_spec2).then(function(res){
				res.finalize();
			});
			vegaEmbed('#distanceVis', activity_vis_spec3);
			
		}else if (is_clicked==true){
			is_clicked=false;
			vegaEmbed('#distanceVis', activity_vis_spec3).then(function(res){
				res.finalize();
			});
			vegaEmbed('#distanceVis', activity_vis_spec2);
		}
		
	})
		
	
	
	

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});