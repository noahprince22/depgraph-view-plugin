describe('Escape id function', function(){
  it('replaces all characters except numbers and letters',function() {
     expect(escapeId('123456')).toEqual('123456');
   });
});
