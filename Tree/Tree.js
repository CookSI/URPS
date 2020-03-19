var arr = [[213211,'name2'],[2123123,'name'],[3123123,'mad2'],[4123213,'werq'],[5123123546,'hdfkj']];
var index=-1;

for(i = 0; i < arr.length; ++i){
	console.log(arr[i][0] == 213211);
	index = (arr[i][0] == 213211)? i : -1; 
	console.log(index);
}
