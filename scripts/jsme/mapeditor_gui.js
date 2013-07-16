MapEditor.prototype.append = function()
{
	var el = this.Container;
	
	if(el != null)
	{
		el.className = 'jsME_container';
		this.generateToolbar(el);
		var form = document.createElement('form');
		form.onsubmit = function() { return false; }
		form.method = 'post';
		form.action = this._fileScriptPath;
		form.className = 'jsME';
			var div_zoom = document.createElement('div');
			div_zoom.id = 'jsME_zoom';
			div_zoom.className = 'jsME_zoom1';
				var palette = this.generatePalette();
				div_zoom.appendChild(palette);
				this.refreshSelectedTile();
				
				this.MapElement = this.generateMap();
				div_zoom.appendChild(this.MapElement);

			form.appendChild(div_zoom);
			
		el.appendChild(form);
		
		this._element = form;
		return true;
	}
	
	return false;
}

MapEditor.prototype.generateTileSelect = function(id)
{
	var select = document.createElement('select');
	select.id = id;
	
	var l = this._paletteTiles.length;
	
	for(var x = 0; x < l; x++)
	{
		var tile = this._paletteTiles[x];
		var option = document.createElement('option');
		option.value = tile.value;
		option.appendChild(document.createTextNode(tile.label ? tile.label : this.msg('empty')));
		select.appendChild(option);
	}
	
	return select;
}

MapEditor.prototype.doAbout = function()
{
	var content = document.createElement('div');
	
		var contentP = document.createElement('p');
		contentP.appendChild(document.createTextNode('Javascript Map Editor (jsME) ' + this.msg('version') + ' ' + this.Version));
		content.appendChild(contentP);
		
		var contentP = document.createElement('p');
		contentP.appendChild(document.createTextNode(this.PluginName + ' ' + this.msg('version') + ' ' + this.PluginVersion));
		content.appendChild(contentP);
		
	this.Windows.show('about', this.msg('about'), content, true);
}

MapEditor.prototype.generatePalette = function()
{
	var palette = document.createElement('div');
	palette.className = 'jsME_palette';
	
		var pal_div = document.createElement('div');
		
			var l = this._paletteTiles.length;
			for(var x = 0; x < l; x++)
			{
				var tile = this._paletteTiles[x];
				var img = this.generatePaletteTile(tile);
				pal_div.appendChild(img);
				tile.paletteElement = img;
			}
		
		palette.appendChild(pal_div);
		
	return palette;
}

MapEditor.prototype.generatePaletteTile = function(tile)
{
	var self = this;
	var img = document.createElement('img');
	img.alt = tile.value;
	img.src = this._imagesPath + tile.image;
	
	if (tile.label != null) img.title = tile.label;
	if (!tile.isSelectable) img.style.display = 'none';
	
	img.onmousedown = function() { self.selectTile(this.alt); };
	
	return img;
}

MapEditor.prototype.generateMap = function()
{
	this.Map = [];
	var map = $(document.createElement('div'));
	map.className = 'jsME_map';
	map.id = 'ME_map';
	
	map.addEvent('dblclick', (function() { this.enableBrushOver(); }).bind(this));
	map.addEvent('mousemove', (function(e) { if(e.target.className == 'tile') this.brushOver(e.target); return true; }).bindWithEvent(this));
	map.addEvent('mousedown', (function(e) {
		var el = e.target;
		
		if(el.className != 'tile') return;
		
		if(e.control)
		{
			var pos = el.id.split('_');
			var y = parseInt(pos[1]);
			var x = parseInt(pos[2]);
			
			this.replaceTileInMap(this.Map[y][x], this._selectedTile);
		}
		else if(e.shift)
		{
			
		}
		else
		{
			this.brush(el);
		}
		
		this.disableBrushOver();
		
		return false;
	}).bindWithEvent(this));
	
	
	//$(map).addEvent('mouseleave', function() { self.disableBrushOver(); });
	this._mapImages = [];
	this._map = [];
	
	var h = this._height;
	var w = this._width;
	for(var y = 0; y < h; y++)
	{
		this._mapImages[y] = [];
		this.Map[y] = [];
		var row = document.createElement('div');
		row.className = 'jsME_map_row';
		row.id = 'jsME_map_row_' + y;
		
		for(var x = 0; x < w; x++)
		{
			this.Map[y][x] = null;
			var img = this.generateMapTile(x,y);
			this._mapImages[y][x] = img;
			row.appendChild(img);
		}
		
		map.appendChild(row);
	}
		
	return map;
}

