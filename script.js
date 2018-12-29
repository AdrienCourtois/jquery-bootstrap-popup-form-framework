/**
 * Light-weighted Form created framework that'll display in a popup.
 * Author: Adrien Courtois
 * Copyright: Free to use
 * 
 * Compatible with:
 * - Ajax technology
 * - jQuery Text Editor (http://jqueryte.com)
 * - Ajax image uplaod with preview (https://)
 * 
 * Usage: 
 * You create a Form object, with given Field objects and call "showForm()" to display the form.
 * The result of the form can be sent to a remote page using Ajax, or returned as an object.
 */

 /**
  * Field class
  * @arg {string} title Containing the text that'll be displayed before the input.
  * @arg {string} name The name of the input, that'll be used to identify the return of the given input.
  * @arg {string} type The type of the input. Available types: textarea, textarea-jqte, checkbox, upload, password, select, price. Default being "text" type.
  * @arg {string} addon The addon to be added next to the input. Optionnal.
  * @arg {Array<string>} validator Available validators: NOTEMPTY, EMAIL, HOUR, NUMBER, DATE, ?DATE (DATE or empty)
  * @arg {string} info Will be displayed bellow the input to indicate something to the user about the field.
  */
class Field {
	constructor(settings){
		this.settings = settings;
		this.ID = '';
		this.instantiated = false;
		this.$ = null;
		this.emailRegExp = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/, 'i');
		this.dateRegExp = new RegExp(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4} (([0-1][0-9]|[2][0-3])h([0-5][0-9]$))/, 'i');
		this.hourRegExp = new RegExp(/^((([0-1][0-9])|(2[0-3]))h([0-5][0-9]))$/, 'i');
	}

	getName(){
		return this.settings.name;
	}

	getType(){
		return this.settings.type;
	}

	getTitle(){
		return this.settings.title;
	}

	getValidator(){
		if (!this.settings.validator)
            return [];
        
		if (typeof(this.settings.validator) == 'string')
			return [this.settings.validator];
		else
			return this.settings.validator;
	}

	getDefault(){
		return (this.settings.default) ? this.settings.default : '';
	}

	getID(){
		return this.ID;
	}

	setID(id){
		this.ID = id;
	}

	setIDFromContextName(name){
		this.setID(name + this.getName().substr(0, 1).toUpperCase() + this.getName().substr(1));
	}

	getHTML(){
		var s = `<div class="form-group">
		<label for="${this.getID()}">${this.getTitle()}</label>`;

		switch (this.getType()){
			case 'textarea':
			case 'textarea-jqte':
				s += `<textarea class="form-control" id="${this.getID()}">${this.getDefault()}</textarea>`;
			break;
			case 'checkbox':
				s += `&nbsp;&nbsp;<input type="checkbox" id="${this.getID()}" value="${this.getDefault()}" /><br>`;
			break;
			case 'upload':
				s += `<input type="file" class="form-control" id="${this.getID()}" />`;
			break;
			case 'password':
				s += `<input type="password" class="form-control" id="${this.getID()}" />`;
			break;
			case 'select':
				s += `<select class="form-control" id="${this.getID()}">`;
				
				for (var j = 0 ; j < this.settings.options.length ; j++)
					s += `<option value="${this.settings.options[j][0]}">${this.settings.options[j][1]}</option>`;
				
				s += `</select>`;
			break;
			case 'price':
				s += `
				<div class="input-group">
					<input type="text" class="form-control" id="${this.getID()}" />
					<span class="input-group-addon">€</span>
				</div>
				`;
			break;
			default:
				if (this.settings.addon)
					s += `<div class="input-group">`
					
				s += `<input class="form-control" type="text" id="${this.getID()}" value="${this.getDefault()}" />`;

				if (this.settings.addon)
					s += `<span class="input-group-addon">${this.settings.addon}</span></div>`;
			break;
		}

		if (this.settings.info)
			s += `<small class="form-text text-muted">${this.settings.info}</small>`;
		
		s += `</div>`;

		return s;
	}

	instantiate(){
		this.$ = $('#' + this.getID());

		this.instantiated = this.$.length == 1;
	}

	render(){
		if (!this.instantiated) return;

		switch (this.getType()){
			case 'upload':
				if (this.settings.resetUpload)
					this.$.ajaxUpload({ reset: this.settings.resetUpload });
				else
					this.$.ajaxUpload();
			break;
			case 'textarea-jqte':
				this.$.jqte();
			break;
		}
	}

	addError(){
		if (!this.instantiated) return;

		this.$.closest('.form-group').addClass('has-error');
	}

	removeError(){
		if (!this.instantiated) return;

		this.$.closest('.form-group').removeClass('has-error');
	}

	fill(val){
		if (!this.instantiated) return;

		switch (this.getType()){
			case 'textarea-jqte':
				this.$.jqteVal(val);
			break;
			case 'upload':
				this.$.setUpload(val);
			break;
			case 'checkbox':
				this.$.prop('checked', val == 1);
			break;
			default:
				this.$.val(val);
			break;
		}
	}

	getValue(){
		if (!this.instantiated) return;

		if (this.getType() == 'checkbox')
			return this.$.is(':checked') ? 1 : 0;
		else
			return this.$.val();
	}

	validate(){
		var validator = this.getValidator();
		var value = this.getValue();

		for (var j = 0 ; j < validator.length ; j++){
			switch (validator[j]){
				case 'NOTEMPTY':
					if (value.length == 0) return 'NOTEMPTY';
				break;
				case 'EMAIL':
					if (!this.emailRegExp.test(value)) return 'EMAIL';
				break;
				case 'DATE':
					if (!this.dateRegExp.test(value)) return 'DATE';
				break;
				case '?DATE':
					if (value.length > 0 && !this.dateRegExp.test(value)) return 'DATE';
				break;
				case 'HOUR':
					if (!this.hourRegExp.test(value)) return 'HOUR';
				break;
				case 'NUMBER':
					if (isNaN(value)) return 'NUMBER';
				break;
				default:
					return false;
				break;
			}
		}
	}
}

