function Task(task, checked, color) {
	Task.i++;
	this.task = task;
	this.taskId = "task" + Task.i;
	this.checked = checked;
	this.taskColor = color;

	// this.parent = document.getElementById("tasks");
	this.inProgress = document.getElementById("in-progress");
	this.completed = document.getElementById("completed");

	this.buildTaskElement();

	this.taskLi = document.getElementById(this.taskId);
	this.contentDiv = document.getElementById("content" + Task.i);
	this.checkbox = document.getElementById("checkbox" + Task.i);
	this.textElem = document.getElementById("text" + Task.i);
	this.removeX = document.getElementById("remove" + Task.i);

	//hide and show this 
	this.editDiv = document.getElementById("editDiv" + Task.i);
	//call color picker with this
	this.cpDiv = document.getElementById("cpDiv" + Task.i);
	this.editElem = document.getElementById("edit" + Task.i);
	
	this.addEventHandlers();
	this.save();
}

Task.i = 0;
Task.template = _.template($(document.getElementById("template-task")).html());

Task.prototype.addEventHandlers = function() {
	this.checkboxClick();
	this.removeClick();
	this.spanTextClick();
	this.confirmEdit();
	this.escapeEdit();
	this.changeColor();
};

Task.prototype.checkboxClick = function() {
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

Task.prototype.removeClick = function() {
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

Task.prototype.spanTextClick = function() {
	var self = this;

	$(self.textElem).on("click", function () {
		self.showEdit();
 	});
};

Task.prototype.confirmEdit = function() {
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

Task.prototype.escapeEdit = function() {
	var self = this;

	$(document).on("keyup", function (e) {
		var keyCode = e.keyCode || e.which;
		if (keyCode == 27) {		
			self.hideEdit();
		}
	});
};

Task.prototype.changeColor = function() {
	var self = this;

	$(self.cpDiv).colorpicker({input:null}).on("changeColor", function (event) {
		var color = event.color.toRGB();
		self.taskColor = "rgba(" + color["r"] + ", " + color["g"] + ", " + color["b"] + ", " + color["a"] + ")"
		self.taskLi.style.backgroundColor = self.taskColor;  
		self.save();
	})

};

Task.prototype.showEdit = function() {
	this.contentDiv.style.display = "none";
	this.editDiv.style.display = "block";
};

Task.prototype.hideEdit = function() {
	this.contentDiv.style.display = "block";
	this.editDiv.style.display = "none";
};

Task.prototype.prependToCompleted = function() {
	var first = this.completed.firstChild;
	if (first === null) {
		this.completed.appendChild(this.taskLi);
	} else {
		this.completed.insertBefore(this.taskLi, first);
	}
};

Task.prototype.appendToInProgress = function() {
	this.inProgress.appendChild(this.taskLi);
};

Task.prototype.save = function() {
	var info = {
		"value" : this.task,
		"checked" : this.checkbox.checked,
		"color" : this.taskColor
	};
	localStorage.setItem(this.taskId, JSON.stringify(info));
};

Task.prototype.delete = function() {
	localStorage.removeItem(this.taskId);
};

Task.prototype.buildTaskElement = function() {
	var taskInfo = {
		"i" : Task.i, 
		"task" : this.task,
		"taskId" : this.taskId,
		"checked" : this.checked, 
		"taskColor" : this.taskColor
	};
	var taskHTML = Task.template(taskInfo);
	if (this.checked) {
		$(this.completed).append(taskHTML);
	} else {
		$(this.inProgress).append(taskHTML);
	}
};
