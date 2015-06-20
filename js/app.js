$(document).ready(function () {
	var date = document.getElementById("date");
	date.innerHTML = moment().format("dddd, MMM DD, YYYY");

	loadTasks();
	pressEnter();
});

function pressEnter() {
	var input = document.getElementById("input");
	$(input).on("keyup", function (e) {
		var keyCode = e.keyCode || e.which;
		if (keyCode == 13) {
			enterTask(input);	
		}
	});	
}

function enterTask(input) {
	var task = input.value;
	input.value = "";
	if (task !== "") {
		new Task(task, false, "white");	
	}
}

function loadTasks() {
	var tasks = [];
	for (var i = 0; i < localStorage.length; i++) {
		tasks[i] = localStorage.getItem(localStorage.key(i));
	}
	localStorage.clear();

	for (var i = 0 ; i < tasks.length; i++) {
		var info = JSON.parse(tasks[i]);
		var task = info["value"];
		var checked = info["checked"];
		var color = info["color"];
		new Task(task, checked, color);
	}
}