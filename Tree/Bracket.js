var bracket = [1,2,3,4];
console.log(bracket);
tournament(bracket);


function tournament(contest){
	if(contest.length > 1){
		var i = 0;
		while(i<contest.length-1){
			if(i==0){
				contest[i] = (contest[i]>contest[i+1])? contest[i]:contest[i+1];
				}else{
				contest[i-1] = (contest[i]>contest[i+1])? contest[i]:contest[i+1];
				}
			i=i+2;
		}
		i = i/2;
		while(i>0){
			contest.pop();
			i = i-1;
		}
		console.log(contest);
		tournament(contest);
	}
}	