/**
 * The Form class
 * @arg {string} type The type of the form. Can be "edit" or "add". If "edit", it'll search for the values to be set to the inputs, using the fillFunction.
 * @arg fillFunction The function to be called to get the default value of an input from its name.
 * @arg {string} name The name of the form.
 * @arg {string} title The title that'll be displayed in the popup containing the form.
 * @arg {Array} fields The list of the Field objects.
 * @arg {Object.<string, string>} defaultData The default content of each field, based on the field name.
 * @arg {string} button The text contained in the button pressed to validate the form.
 * @arg {string} ajaxUrl The url of the remote page to be called with Ajax when completing the form.
 * @arg {string} ajaxMethod The method (default POST) to be used when calling the remote page with Ajax.
 * @arg doneFunction The function to be called when the remote paged returned "success". Default is reload.
 * @arg processFunction The callback function to be called with the data of the form as parameter when the form is completed.
 */
class Form {
	constructor(settings){
		this.settings = settings;
		this.fillFunction = function(name){ return ''; };
		this.defaultData = {};

		for (var i = 0 ; i < settings.fields.length ; i++){
			settings.fields[i] = new Field(settings.fields[i]);
			settings.fields[i].setIDFromContextName(settings.name);
		}

		this.createModal();
	}

	getType(){
		return this.settings.type;
	}

	getName(){
		return this.settings.name;
	}
	
	getTitle(){
		return this.settings.title;
	}

	getFields(){
		return this.settings.fields;
	}

	getButton(){
		return this.settings.button;
	}
	
	getDoneFunction(){
		if (this.settings.doneFunction)
			return this.settings.doneFunction;
		else
			return function(){ window.location.reload(); };
	}

	getProcessFunction(){
		if (this.settings.processFunction)
			return this.settings.processFunction;
		else
			return function(form, data){ console.log(data); }
	}

	getAjaxUrl(){
		return this.settings.ajaxUrl;
	}

	getAjaxMethod(){
		if (this.settings.ajaxMethod)
			return this.settings.ajaxMethod;
		else
			return 'post';
	}

	createModal(){
		var modal = `
		<div class="modal fade" id="${this.getName()}Modal" tabindex="-1" role="dialog" aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">${this.getTitle()}</h5>
					</div>
					<div class="modal-body">
		`;

		var fields = this.getFields();

		for (var i = 0 ; i < fields.length ; i++)
			modal += fields[i].getHTML();
					
		modal += `
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary">${this.getButton()}</button>
					</div>
				</div>
			</div>
		</div>`;

		$('body').append(modal);

		this.modal = $('#' + this.getName() + 'Modal');
		
		for (var i = 0 ; i < fields.length ; i++){
			fields[i].instantiate();
			fields[i].render();
		}
	}