MapEditor.prototype.generateMapTile = function(x,y)
{
	var img = document.createElement('img');
	img.id = 'cell_' + y + '_' + x;
	img.className = 'tile';
	
	this.applyTileTo(this._defaultTile, img, x, y);
	
	return img;
}

MapEditor.prototype.generateToolbar = function(id)
{
	var tb = new Toolbar();
	var self = this;
	
	tb.setMenu(
		'file',
		this.msg('file'),
		[
			{ id : 'new', name : this.msg('neww'), func : function(id) { self.doNew(id); } },
			{ id : 'sep', name : '-' },
			{ id : 'save', name : this.msg('saveAs'), func : function(id) { self.doSave(id); } },
			{ id : 'sep', name : '-' },
			{ id : 'exit', name : this.msg('exit'), func : function(id) { self.doExit(id); } }
		]
	);
	tb.setMenu(
		'map',
		this.msg('map'),
		[
			{ id : 'resize', name : this.msg('resize'), func : function(id) { self.doResize(id); } },
			{ id : 'zoom', name : this.msg('zoom'), func : function(id) { self.switchZoom(id); } },
			{ id : 'sep', name : '-' },
			{ id : 'config', name : this.msg('config'), func : function(id) { self.doConfig(id); } },
			{ id : 'sep', name : '-' },
			{ id : 'resize_container', name : this.msg('resizeContainer'), func : function(id) { self.resizeMapElement(id); } }
		]
	);
	
	tb.setMenu(
		'transform',
		this.msg('transform'),
		[
			{ id : 'copy', name : this.msg('copy'), func : function(id) { self.doCopy(id); } },
			{ id : 'move', name : this.msg('move'), func : function(id) { self.doMove(id); } },
			{ id : 'sep', name : '-' },
			{ id : 'replace', name : this.msg('replace'), func : function(id) { self.doReplace(id); } },
			{ id : 'fill', name : this.msg('fillArea'), func : function(id) { self.doFillArea(id); } },
			{ id : 'sep', name : '-' },
			{ id : 'mirror', name : this.msg('mirrorArea'), func : function(id) { self.doMirrorArea(id);} },
			{ id : 'mirror', name : this.msg('horizMirrorMap'), func : function() { self.mirrorMap(1);} },
			{ id : 'mirror', name : this.msg('vertiMirrorMap'), func : function() { self.mirrorMap(2);} }
		]
	);
	
	tb.setMenu(
		'help',
		this.msg('help'),
		[
			{ id : 'general', name : this.msg('generalHelp'), func : function(id) { self.doGeneralHelp(id); } },
			{ id : 'manual', name : this.msg('editorManual'), func : function(id) { self.goToManual(id); } },
			{ id : 'sep', name : '-' },
			{ id : 'about', name : this.msg('about'), func : function(id) { self.doAbout(id); } }
		]
	);
	
	if(this._isConfigurable != true) tb.disableOption('map','config');
	if(this._isZoomable != true) tb.disableOption('map','zoom');
	if(this._isResizable != true) tb.disableOption('map','resize');
	if(!this._fileScriptPath) tb.disableOption('file', 'save');
	
	tb.disableOption('help', 'general');
	tb.disableOption('help', 'manual');
	
	tb.attach(id);
	
	this.Toolbar = tb;
	
	this.Toolbar.element.addEvent('click', function() { self.disableBrushOver(); });
}

MapEditor.prototype.generateOutput = function(eid)
{
	var self = this;
	var form = document.createElement('div');
	form.id = 'ME_form';
	
		var text = document.createElement('textarea');
		this._outputContainer = text;
		text.name = 'data';
		text.className = 'jsME_output';
		text.style.display = 'block';
		text.readOnly = false;
		form.appendChild(text);
		
		var buttons = document.createElement('div');
		buttons.className = 'jsME_buttons';
		
			var button = document.createElement('button');
			button.id = 'ME_btnFetch';
			button.appendChild(document.createTextNode(this.msg('fetch')));
			button.onclick = function() { self.doFetch(); return false; }
			buttons.appendChild(button);
			
			var button = document.createElement('button');
			button.id = 'ME_btnUnfetch';
			button.appendChild(document.createTextNode(this.msg('unfetch')));
			button.onclick = function() { self.doUnfetch(); return false; }
			buttons.appendChild(button);

		form.appendChild(buttons);
	
	this._element.appendChild(form);
}

