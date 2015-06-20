function Task2(task, checked, color) {
	Task2.i++;
	this.task = task;
	this.taskId = "task" + Task2.i;
	this.checked = checked;
	this.taskColor = color;

	// this.parent = document.getElementById("tasks");
	this.inProgress = document.getElementById("in-progress");
	this.completed = document.getElementById("completed");

	this.buildTaskElement();

	this.taskLi = document.getElementById(this.taskId);
	this.contentDiv = document.getElementById("content" + Task2.i);
	this.checkbox = document.getElementById("checkbox" + Task2.i);
	this.textElem = document.getElementById("text" + Task2.i);
	this.removeX = document.getElementById("remove" + Task2.i);

	//hide and show this 
	this.editDiv = document.getElementById("editDiv" + Task2.i);
	//call color picker with this
	this.cpDiv = document.getElementById("cpDiv" + Task2.i);
	this.editElem = document.getElementById("edit" + Task2.i);
	
	this.addEventHandlers();
	this.save();
}

Task2.i = 0;
Task2.template = _.template($(document.getElementById("template-task")).html());

Task2.prototype.addEventHandlers = function() {
	this.checkboxClick();
	this.removeClick();
	this.spanTextClick();
	this.confirmEdit();
	this.escapeEdit();
	this.changeColor();
};

Task2.prototype.checkboxClick = function() {
	var self = this;

	$(self.checkbox).on("click", function () {
		if (self.checkbox.checked) {
			self.textElem.style.textDecoration = "line-through";
			self.prependToCompleted();
		} else {
			self.textElem.style.textDecoration = "none";
			self.appendToInProgress();	
		}
		self.save();
	});
};

Task2.prototype.removeClick = function() {
	var self = this;
	
	$(self.removeX).on("click", function () {
		if (self.checkbox.checked) {
			self.completed.removeChild(self.taskLi);
		} else {
			self.inProgress.removeChild(self.taskLi);	
		}
		self.delete();
	});
};

Task2.prototype.spanTextClick = function() {
	var self = this;

	$(self.textElem).on("click", function () {
		self.showEdit();
 	});
};

Task2.prototype.confirmEdit = function() {
	var self = this;

	$(this.editElem).on("keyup", function (e) {
		var keyCode = e.keyCode || e.which;
		if (keyCode == 13) {
			self.task = this.value;
			self.textElem.innerHTML = self.task;
			self.editElem.value = self.task;
			self.save();
			self.hideEdit();
		}
	});
};

Task2.prototype.escapeEdit = function() {
	var self = this;

	$(document).on("keyup", function (e) {
		var keyCode = e.keyCode || e.which;
		if (keyCode == 27) {		
			self.hideEdit();
		}
	});
};

Task2.prototype.changeColor = function() {
	var self = this;

	$(self.cpDiv).colorpicker({input:null}).on("changeColor", function (event) {
		var color = event.color.toRGB();
		self.taskColor = "rgba(" + color["r"] + ", " + color["g"] + ", " + color["b"] + ", " + color["a"] + ")"
		self.taskLi.style.backgroundColor = self.taskColor;  
		self.save();
	})

};

Task2.prototype.showEdit = function() {
	this.contentDiv.style.display = "none";
	this.editDiv.style.display = "block";
};

Task2.prototype.hideEdit = function() {
	this.contentDiv.style.display = "block";
	this.editDiv.style.display = "none";
};

Task2.prototype.prependToCompleted = function() {
	var first = this.completed.firstChild;
	if (first === null) {
		this.completed.appendChild(this.taskLi);
	} else {
		this.completed.insertBefore(this.taskLi, first);
	}
};

Task2.prototype.appendToInProgress = function() {
	this.inProgress.appendChild(this.taskLi);
};

Task2.prototype.save = function() {
	var info = {
		"value" : this.task,
		"checked" : this.checkbox.checked,
		"color" : this.taskColor
	};
	localStorage.setItem(this.taskId, JSON.stringify(info));
};

Task2.prototype.delete = function() {
	localStorage.removeItem(this.taskId);
};

Task2.prototype.buildTaskElement = function() {
	var taskInfo = {
		"i" : Task2.i, 
		"task" : this.task,
		"taskId" : this.taskId,
		"checked" : this.checked, 
		"taskColor" : this.taskColor
	};
	var taskHTML = Task2.template(taskInfo);
	if (this.checked) {
		$(this.completed).append(taskHTML);
	} else {
		$(this.inProgress).append(taskHTML);
	}
};
