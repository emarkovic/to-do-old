//to-do
function Task(value, $parent, color, striked) {
	
	Task.i++;
	this.taskId = 'task' + Task.i;
	this.value = value;
	this.subject = null;
	this.color = color;
	this.striked = striked;

	this.$parent = $parent;
	this.$taskElem = null;
	this.$checkbox = null;
	this.$text = null;
	this.$editElem = null;
	this.$content = null;

	this.makeElements();
	this.addEventListeners();
	this.save();

}

Task.i = 0;

Task.prototype.makeElements = function () {
	this.setSubject();
	if (this.color != null) {
		savedColors.set(this.subject, this.color);
	} else {
		this.assignColor();	
	}
	
	this.$parent.append(
		'<li class="list-group-item" id="' + 
		this.taskId + 
		'"><div class="content"><input type="checkbox" value=""> &nbsp; <span class="text"></span><span class="glyphicon glyphicon-remove-circle pull-right task-delete" aria-hidden="true"></span></div><input type="text" class="form-control edit" value=""></li>'
	);

	this.$taskElem = $('#' + this.taskId);
	this.$checkbox = this.$taskElem.find('input[type=checkbox]');
	this.$text = this.$taskElem.find('.text');
	this.$editElem = this.$taskElem.find('.edit');
	this.$content = this.$taskElem.find('.content');
	this.$glyphicon = this.$taskElem.find('.glyphicon-remove-circle');

	this.$editElem.hide();
	this.$text.text(this.value);
	this.$editElem.val(this.value);
	this.$taskElem.css({backgroundColor : savedColors.get(this.subject)});
	console.log(this.striked);
	if (this.striked) {
		this.$checkbox.prop('checked', true);
		this.$text.css({'text-decoration' : 'line-through', 'color' : 'grey'});
	}
	
};

Task.prototype.addEventListeners = function () {
	this.checkboxClick();
	this.textClick();
	this.edit();
	this.escapeEdit();
	//this.glyphiconClick();
};

Task.prototype.checkboxClick = function() {
	var _this = this;

	this.$checkbox.on('click', function () {

		if (_this.striked) {
			_this.striked = false;
			_this.$text.css({'text-decoration' : '', 'color' : ''});
			//_this.unsave();
		} else {
			_this.striked = true;
			_this.$text.css({'text-decoration' : 'line-through', 'color' : 'grey'});
		}
		_this.save();
	});
};

Task.prototype.textClick = function() {
	var _this = this;
	this.$text.on('click', function () {
		_this.$content.hide();
		_this.$editElem.show();
	});

};

Task.prototype.edit = function() {
	var _this = this;

	this.$editElem.on('keyup', function (e) {
		var code = e.keyCode || e.which;

		if (code == 13) {	//the enter key
			_this.value = _this.$editElem.val();

			_this.setSubject();
			_this.assignColor();
			_this.$taskElem.css({backgroundColor : savedColors.get(_this.subject)});

			_this.$editElem.hide();
			_this.$text.text(_this.value);
			_this.$content.show();

			
			_this.save();
		}
			
	});
};

Task.prototype.escapeEdit = function() {
	var _this = this;
	this.$editElem.on('keyup', function(e) {
		var code = e.keyCode || e.which;
		if (code == 27) {
			_this.$editElem.hide();
			_this.$editElem.val(_this.value);
			_this.$content.show();
		}
	})
};

Task.prototype.setSubject = function() {
	//sets the subject field of the class
	var hyphen = this.value.lastIndexOf('-');
	if (hyphen == -1) {
		this.subject = null;
	} else {
		this.subject = this.value.substring(hyphen + 1).trim();
	}
};


Task.prototype.assignColor = function() {
	if (this.subject == null) {
		savedColors.set(this.subject, 'white');
	} else if (!savedColors.has(this.subject)) {
		savedColors.set(this.subject, randomColor({luminosity: 'light'}));
	}
	
};

// Task.prototype.glyphiconClick = function() {
// 	var _this = this;
// 	this.$glyphicon.on('click', function () {
// 		console.log('i was clicked ' + _this.taskId);
// 	});	
// };

Task.prototype.save = function () {
	var object = {
		'text' : this.value, 
		'color' : savedColors.get(this.subject), 
		'striked' : this.striked
	};
	
	localStorage.setItem(this.taskId, JSON.stringify(object));
};

Task.prototype.unsave = function () {
	localStorage.removeItem(this.taskId);
};