MapEditor.prototype.generateConfig = function()
{
	if(this._isConfigurable != true) return;
	
	var self = this;
	var div =document.createElement('div');
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	
	var l = this.Config.length;
	for(var x = 0; x < l; x++)
	{
		var c = this.Config[x];
		var id = 'ME_config_' + c.id;
		var tr = document.createElement('tr');
			var td = document.createElement('td');
				var label = document.createElement('label');
				label.setAttribute('for', id);
				label.appendChild(document.createTextNode(this.msg(c.label)));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				if(c.type == 'choice')
				{
					var select = document.createElement('select');
					select.id = id;
					select.name = id;
					var k = c.choices.length;
					for(var y = 0; y < k; y++)
					{
						var cc = c.choices[y];
						var option = document.createElement('option');
						option.value = cc.label;
						option.appendChild(document.createTextNode(this.msg(cc.label)));
						select.appendChild(option);
					}
					td.appendChild(select);
				}
				else if(c.type == 'text')
				{
					var input = document.createElement('input');
					input.type = 'text';
					input.id = id;
					input.name = id;
					td.appendChild(input);
				}
				else if(c.type == 'check')
				{
					var input = document.createElement('input');
					input.type = 'checkbox';
					input.id = id;
					input.name = id;
					td.appendChild(input);
				}
			tr.appendChild(td);
		tbody.appendChild(tr);
	}
		
	table.appendChild(tbody);
	div.appendChild(table);
	
	var buttons = document.createElement('div');
		var input = document.createElement('input');
		input.type = 'submit';
		input.id = 'ME_btnApplyConfig';
		input.className = 'button';
		input.value = this.msg('apply');
		input.onclick = function() { 
			self.applyConfig();
			self.Windows.close('config');
			return false;
		}
	buttons.appendChild(input);
	div.appendChild(buttons);
	
	this.Windows.show('config', this.msg('config'), div, true);
}

