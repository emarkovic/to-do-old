/*
for ( var i = 0, len = localStorage.length; i < len; ++i ) {
  console.log( localStorage.getItem( localStorage.key( i ) ) );
}

 */
var savedColors = new Map();
$(document).ready(function () {
	
	var date = moment().format("dddd, MMM DD, YYYY");
	var $inputYo = $('#inputYo');
	var $tasks = $('#tasks');
	var $headerYo = $('#headerYo');

	$headerYo.append('<h1 class="text-center">To Do<br><small>' + date + '</small></h2>');
	

	$inputYo.on('keyup', function (e) {
		var code = e.keyCode || e.which;

		if (code == 13) {	//the enter key
			var value = $inputYo.val();
			$inputYo.val('');
			new Task(value, $tasks, null);
		}
			
	});

	var values = [];
	for (var i = 0; i < localStorage.length; i++) {
		values[i] = localStorage.getItem(localStorage.key(i));
	}
	localStorage.clear();

	for (var i = 0; i < values.length; i++) {
		var object = JSON.parse(values[i]);
		var value = object['text'];
		var color = object['color'];
		var striked = object['striked'];
		new Task(value, $tasks, color, striked);
	}

	
});




