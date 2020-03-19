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

io.sockets.on('connection', function(socket){
		var player = {};
		player.id = socket.id;
		// globalPlayerList.push(player);
		// console.log(globalPlayerList);
	
	socket.on('pName', function(data){
		player.name = data.name;
		console.log(globalPlayerList);
		globalPlayerList.push(player);
		console.log(globalPlayerList);
		
		// socket.emit('list', globalPlayerList);
		
		if(globalPlayerList.length >= 4){ //ready for players start timer: less players more wait time 
		
		io.sockets.emit('readyGameState',{state:1});
		//start timer once the timer is done splice player list into a new braket 
		bracketPlayerList = globalPlayerList.splice(0, globalPlayerList.length);
			for(i = 0; i < bracketPlayerList.length-1; i=i+2){
				console.log('bracket');
				var roomName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
				var playerOne = bracketPlayerList[i].id;
				var playerTwo = bracketPlayerList[i+1].id;
				io.to(playerOne).emit('op', JSON.stringify(bracketPlayerList[i+1])); 
				io.to(playerTwo).emit('op', JSON.stringify(bracketPlayerList[i])); 
			}
				//then we want a loop to go through the player list and every 2 players is sent their oponent 
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
		hand = JSON.parse(data);
		opId = hand.id;
		io.to(opId).emit('ophand', JSON.stringify(hand));
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

setInterval(function(){
	
		
},1000/25)




	
	