MapEditor.prototype.generateResize = function()
{
	var self = this;
	var div =document.createElement('div');
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	
		var tr = document.createElement('tr');
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_resize_width');
					label.appendChild(document.createTextNode(this.msg('width') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputW = document.createElement('input');
					inputW.type = 'text';
					inputW.id = 'ME_resize_width';
				td.appendChild(inputW);
			tr.appendChild(td);
		tbody.appendChild(tr);
		
		var tr = document.createElement('tr');
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_resize_height');
					label.appendChild(document.createTextNode(this.msg('height') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputH = document.createElement('input');
					inputH.type = 'text';
					inputH.id = 'ME_resize_height';
				td.appendChild(inputH);
			tr.appendChild(td);
		tbody.appendChild(tr);
	
	table.appendChild(tbody);
	div.appendChild(table);
	
	var buttons = document.createElement('div');
		var input = document.createElement('input');
		input.type = 'submit';
		input.id = 'ME_btnResize';
		input.className = 'button';
		input.value = this.msg('resize');
		input.onclick = function() { 
			var h = inputH.value.toInt();
			var w = inputW.value.toInt();
			if(isNaN(w) || isNaN(h) || h < 2 || w < 2) return false;
			if(self.resizeMap(w, h))
			{
				self.Windows.close('resize');
			}
			return false;
		}
	buttons.appendChild(input);
	div.appendChild(buttons);
	
	this.Windows.show('resize', this.msg('resize'), div, true);
}

MapEditor.prototype.doReplace = function(eid)
{
	this.Windows.close('replace');
	
	var self = this;
	var div =document.createElement('div');
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	
		var tr = document.createElement('tr');
			var td = document.createElement('td');
			td.colSpan = 2;
				var label = document.createElement('strong');
					label.appendChild(document.createTextNode(this.msg('tileToReplace') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
			td.colSpan = 3;
				var select1 = this.generateTileSelect('ME_replace_old');
				select1.value = this._selectedTile.value;
				td.appendChild(select1);
			tr.appendChild(td);
		tbody.appendChild(tr);
		var tr = document.createElement('tr');
			var td = document.createElement('td');
			td.colSpan = 2;
				var label = document.createElement('strong');
					label.appendChild(document.createTextNode(this.msg('tileToReplaceWith') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
			td.colSpan = 3;
				var select2 = this.generateTileSelect('ME_replace_new');
				select2.value = this._selectedTile.value;
				td.appendChild(select2);
			tr.appendChild(td);
		tbody.appendChild(tr);
		var tr = document.createElement('tr');
			var td = document.createElement('td');
				var label = document.createElement('strong');
					label.appendChild(document.createTextNode(this.msg('point1') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_replace_x1');
					label.appendChild(document.createTextNode(this.msg('x') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputX1 = document.createElement('input');
					inputX1.type = 'text';
					inputX1.id = 'ME_replace_x1';
				td.appendChild(inputX1);
			tr.appendChild(td);
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_replace_y1');
					label.appendChild(document.createTextNode(this.msg('y') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputY1 = document.createElement('input');
					inputY1.type = 'text';
					inputY1.id = 'ME_replace_y1';
				td.appendChild(inputY1);
			tr.appendChild(td);
		tbody.appendChild(tr);
		var tr = document.createElement('tr');
			var td = document.createElement('td');
				var label = document.createElement('strong');
					label.appendChild(document.createTextNode(this.msg('point2') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_replace_x2');
					label.appendChild(document.createTextNode(this.msg('x') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputX2 = document.createElement('input');
					inputX2.type = 'text';
					inputX2.id = 'ME_replace_x2';
				td.appendChild(inputX2);
			tr.appendChild(td);
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_replace_x2');
					label.appendChild(document.createTextNode(this.msg('y') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputY2 = document.createElement('input');
					inputY2.type = 'text';
					inputY2.id = 'ME_replace_y2';
				td.appendChild(inputY2);
			tr.appendChild(td);
		tbody.appendChild(tr);
	table.appendChild(tbody);
	div.appendChild(table);
	
	inputX1.value = '0';
	inputY1.value = '0';
	inputX2.value = self._width - 1;
	inputY2.value = self._height - 1;
	
	var buttons = document.createElement('div');
	var input = document.createElement('input');
	input.type = 'submit';
	input.id = 'ME_btnReplace';
	input.className = 'button';
	input.value = this.msg('replace');
	input.onclick = function() {
	
		var x1 = inputX1.value.toInt();
		var y1 = inputY1.value.toInt();
		var x2 = inputX2.value.toInt();
		var y2 = inputY2.value.toInt();
		
		var obj = MapEditor.Utils.coord(x1, y1, x2, y2);
		
		if(obj)
		{
			var old_tile = self.getTile(select1.value);
			var new_tile = self.getTile(select2.value);
			
			if(!old_tile || !new_tile) return false;
			
			self.replaceTileInRect(obj.x, obj.y, obj.w, obj.h, old_tile, new_tile);
		}
		
		return false;
	}
	buttons.appendChild(input);
	div.appendChild(buttons);
	
	this.Windows.show(eid, this.msg('replaceTile'), div);
	
}

MapEditor.prototype.doCopy = function(eid)
{
	this.Windows.close('copy');
	
	var self = this;
	var div =document.createElement('div');
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
		var tr = document.createElement('tr');
			var td = document.createElement('td');
				var label = document.createElement('strong');
					label.appendChild(document.createTextNode(this.msg('point1') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_copy_x1');
					label.appendChild(document.createTextNode(this.msg('x') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputX1 = document.createElement('input');
					inputX1.type = 'text';
					inputX1.id = 'ME_copy_x1';
				td.appendChild(inputX1);
			tr.appendChild(td);
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_copy_y1');
					label.appendChild(document.createTextNode(this.msg('y') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputY1 = document.createElement('input');
					inputY1.type = 'text';
					inputY1.id = 'ME_copy_y1';
				td.appendChild(inputY1);
			tr.appendChild(td);
		tbody.appendChild(tr);
		var tr = document.createElement('tr');
			var td = document.createElement('td');
				var label = document.createElement('strong');
					label.appendChild(document.createTextNode(this.msg('point2') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_copy_x2');
					label.appendChild(document.createTextNode(this.msg('x') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputX2 = document.createElement('input');
					inputX2.type = 'text';
					inputX2.id = 'ME_copy_x2';
				td.appendChild(inputX2);
			tr.appendChild(td);
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_copy_y2');
					label.appendChild(document.createTextNode(this.msg('y') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputY2 = document.createElement('input');
					inputY2.type = 'text';
					inputY2.id = 'ME_copy_y2';
				td.appendChild(inputY2);
			tr.appendChild(td);
		tbody.appendChild(tr);
		var tr = document.createElement('tr');
			var td = document.createElement('td');
				var label = document.createElement('strong');
					label.appendChild(document.createTextNode(this.msg('point3') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_copy_x3');
					label.appendChild(document.createTextNode(this.msg('x') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputX3 = document.createElement('input');
					inputX3.type = 'text';
					inputX3.id = 'ME_copy_x3';
				td.appendChild(inputX3);
			tr.appendChild(td);
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_copy_y3');
					label.appendChild(document.createTextNode(this.msg('y') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputY3 = document.createElement('input');
					inputY3.type = 'text';
					inputY3.id = 'ME_copy_y3';
				td.appendChild(inputY3);
			tr.appendChild(td);
		tbody.appendChild(tr);
	table.appendChild(tbody);
	div.appendChild(table);
	
	inputX1.value = '0';
	inputY1.value = '0';
	inputX2.value = self._width - 1;
	inputY2.value = self._height - 1;
	inputX3.value = '0';
	inputY3.value = '0';
	
	var buttons = document.createElement('div');
	var input = document.createElement('input');
	input.type = 'submit';
	input.id = 'ME_btnCopy';
	input.className = 'button';
	input.value = this.msg('copy');
	input.onclick = function() {
		var x1 = inputX1.value.toInt();
		var y1 = inputY1.value.toInt();
		var x2 = inputX2.value.toInt();
		var y2 = inputY2.value.toInt();
		
		var obj = MapEditor.Utils.coord(x1, y1, x2, y2);
		
		if(obj)
		{
			var x3 = inputX3.value.toInt();
			var y3 = inputY3.value.toInt();
			
			if(y3 == obj.y && x3 == obj.x) return false;
			
			self.copy(obj.x, obj.y, obj.w, obj.h, x3, y3);
		}
		return false
	}
	
	buttons.appendChild(input);
	div.appendChild(buttons);
	
	this.Windows.show(eid, this.msg('copy'), div);
}

MapEditor.prototype.doMove = function(eid)
{
	this.Windows.close('move');
	
	var self = this;
	var div =document.createElement('div');
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
		var tr = document.createElement('tr');
			var td = document.createElement('td');
				var label = document.createElement('strong');
					label.appendChild(document.createTextNode(this.msg('point1') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_move_x1');
					label.appendChild(document.createTextNode(this.msg('x') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputX1 = document.createElement('input');
					inputX1.type = 'text';
					inputX1.id = 'ME_move_x1';
				td.appendChild(inputX1);
			tr.appendChild(td);
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_move_y1');
					label.appendChild(document.createTextNode(this.msg('y') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputY1 = document.createElement('input');
					inputY1.type = 'text';
					inputY1.id = 'ME_move_y1';
				td.appendChild(inputY1);
			tr.appendChild(td);
		tbody.appendChild(tr);
		var tr = document.createElement('tr');
			var td = document.createElement('td');
				var label = document.createElement('strong');
					label.appendChild(document.createTextNode(this.msg('point2') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_move_x2');
					label.appendChild(document.createTextNode(this.msg('x') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputX2 = document.createElement('input');
					inputX2.type = 'text';
					inputX2.id = 'ME_move_x2';
				td.appendChild(inputX2);
			tr.appendChild(td);
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_move_y2');
					label.appendChild(document.createTextNode(this.msg('y') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputY2 = document.createElement('input');
					inputY2.type = 'text';
					inputY2.id = 'ME_move_y2';
				td.appendChild(inputY2);
			tr.appendChild(td);
		tbody.appendChild(tr);
		var tr = document.createElement('tr');
			var td = document.createElement('td');
				var label = document.createElement('strong');
					label.appendChild(document.createTextNode(this.msg('point3') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_move_x3');
					label.appendChild(document.createTextNode(this.msg('x') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputX3 = document.createElement('input');
					inputX3.type = 'text';
					inputX3.id = 'ME_move_x3';
				td.appendChild(inputX3);
			tr.appendChild(td);
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_move_y3');
					label.appendChild(document.createTextNode(this.msg('y') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputY3 = document.createElement('input');
					inputY3.type = 'text';
					inputY3.id = 'ME_move_y3';
				td.appendChild(inputY3);
			tr.appendChild(td);
		tbody.appendChild(tr);
	table.appendChild(tbody);
	div.appendChild(table);
	
	inputX1.value = '0';
	inputY1.value = '0';
	inputX2.value = self._width - 1;
	inputY2.value = self._height - 1;
	inputX3.value = '0';
	inputY3.value = '0';
	
	var buttons = document.createElement('div');
	var input = document.createElement('input');
	input.type = 'submit';
	input.id = 'ME_btnMove';
	input.className = 'button';
	input.value = this.msg('move');
	input.onclick = function() {
		var x1 = inputX1.value.toInt();
		var y1 = inputY1.value.toInt();
		var x2 = inputX2.value.toInt();
		var y2 = inputY2.value.toInt();
		
		var obj = MapEditor.Utils.coord(x1, y1, x2, y2);
		
		if(obj)
		{
			var x3 = inputX3.value.toInt();
			var y3 = inputY3.value.toInt();
			
			if(y3 == obj.y && x3 == obj.x) return false;
					
			self.copy(obj.x, obj.y, obj.w, obj.h, x3, y3, self._defaultTile);
		}
		
		return false
	}
	buttons.appendChild(input);
	div.appendChild(buttons);
	
	this.Windows.show(eid, this.msg('move'), div);
}

MapEditor.prototype.doFillArea = function(eid)
{
	this.Windows.close('fillarea');
	
	var self = this;
	var div =document.createElement('div');
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	
		var tr = document.createElement('tr');
			var td = document.createElement('td');
				td.colSpan = 2;
				var label = document.createElement('strong');
					label.appendChild(document.createTextNode(this.msg('tile') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				td.colSpan = 3;
				var select = this.generateTileSelect('ME_fillarea_tile');
				select.value = this._selectedTile.value;
				td.appendChild(select);
			tr.appendChild(td);
		tbody.appendChild(tr);
		var tr = document.createElement('tr');
			var td = document.createElement('td');
				var label = document.createElement('strong');
					label.appendChild(document.createTextNode(this.msg('point1') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_fillarea_x1');
					label.appendChild(document.createTextNode(this.msg('x') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputX1 = document.createElement('input');
					inputX1.type = 'text';
					inputX1.id = 'ME_fillarea_x1';
				td.appendChild(inputX1);
			tr.appendChild(td);
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_fillarea_y1');
					label.appendChild(document.createTextNode(this.msg('y') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputY1 = document.createElement('input');
					inputY1.type = 'text';
					inputY1.id = 'ME_fillarea_y1';
				td.appendChild(inputY1);
			tr.appendChild(td);
		tbody.appendChild(tr);
		var tr = document.createElement('tr');
			var td = document.createElement('td');
				var label = document.createElement('strong');
					label.appendChild(document.createTextNode(this.msg('point2') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_fillarea_x2');
					label.appendChild(document.createTextNode(this.msg('x') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputX2 = document.createElement('input');
					inputX2.type = 'text';
					inputX2.id = 'ME_fillarea_x2';
				td.appendChild(inputX2);
			tr.appendChild(td);
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_fillarea_x2');
					label.appendChild(document.createTextNode(this.msg('y') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputY2 = document.createElement('input');
					inputY2.type = 'text';
					inputY2.id = 'ME_fillarea_y2';
				td.appendChild(inputY2);
			tr.appendChild(td);
		tbody.appendChild(tr);
	table.appendChild(tbody);
	div.appendChild(table);
	
	inputX1.value = '0';
	inputY1.value = '0';
	inputX2.value = self._width - 1;
	inputY2.value = self._height - 1;
	
	var buttons = document.createElement('div');
	var input = document.createElement('input');
	input.type = 'submit';
	input.id = 'ME_btnFill';
	input.className = 'button';
	input.value = this.msg('fill');
	input.onclick = function() { 
		
		var x1 = inputX1.value.toInt();
		var y1 = inputY1.value.toInt();
		var x2 = inputX2.value.toInt();
		var y2 = inputY2.value.toInt();
		
		var obj = MapEditor.Utils.coord(x1, y1, x2, y2);
		
		if(obj)
		{
			var tile = self.getTile(select.value);
		
			if(!tile) return false;
			
			self.fillRect(obj.x, obj.y, obj.w, obj.h, tile);
		}
		
		return false;
	}
	buttons.appendChild(input);
	div.appendChild(buttons);
	
	this.Windows.show(eid, this.msg('fillArea'), div);
}

MapEditor.prototype.doMirrorArea = function(eid)
{
	this.Windows.close('mirror');

	var self = this;
	var div =document.createElement('div');
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	
		var tr = document.createElement('tr');
			var td = document.createElement('td');
				td.colSpan = 2;
				var label = document.createElement('strong');
					label.appendChild(document.createTextNode(this.msg('mirrorType') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				td.colSpan = 3;
				var select = document.createElement('select');
					var option = document.createElement('option');
					option.value = '1';
					option.appendChild(document.createTextNode(this.msg('horizontal')));
					select.appendChild(option);
					var option = document.createElement('option');
					option.value = '2';
					option.appendChild(document.createTextNode(this.msg('vertical')));
					select.appendChild(option);
					var option = document.createElement('option');
					option.value = '3';
					option.appendChild(document.createTextNode(this.msg('horizontalAndVertical')));
					select.appendChild(option);
				td.appendChild(select);
			tr.appendChild(td);
		tbody.appendChild(tr);
		var tr = document.createElement('tr');
			var td = document.createElement('td');
				var label = document.createElement('strong');
					label.appendChild(document.createTextNode(this.msg('point1') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_mirror_x1');
					label.appendChild(document.createTextNode(this.msg('x') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputX1 = document.createElement('input');
					inputX1.type = 'text';
					inputX1.id = 'ME_mirror_x1';
				td.appendChild(inputX1);
			tr.appendChild(td);
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_mirror_y1');
					label.appendChild(document.createTextNode(this.msg('y') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputY1 = document.createElement('input');
					inputY1.type = 'text';
					inputY1.id = 'ME_mirror_y1';
				td.appendChild(inputY1);
			tr.appendChild(td);
		tbody.appendChild(tr);
		var tr = document.createElement('tr');
			var td = document.createElement('td');
				var label = document.createElement('strong');
					label.appendChild(document.createTextNode(this.msg('point2') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_mirror_x2');
					label.appendChild(document.createTextNode(this.msg('x') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputX2 = document.createElement('input');
					inputX2.type = 'text';
					inputX2.id = 'ME_mirror_x2';
				td.appendChild(inputX2);
			tr.appendChild(td);
			var td = document.createElement('td');
				var label = document.createElement('label');
					label.setAttribute('for','ME_mirror_x2');
					label.appendChild(document.createTextNode(this.msg('y') + ' :'));
				td.appendChild(label);
			tr.appendChild(td);
			var td = document.createElement('td');
				var inputY2 = document.createElement('input');
					inputY2.type = 'text';
					inputY2.id = 'ME_mirror_y2';
				td.appendChild(inputY2);
			tr.appendChild(td);
		tbody.appendChild(tr);
	table.appendChild(tbody);
	div.appendChild(table);
	
	inputX1.value = '0';
	inputY1.value = '0';
	inputX2.value = self._width - 1;
	inputY2.value = self._height - 1;
	
	var buttons = document.createElement('div');
	var input = document.createElement('input');
	input.type = 'submit';
	input.id = 'ME_btnMirror';
	input.className = 'button';
	input.value = this.msg('flip');
	input.onclick = function() { 
		var x1 = inputX1.value.toInt();
		var y1 = inputY1.value.toInt();
		var x2 = inputX2.value.toInt();
		var y2 = inputY2.value.toInt();
		
		var obj = MapEditor.Utils.coord(x1, y1, x2, y2);
		
		if(obj)
		{
			var type = select.value.toInt();
			
			if(self.mirrorRect(obj.x, obj.y, obj.w, obj.h, type))
			{
				//self.Windows.close('mirror');
			}
		}
		return false;
	}
	buttons.appendChild(input);
	div.appendChild(buttons);
	
	this.Windows.show(eid, this.msg('mirror'), div);
}