	showForm(){
		if (this.getType() == 'edit')
			this.fill();
		
		this.errorHandle();

		var self = this;

		this.modal.find('.modal-footer .btn-primary').unbind('click').click(function(){
			self.process()
		});
		this.modal.modal(true);
	}

	hideForm(){
		this.modal.modal('hide');
	}

	errorHandle(error){
		if (!error) error = {};

		var fields = this.getFields();
		
		for (var i = 0 ; i < fields.length ; i++){
			if (error[fields[i].getName()])
				fields[i].addError();
			else
				fields[i].removeError();
		}
	}

	setFillFunction(fn){
		this.fillFunction = fn;
	}

	fill(){
		var fields = this.getFields();

		for (var i = 0 ; i < fields.length ; i++)
			fields[i].fill(this.fillFunction(fields[i].getName()));
	}

	addDefaultData(val){
		this.defaultData = $.extend(this.defaultData, val);
	}

	getDefaultData(){
		return this.defaultData;
	}

	process(){
		var error = {};
		var data = this.getDefaultData();
		var fields = this.getFields();

		for (var i = 0 ; i < fields.length ; i++){
			var value = fields[i].getValue();
			var field_error = fields[i].validate();
		
			if (field_error) error[fields[i].getName()] = field_error;
			data[fields[i].getName()] = value;
		}
		
		if (Object.keys(error).length == 0){
			if (this.getAjaxUrl())
				this.sendAjax(data);
			else {
				this.errorHandle(error);
				this.getProcessFunction()(this, data);
			}
		} else
			this.errorHandle(error);
	}

	sendAjax(data){
		var self = this;

		$.ajax({
			url: self.getAjaxUrl(),
			method: self.getAjaxMethod(),
			data: data
		}).done(function(e){
			if (e == "success")
				self.getDoneFunction()();
			else {
				try{
					self.errorHandle(JSON.parse(e));
				} catch(ex){
					showErrorModal(e);
				}
			}
		});
	}
}

/**
 * The Form Handler to be used when you have no idea what to do.
 * You have to call the createForm function related.
 * 
 * @arg {string} type The type of the form. Can be "edit" or "add". If "edit", it'll search for the values to be set to the inputs, using the fillFunction.
 * @arg {string} name The name of the form.
 * @arg {string} title The title that'll be displayed in the popup containing the form.
 * @arg {Array<Object.<string, Object>} fields All the fields in an array, format: { title: *, name: *, type: *, validator: *, ...}
 * @arg {string} button The text contained in the button pressed to validate the form.
 * @arg {string} ajaxUrl The url of the remote page to be called with Ajax when completing the form.
 * @arg {string} ajaxMethod The method (default POST) to be used when calling the remote page with Ajax.
 * @arg doneFunction The function to be called when the remote paged returned "success". Default is reload.
 * @arg {Object.<string, string>} defaultData The default content of each field, based on the field name.
 * 
 * @returns {Form} The form object you just created. You just have to call its "showForm" method to go! 
 */
var formHandler = {
	data: [],

	createForm: function(options){
		var settings = $.extend({
			type: 'create',
			name: '',
			title: "custom-form-" + this.data.length,
			fields: [], // { title: *, name: *, type: *, default: *, validator: * }
			button: 'Ajouter',
			ajaxUrl: '',
			ajaxMethod: 'post',
			doneFunction: function(){ window.location.reload(); },
			defaultData: {}
		}, options);

		if (settings.ajaxUrl.length == 0){
			console.error('Wrong usage of $.createForm : ajaxUrl param empty');
			return false;
		}

		if (settings.fields.length == 0){
			console.error('Wrong usage of $.createForm : fields param empty');
			return false;
		}

		if (settings.type != 'create' && settings.type != 'edit'){
			console.error('Wrong usage of $.createForm : type param required');
			return false;
		}

		if (settings.name.length == 0){
			console.error('Wrong usage of $.createForm : name param required');
			return false;
		}

		if (this.data.filter(v => v.name == settings.name).length != 0){
			console.error('Wrong usage of $.createForm : name param already in use');
			return false;
		}

		var form = new Form(settings);

		this.data.push(form);
		form.createModal();

		return form;
	}
};