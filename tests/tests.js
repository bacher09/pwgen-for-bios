test( "Samsung test", function() {
  var code = autoGetBiosPwd("07088120410C0000");
  ok(code.samsung[0] == "12345", "Samsung 12345" );
});

test("Sony test", function() {
  var code = autoGetBiosPwd("1234567");
  ok(code.sony == "9648669", "Sony" );
});
