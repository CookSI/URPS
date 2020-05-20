var express = require('express');
var app = express();
var serv = require('http').Server(app);



app.get('/', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);

console.log("Server started.");

// Will function like a T.O. Creating a braket, geting match results and declaring a winner 
var io = require('socket.io')(serv,{});
var globalPlayerList = [];
var bracketPlayerList = [];

// add tesing functionality

io.sockets.on('connection', function(socket){
		var player = {
			id : '',
			name : '',
			res: ''
		};
		player.id = socket.id;
		// globalPlayerList.push(player);
		// console.log(globalPlayerList);
	
	socket.on('pName', function(data){
		player.name = data.name;
		console.log(globalPlayerList);
		globalPlayerList.push(player);
		console.log(globalPlayerList);
		
		// socket.emit('list', globalPlayerList);
		
		if(globalPlayerList.length >= 2){ //ready for players start timer: less players more wait time 
		io.sockets.emit('readyGameState',{
			state:1
		});
		
		//start timer once the timer is done splice player list into a new braket 
			setTimeout( () => {
				bracketPlayerList = globalPlayerList.splice(0, globalPlayerList.length);
				
				while(bracketPlayerList.length % 4 !== 0){
					var computer = {
						id : '',
						name : 'CPU',
						res: 0
					};
					bracketPlayerList.push(computer);
				}
				
				for(i = 0; i < bracketPlayerList.length-1; i=i+2){
					console.log('bracket');
					var playerOne = bracketPlayerList[i].id;
					var playerTwo = bracketPlayerList[i+1].id;
					if(bracketPlayerList[i+1].name == 'CPU' && bracketPlayerList[i].name !== 'CPU' ){
						bracketPlayerList[i].res = 1;
					}else{
						io.to(playerOne).emit('op', JSON.stringify(bracketPlayerList[i+1])); 
						io.to(playerTwo).emit('op', JSON.stringify(bracketPlayerList[i])); 
					}
				}
				
					
				//tournament(bracketPlayerList);
				//then we want a loop to go through the player list and every 2 players is sent their oponent 
				
			},60000);
		}else{ //not ready
			io.sockets.emit('readyGameState',{state:0});
		}
	});
		
	socket.on('disconnect' ,function(){
		console.log(socket.id);
		var index = findId(globalPlayerList,socket.id);
		if(index = -1){
			var index = findId(bracketPlayerList,socket.id);
			bracketPlayerList.splice(index,1);
		}else{
			globalPlayerList.splice(index,1);
		}
		//console.log(index);
	});
	
	socket.on('handPlayed', function(data){
		console.log(data.l_hand + " " + socket.id + " " + data.op);
		io.to(data.op).emit('ophand', data.l_hand);
	});
			
});


function findId(arr,userid){
	for(i = 0; i < arr.length; ++i){;
		if(arr[i].id == userid){
			return i;
		}
	}
	return -1;
}


function tournament(contest){
	if(contest.length > 1){
		var i = 1;
		while(i<=contest.length){
			//swap contentants 
			var j = Math.floor((i)/2);
			var placeholderOne = contest[i];
			var placeholderTwo = contest[j];
			var placeholderThree = contest[i-1];
			if(contest[i].res >= contest[i-1].res){
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
		//tournament(contest);
	}else{
		console.log(contest[0].name +" is the Winner");
	}
}	
setInterval(function(){
	var nextRound = 1;
	for(var i = 0; i < bracketPlayerList.length; i++){
		if(bracketPlayerList[i].res == ''){
			nextRound = 0;
		}
		if(nextRound == 1){
			tournament(bracketPlayerList);
			for(var j = 0; j < bracketPlayerList.length; j++){
				bracketPlayerList[j].res == ''
			}
			break;
		}
	} 
},1000/30)




	
	

