
//Our ClientSide JS
var domain = document.domain;
var socket = io.connect('http://' + domain + ':4000');

//Button Controllers-----------------------------------------------------------
function newUser(){
	var user = {
		firstname: $('#firstname').value, 
		lastname : $('#lastname').value,	
		username : $('#username').value,
		pid      : parseInt($('#pid').value)
	};
	socket.emit('newUser', user);
	console.log('New User Sent');
	console.log(user);
}

function searchUser(){
	var query = {
		firstname: $('#firstnamesearch').value
	};
	socket.emit('getUser', query);
}

function deleteUser() {
	var query = {
		firstname: $('#firstnamedelete').value
	};
	socket.emit('deleteUser', query);
}




//Helpers----------------------------------------------------------------------
/*function $(id){
	return document.getElementById(id);
}*/

//Run after window loads fully-------------------------------------------------
window.onload = function(){

	//Ace Editor Setup---------------------------------------------------------
	var editor = ace.edit('editor');
	editor.renderer.setShowGutter(false);
	editor.insert("madweb$>Welcome to MADWEBDEV's first experiment!\nmadweb$>");

	//Twitter Boostrap Dropdown fix
	$('.dropdown-toggle').dropdown();
	
	//Socket Setup-------------------------------------------------------------
	socket.on('foundUser', foundUser);
	function foundUser(user) {
		terminalLog(prettify(user));
	};

	socket.on('log', terminalLog);

	//Helpers------------------------------------------------------------------
	function prettify(obj){
		var output = '';
		var jsonArr = JSON.stringify(obj).split(',');
		for(j in jsonArr){
			output += jsonArr[j] + '\n';
		}
		return output.slice(0,-1);
	}

	function terminalLog(message){
		editor.insert(message + '\nmadweb$>');
	}
}