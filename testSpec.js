describe('Making a new Monster', function(){
	
	it('should have a name property that equals "vampire"', function(){
		expect(new Monster().name).toBe('vampire');
	});
	
	it('should return the attack it is initialized with', function(){
		expect(new Monster('Bite').attack()).toBe('Bite');
	});
});
