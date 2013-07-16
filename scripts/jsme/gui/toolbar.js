function Toolbar()
{
	var el = document.createElement('div');
	el.className = 'Toolbar';
	this.element = $(el);
}

Toolbar.prototype.menus = [];
Toolbar.prototype.delayForClose = 800;
Toolbar.prototype.openMode = false;
Toolbar.prototype.element = null;

Toolbar.prototype.setMenu = function(id, name, options, func)
{
	var m = new ToolbarMenu(id, name, options, func, this);
	this.menus.push(m);
}
	
Toolbar.prototype.attach = function(id)
{
	for(var x =0; x < this.menus.length; x++)
	{
		this.element.appendChild(this.menus[x].element);
	}
	
	$(id).grab(this.element,'top');
}

Toolbar.prototype.closeAllMenu = function()
{
	for(var x = 0; x < this.menus.length; x++)
	{
		this.menus[x].click(true);
		$clear(this.menus[x].delayedClose);
	}
}

Toolbar.prototype.enableOption = function(menu, option)
{
	for(var x = 0; x < this.menus.length; x++)
	{
		if(this.menus[x].id == menu)
		{
			this.menus[x].enableOption(option);
			break;
		}
	}
}

Toolbar.prototype.disableMenu = function(menu)
{
	for(var x = 0; x < this.menus.length; x++)
	{
		if(this.menus[x].id == menu)
		{
			this.menus[x].disable();
		}
	}
}

Toolbar.prototype.disableOption = function(menu, option)
{
	for(var x = 0; x < this.menus.length; x++)
	{
		if(this.menus[x].id == menu)
		{
			this.menus[x].disableOption(option);
			return;
		}
	}
}

function ToolbarMenu(id, name, options, func, parent)
{
	this.id = id;
	this.name = name;
	this.parent = parent;
	this.element = this.generateElement();
	this.func = func;
	if(options)
	{
		this.optionsElement = document.createElement('div');
		this.optionsElement.className = 'ToolbarOptionSet';
		this.optionsElement.style.display = 'none';
		var self = this;
		this.options = new Array();
		var l = options.length;
		this.open = false;
		for(var x = 0; x < l; x++)
		{
			var o = new ToolbarOption(options[x].id, options[x].name, options[x].func, this);
			this.options.push(o);
			this.optionsElement.appendChild(o.element);
		}
		
		var element = $(this.optionsElement);
		element.addEvent(
			'mouseleave',
			function() {
				$clear(self.delayedClose);
				self.delayedClose = self.click.delay(self.parent.delayForClose, self, true);
			}
		);
		element.addEvent(
			'mouseenter',
			function() {
				$clear(self.delayedClose);
			}
		);
		this.parent.element.grab(element);
	}
}

ToolbarMenu.prototype.id;
ToolbarMenu.prototype.name;
ToolbarMenu.prototype.element;
ToolbarMenu.prototype.func;
ToolbarMenu.prototype.options;
ToolbarMenu.prototype.optionsElement;
ToolbarMenu.prototype.open;
ToolbarMenu.prototype.parent;
ToolbarMenu.prototype.delayedClose;

ToolbarMenu.prototype.disable = function()
{
	this.element.style.display = 'none';
}

ToolbarMenu.prototype.click = function(bool)
{
	if(this.func) this.func();
	if(!bool) this.parent.closeAllMenu();
	if(this.optionsElement)
	{
		if(this.open || bool == true)
		{
			this.optionsElement.style.display = 'none';
			this.open = false;
			if(bool) this.parent.openMode = false;
		}
		else
		{
			var dim = this.element.getCoordinates();
			this.optionsElement.style.position = 'absolute';
			this.optionsElement.style.top = dim.bottom;
			this.optionsElement.style.left = dim.left;
			this.optionsElement.style.display = 'block';
			this.open = true;
			this.parent.openMode = true;
		}
	}
}

ToolbarMenu.prototype.generateElement = function()
{
	var e = document.createElement('div');
	e.className = 'ToolbarMenu';
	e.appendChild(document.createTextNode(this.name));
	var self = this;
	e.onclick = function() { self.click(); };
	
	e = $(e);
	
	e.addEvent(
		'mouseenter',
		function() {
			$clear(self.delayedClose);
			if(self.parent.openMode) self.click();
		}
	);
	
	e.addEvent(
		'mouseleave',
		function() {
			$clear(self.delayedClose);
			self.delayedClose = self.click.delay(self.parent.delayForClose, self, true);
		}
	);
		
	
	return e;
}

ToolbarMenu.prototype.enableOption = function(option)
{
	for(var x = 0; x < this.options.length; x++)
	{
		if(this.options[x].id == option)
		{
			this.options[x].enable();
			break;
		}
	}
}

ToolbarMenu.prototype.disableOption = function(option)
{
	for(var x = 0; x < this.options.length; x++)
	{
		if(this.options[x].id == option)
		{
			this.options[x].disable();
			break;
		}
	}
}


function ToolbarOption(id, name, func, parent)
{
	this.id = id;
	this.name = name;
	this.func = func;
	this.parent = parent;
	this.element = this.generateElement();
	this.enabled = true;
}

ToolbarOption.prototype.element;
ToolbarOption.prototype.id;
ToolbarOption.prototype.name;
ToolbarOption.prototype.func;
ToolbarOption.prototype.parent;
ToolbarOption.prototype.enabled;

ToolbarOption.prototype.closeParent = function()
{
	this.parent.click(true); //parent.closeAllMenu();
}

ToolbarOption.prototype.click = function()
{
	if(this.enabled)
	{
		if(this.func)
		{
			if($type(this.func) == 'function')
			{
				if(this.func(this.element.id))
				{
					return;
				}
			}
			else
			{
				alert(this.func);
			}
		}
		
		this.closeParent();
	}
}

ToolbarOption.prototype.disable = function()
{
	this.enabled = false;
	this.element.className = 'ToolbarOption ToolbarOptionDisable';
}

ToolbarOption.prototype.enable = function()
{
	this.enabled = true;
	this.element.className = 'ToolbarOption';
}

ToolbarOption.prototype.generateElement = function()
{
	var e = document.createElement('div');
	
	if(this.name == '-')
	{
		e.className = 'ToolbarSeparator';
	}
	else
	{
		e.className = 'ToolbarOption';
		e.appendChild(document.createTextNode(this.name));
		e = $(e);
		e.id = 'toolbar_' + this.parent.id + '_' + this.id;
		e.set('morph', { duration: 'short' });
		e.addEvent('mouseenter', (function() { if(this.enabled) this.element.morph('.ToolbarOptionFocus'); }).bind(this));
		e.addEvent('mouseleave', (function() { if(this.enabled) this.element.morph('.ToolbarOption'); }).bind(this));
		e.addEvent('click', (function() { if(this.enabled) this.click(); }).bind(this));
	}
	
	return e;
}