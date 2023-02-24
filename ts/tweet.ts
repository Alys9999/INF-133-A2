class Tweet {
	private text:string;
	time:Date;
    

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if (this.text.includes("Just completed")||this.text.includes("Just posted")){
            return "completed_event";
        }
        else if (this.text.includes("Watch my")&&this.text.includes("right now")){
            return "live_event";
        }
        else if (this.text.includes("Achieved")){
            return "achievement";
        }
        else{
            return "miscellaneous";
        }
        
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        if (this.text.includes(" - ")){
            return true;
        }
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        let start=0;
        let end=0;
        start=this.text.indexOf(" - ")+3;
        end = this.text.indexOf("http");
        return this.text.substring(start,end);
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        const notext= this.text.replace(this.writtenText,"");
        const text_array=notext.split(" ");
        let start=0;
        let end = 0;
        for(let i =0; i<text_array.length; i++){
            if (text_array[i]==("km")||text_array[i]==("mi")){
                start=i+1;
            }
            if (text_array[i]==("with")||text_array[i]==("-")){
                end=i;
            }
        }
        if(start!=0 && end!=0){
            return text_array.slice(start,end).join(" ");
        }
        return "unknown";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        const notext= this.text.replace(this.writtenText,"");
        const text_array=notext.split(" ");
        for(let i =0; i<text_array.length; i++){
            if (text_array[i]==("km")){
                return parseFloat(text_array[i-1])*0.621371;
            }
            else if (text_array[i]==("mi")){
                return parseFloat(text_array[i-1]);
            }
        }
        return 0;
    }

    get getHTMLTableRow():string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity

        //TODO: parse the written text from the tweet
        let start=0;
        let end=0;
        start=this.text.indexOf("http");
        let f=this.text.substring(start,this.text.length);
        end = f.indexOf(" #");
        let res = f.substring(0,end);
        return this.writtenText+"<a href="+res+">"+res+"</a>"+f.substring(end)
    }
}