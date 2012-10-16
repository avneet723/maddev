
Monster = function(attack){
	var self = this;
	self.attack = function(){
		console.log(attack);
		return attack;
	}
	self.name = 'vampire';
}