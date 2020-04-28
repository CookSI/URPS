var bracket = [1,2,3,4,3,5,6,7];
console.log(bracket);
tournament(bracket);


function tournament(contest){
	if(contest.length > 1){
		var i = 1;
		while(i<=contest.length){
			//swap contentants 
			var j = Math.floor((i)/2);
			var placeholderOne = contest[i];
			var placeholderTwo = contest[j];
			var placeholderThree = contest[i-1]
			if(contest[i]>contest[i-1]){
				contest[i] = placeholderTwo;
				contest[j] = placeholderOne;
			}else{
				contest[i-1] = placeholderTwo;
				contest[j] = placeholderThree;
			}
			i=i+2;
			console.log(contest);
		}
		i = (i-1)/2;
		console.log(i);
		while(i>0){
			contest.pop();
			i = i-1;
		}
		console.log(contest);
		console.log(i);
		tournament(contest);
	}else{
		console.log(contest[0] +" is the Winner");
	}
}	