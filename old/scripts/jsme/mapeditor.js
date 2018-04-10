function MapEditor(data)
{
	var self = this;
	
	MapEditor.Utils.loadCSS('scripts/jsme/default-style.css');
	
	if(data['pluginStylesheet'] != null)
	{
		MapEditor.Utils.loadCSS(data['pluginStylesheet']);
	}

	if (data['width'] == null || data['width'] < 1) data['width'] = 10;
	if (data['height'] == null || data['height'] < 1) data['height'] = 10;
	this._imagesPath = data['imagesPath'];
	this._height = data['height'];
	this._width = data['width'];
	
	this.CurrentLang = data['language'];
	
	this._tiles = new Array();
	this._paletteTiles = new Array();
	
	var l = data['tiles'].length;
	
	for(var x = 0; x < l; x++)
	{
		var tile = new METile(
			data['tiles'][x]['image'],
			data['tiles'][x]['value'],
			data['tiles'][x]['secondaryValue'],
			this.msg(data['tiles'][x]['label']),
			data['tiles'][x]['isSelectable'],
			data['tiles'][x]['layout']
		);
	
		this._tiles[tile.value] = tile;
		
		this._paletteTiles.push(tile);
		
		if(data['tiles'][x]['isDefault'] == true)
		{
			this._defaultTile = tile;
		}
	}
	
	this.Config = data['config'];
	
	if(this.Config)
	{
		this._isConfigurable = true;
		this._config = new Array();
		
		var l = this.Config.length;
		for(var x = 0; x < l; x++)
		{
			this._config[this.Config[x].id] = this.Config[x].defaultValue;
		}
	}
	else
	{
		this._isConfigurable = false;
	}
	
	this._fileScriptPath = data['fileScriptPath'];
	
	this._enableBrush = false;
	
	this._isZoomable = (data['isZoomable'] == true ? true : false);
	this._isResizable = (data['isResizable'] == true ? true : false);
	
	this._selectedTile = this._defaultTile;
	
	this.PluginName = data['pluginName'];
	this.PluginVersion = data['pluginVersion'];
	this.PluginId = data['pluginId'];
	this.PluginManualUrl = data['pluginManualUrl'];
	
	this.CustomVars = new Array();
	this.CustomFunctions = new Array();
	this.CustomFunctions['UnFetch'] = false;
	this.CustomFunctions['Save'] = false;
	this.CustomFunctions['PostBrush'] = false;
	this.CustomFunctions['PreBrush'] = false;
	this.CustomFunctions['ApplyConfig'] = false;
	this.CustomFunctions['New'] = false;
	this.CustomFunctions['Resize'] = false;
	this.CustomFunctions['Fetch'] = function(tab, width, height)
	{
		var result = '';
		var l = tab.length;
		for(var y = 0; y < l; y++)
		{
			var k = tab[y].length;
			for(var x = 0; x < k; x++)
			{
				if(x > 0) result+= ':';
				result+= tab[y][x].value;
			}
			result+='\r\n'
		}

		self.outputText(result);
	};
	
	this.Container = $(data['container']);

	this.append();
	this.Windows = new Window(this.msg('close'));
	this.generateOutput('toolbar_file_fetch');
	
	window.addEvent('resize', this.resizeMapElement.bind(this));
}

MapEditor.prototype.Container;

MapEditor.prototype.Map;

MapEditor.prototype.CustomVars;
MapEditor.prototype.CustomFunctions;
MapEditor.prototype.Windows;
MapEditor.prototype.MapElement;
MapEditor.prototype.Toolbar;
MapEditor.prototype.Config;

MapEditor.prototype._tiles;
MapEditor.prototype._mapImages;
MapEditor.prototype._paletteTiles;
MapEditor.prototype._defaultTile;

MapEditor.prototype._fileScriptPath;
MapEditor.prototype._imageScriptPath;
MapEditor.prototype._imagesPath;
MapEditor.prototype._width;
MapEditor.prototype._height;
MapEditor.prototype._selectedTile;

MapEditor.prototype._enableLog = true;

MapEditor.prototype._outputContainer;
MapEditor.prototype._element;


MapEditor.prototype._brushOverEnable;

//VERSION
MapEditor.prototype.Version = '2.0.0';

//PLUGIN
MapEditor.prototype.PluginVersion;
MapEditor.prototype.PluginName;
MapEditor.prototype.PluginId;
MapEditor.prototype.PluginManualUrl;

/* custom functions */
MapEditor.prototype._selectMode;
MapEditor.prototype._isZoomable;
MapEditor.prototype._isConfigurable;
MapEditor.prototype._haveLayout;

MapEditor.prototype.CurrentLang = 'FR';

MapEditor.prototype.doExit = function()
{
	var url = '/' + this.CurrentLang.toLowerCase() + '/';
	document.location.href = url;
}

MapEditor.prototype.resizeMapElement = function()
{
	var size = this.Container.getSize();
	var coord = this.MapElement.getCoordinates();
	this.MapElement.style.height = (size.y - coord.top) + 'px';
}

MapEditor.prototype.log = function(msg)
{
	if(!this._enableLog) return;
	var body = document.getElementsByTagName('body')[0];
	var div = document.createElement('div');
	div.className = 'jsME_log';
	div.appendChild(document.createTextNode(msg))
	body.appendChild(div);
}

MapEditor.prototype.changeLang = function(id)
{
	if(id != this.CurrentLang)
	{
		this.CurrentLang = id;
		this.Toolbar.element.parentNode.removeChild(this.Toolbar.element);
		this.Toolbar = null;
		this.Windows.clear();
		
		this._element.parentNode.removeChild(this._element);
		this.append();
		
		this.Windows = new Window(this.Container, this.msg('close'), this.msg('move'), this.msg('resize'));
		this.generateOutput();
	}
}

MapEditor.prototype.msg = function(id)
{
	if(id)
	{
		if(MapEditor.Msg[this.CurrentLang])
		{
			var m = (MapEditor.Msg[this.CurrentLang][id]);
			if(m) return m;
		}
		
		this.log('NOT TRANSLATED >> ' + id);
		return '{' + id + '}';
	}
}

MapEditor.prototype.applyCSSClass = function(id, value)
{
	this._element.className = this._element.className.replace(new RegExp('jsME_' + id + '_[a-zA-Z0-9]{1,}'),'');
	this._element.className+= ' jsME_' + id + '_' + value;
}

MapEditor.prototype.doFetch = function()
{
	this.disableBrushOver();
	if(this.CustomFunctions['Fetch'])
	{
		this.CustomFunctions['Fetch'](this.Map, this._width, this._height);
	}
}

MapEditor.prototype.doGeneralHelp = function(eid)
{
	this.Windows.showAjax(eid, this.msg('generalHelp'), 'mapeditor/test.html');
}

MapEditor.prototype.doUnfetch = function()
{
	this.disableBrushOver();
	if(this.CustomFunctions['UnFetch'])
	{
		this.CustomFunctions['UnFetch'](this.Map, this._width, this._height);
	}
}

MapEditor.prototype.doNew = function()
{
	//execute custom function, or refresh the page
	if(!this.CustomFunctions['New'] || !this.CustomFunctions['New']())
	{
		this.fillMap(this._defaultTile);
	}
}

MapEditor.prototype.doSave = function()
{
	this.disableBrushOver();
	this.doFetch();
	
	if(!this.CustomFunctions['Save'] || this.CustomFunctions['Save']() != false)
	{
		var form = this._element;
		if(form != null)
		{
			var query = '?' + Hash.toQueryString({width: this._width, height: this._height})
			if(this._config != null) query+= '&' + Hash.toQueryString(this._config);
			
			form.action = this._fileScriptPath + query;
			form.submit();
		}
	}
	
	return false;
}

MapEditor.prototype.selectTile = function(value)
{
	this.disableBrushOver();
	this._selectedTile = this.getTile(value);
	
	this.refreshSelectedTile();
}

MapEditor.prototype.refreshSelectedTile = function()
{
	var l = this._paletteTiles.length;
	for(var x = 0; x < l; x++)
	{
		if (this._paletteTiles[x] == this._selectedTile) this._paletteTiles[x].paletteElement.className = 'tile selectedTile';
		else this._paletteTiles[x].paletteElement.className = 'tile';
	}
}

MapEditor.prototype.getTile = function(value)
{
	return this._tiles[value];
}

MapEditor.prototype.brush = function(el, tile, alertless)
{
	if(el != null && el.tagName.toLowerCase() == 'img' && this._selectedTile != null)
	{
		if(!tile) tile = this._selectedTile;
		
		var pos = el.id.split('_');
		var y = Number(pos[1]);
		var x = Number(pos[2]);
		
		if (!this.CustomFunctions['PreBrush'] || this.CustomFunctions['PreBrush'](tile, this.Map, x, y, alertless))
		{	
			this.applyTileTo(tile, el, x, y);
			if(this.CustomFunctions['PostBrush']) this.CustomFunctions['PostBrush'](tile, this.Map, x, y, alertless);
		}
	}
}

MapEditor.prototype.applyTileTo = function(tile, el, x, y)
{
	if(tile == null || el == null) return;
	
	//Get X and Y coordinates if they weren't given
	if (x == null || y == null)
	{
		var pos = el.id.split('_');
		y = parseInt(pos[1]);
		x = parseInt(pos[2]);
	}
	
	if(tile != this.Map[y][x])
	{
		el.src = this._imagesPath + tile.image;
		if(this.Map[y][x]) this.Map[y][x].countInMap--;
		this.Map[y][x] = tile;
		tile.countInMap++;
		
		var label = tile.label;
		if(label != null)
			el.title = x + ':' + y + ' > ' + label;
		else
			el.title = x + ':' + y;
	}
}

MapEditor.prototype.getMapTile = function(x, y)
{
	return this.Map[y][x];
}

MapEditor.prototype.getMapImage = function(x, y)
{
	return this._mapImages[y][x];
}

MapEditor.prototype.brushOver = function(el)
{
	if(this._brushOverEnable == true)
	{
		this.brush(el);
	}
}

MapEditor.prototype.switchZoom = function()
{
	var zoom_div = document.getElementById('jsME_zoom');
	if (zoom_div.className.indexOf('jsME_zoom1') > -1)
	{
		zoom_div.className = zoom_div.className.replace('jsME_zoom1','jsME_zoom2');
	}
	else
	{
		zoom_div.className = zoom_div.className.replace('jsME_zoom2','jsME_zoom1');
	}
	
	this.resizeMapElement.delay(1000, this);
}

MapEditor.prototype.showTileInPalette = function(tile)
{
	var tile = this.getTile(tile);
	tile.paletteElement.style.display = 'inline';
}

MapEditor.prototype.hideTileInPalette = function(tile)
{
	var tile = this.getTile(tile);
	tile.paletteElement.style.display = 'none';
}

MapEditor.prototype.switchBrushOver = function()
{
	this._brushOverEnable = !this._brushOverEnable;
}

MapEditor.prototype.enableBrushOver = function()
{
	this._brushOverEnable = true;
	return false;
}

MapEditor.prototype.disableBrushOver = function()
{
	this._brushOverEnable = false;
	return false;
}

MapEditor.prototype.countTileInMap = function(tileValue)
{
	var tile = this.getTile(tileValue);
	return tile.countInMap;
}

MapEditor.prototype.showFetch = function(eid)
{
	this.Windows.show(eid);
}

MapEditor.prototype.applyConfig = function()
{
	var l = this.Config.length;
	for(var x = 0; x < l; x++)
	{
		var c = this.Config[x];
		var el = document.getElementById('ME_config_' + c.id);
		if(c.type == 'text')
		{
			this._config[c.id] = el.value;
		}
		else if(c.type == 'choice')
		{
			this._config[c.id] = el.value;
		}
		else if(c.type == 'check')
		{
			this._config[c.id] = el.checked;
		}
	}
	
	if(this.CustomFunctions['ApplyConfig'])
	{
		this.CustomFunctions['ApplyConfig'](this._config);
	}
}

MapEditor.prototype.doConfig = function()
{
	if(this.Windows.exists('config'))
	{
		this.Windows.show('config');
	}
	else
	{
		this.generateConfig('config');
	}
	
	var l = this.Config.length;
	
	for(var x = 0; x < l; x++)
	{
		var c = this.Config[x];
		var el = document.getElementById('ME_config_' + c.id);
		if(c.type == 'text')
		{
			el.value = this._config[c.id];
		}
		else if(c.type == 'check')
		{
			el.checked = (this._config[c.id] == true);
		}
		else if(c.type == 'choice')
		{
			el.value = this._config[c.id];
		}
	}
}

MapEditor.prototype.outputText = function(text, append)
{
	if(append != null && append == true)
	{
		this._outputContainer.value = this._outputContainer.value + '\r\n' + text;
	}
	else
	{
		this._outputContainer.value = text;
	}
}

MapEditor.prototype.doResize = function()
{
	if(this.Windows.exists('resize'))
	{
		this.Windows.show('resize');
	}
	else
	{
		this.generateResize('resize');
	}
	
	var elH = document.getElementById('ME_resize_height');
	var elW = document.getElementById('ME_resize_width');
	elH.value = this._height;
	elW.value = this._width;
	var func = function() { elW.focus(); }
	func.delay(100);
}



MapEditor.Utils = 
{
	_head : null,
	loadJS : function(js)
	{
		if(this._head == null) this._head = document.getElementsByTagName('head')[0];
		
		var script = document.createElement('script');
		script.setAttribute('type','text/javascript');
		script.setAttribute('src',js);
		
		this._head.appendChild(script);
	},
	loadCSS : function(css)
	{
		if(this._head == null) this._head = document.getElementsByTagName('head')[0];
		
		var style = document.createElement('link');
		style.type = 'text/css';
		style.rel = 'stylesheet';
		style.href = css;
		
		this._head.appendChild(style);
	},
	coord : function(x1, y1, x2, y2)
	{
		if(
			isNaN(x1) || isNaN(y1) ||
			y1 < 0 || x1 < 0 ||
			y1 > this._height || x1 > this._width ||
			isNaN(x2) || isNaN(y2) ||
			y2 > this._height || x2 > this._width) return false;
		
		var obj = {
			x : null,
			y : null,
			w : null,
			h : null
		}
	
		if(x1 > x2)
		{
			obj.x = x2;
			obj.w = 1 + x1 - x2;
		}
		else
		{
			obj.x = x1;
			obj.w = 1 + x2 - x1;
		}
		
		if(y1 > y2)
		{
			obj.y = y2;
			obj.h = 1 + y1 - y2;
		}
		else
		{
			obj.y = y1;
			obj.h = 1 + y2 - y1;
		}
		
		return obj;
	}
}

MapEditor.Msg = {}

MapEditor.Msg.FR = {
	generalHelp : 'Aide générale',
	empty : 'Vide',
	file : 'Fichier',
	exit : 'Fermer l\'éditeur',
	neww : 'Nouvelle carte',
	fetchUnfetch : 'Fetch / Unfetch',
	fetch : 'Fetch',
	unfetch : 'Unfetch',
	saveAs : 'Enregistrer',
	map : 'Carte',
	zoom : 'Zoom',
	resize : 'Redim.',
	config : 'Configuration',
	help : 'Aide',
	editorManual : 'Manuel de l\'éditeur',
	about : 'A propos...',
	transform : 'Transform.',
	copy : 'Copier',
	apply : 'Appliquer',
	replace : 'Remplacer',
	move : 'Déplacer',
	fillArea : 'Remplir',
	mirrorArea : 'Retourner',
	horizMirrorMap : 'Retourner horizontalement',
	vertiMirrorMap : 'Retourner verticalement',
	horizontal : 'Horizontal',
	vertical : 'Vertical',
	horizontalAndVertical : 'Horizontal & Vertical',
	mirror : 'Retourner',
	mirrorType : 'TYPE',
	flip : 'Flip',
	website : 'site web',
	version : 'version',
	y : 'Y',
	x : 'X',
	point1 : 'POINT 1',
	point2 : 'POINT 2',
	point3 : 'POINT 3',
	fill : 'Remplir',
	tile : 'TILE',
	replaceTile : 'Remplacer un tile',
	tileToReplace : 'ANCIENNE TILE',
	tileToReplaceWith : 'NOUVELLE TILE',
	width : 'Largeur',
	height : 'Hauteur',
	close : 'Fermer',
	language : 'Langage',
	resizeContainer : 'Adapter l\'éditeur à la fenêtre'
};

MapEditor.Msg.EN = {
	generalHelp : 'General help',
	empty : 'Empty',
	file : 'File',
	neww : 'New',
	exit : 'Exit editor',
	fetchUnfetch : 'Fetch / Unfetch',
	fetch : 'Fetch',
	unfetch : 'Unfetch',
	fromClipboard : 'From clipboard',
	toClipboard : 'To clipboard',
	notImplemented : 'Not implemented, yet.',
	saveAs : 'Save as',
	serverSave : 'Test Image',
	map : 'Map',
	zoom : 'Zoom',
	resize : 'Resize',
	config : 'Config',
	help : 'Help',
	editorManual : 'Editor manual',
	about : 'About...',
	transform : 'Transform',
	copy : 'Copy',
	apply : 'Apply',
	replace : 'Replace',
	move : 'Move',
	fillArea : 'Fill area',
	mirrorArea : 'Mirror area',
	horizMirrorMap : 'Horizontal mirror map',
	vertiMirrorMap : 'Vertical mirror map',
	horizontal : 'Horizontal',
	vertical : 'Vertical',
	horizontalAndVertical : 'Horizontal & Vertical',
	mirror : 'Mirror',
	mirrorType : 'Mirror type',
	flip : 'Flip',
	website : 'website',
	version : 'version',
	y : 'Y',
	x : 'X',
	point1 : 'POINT 1',
	point2 : 'POINT 2',
	point3 : 'POINT 3',
	fill : 'Fill',
	tile : 'Tile',
	replaceTile : 'Replace tile',
	tileToReplace : 'OLD TILE',
	tileToReplaceWith : 'NEW TILE',
	width : 'Width',
	height : 'Height',
	close : 'Close',
	language : 'Language',
	resizeContainer : 'Fit editor\'s size'
};

MapEditor.Msg.JP = {
	generalHelp : 'General help',
	empty : 'Empty',
	file : 'File',
	exit : 'Exit editor',
	neww : 'New',
	fetchUnfetch : 'Fetch / Unfetch',
	fetch : 'Fetch',
	unfetch : 'Unfetch',
	fromClipboard : 'From clipboard',
	toClipboard : 'To clipboard',
	notImplemented : 'Not implemented, yet.',
	saveAs : 'Save as',
	serverSave : 'Test Image',
	map : 'Map',
	zoom : 'Zoom',
	resize : 'Resize',
	config : 'Config',
	help : 'Help',
	editorManual : 'Editor manual',
	about : 'About...',
	transform : 'Transform',
	copy : 'Copy',
	apply : 'Apply',
	replace : 'Replace',
	move : 'Move',
	fillArea : 'Fill area',
	mirrorArea : 'Mirror area',
	horizMirrorMap : 'Horizontal mirror map',
	vertiMirrorMap : 'Vertical mirror map',
	horizontal : 'Horizontal',
	vertical : 'Vertical',
	horizontalAndVertical : 'Horizontal & Vertical',
	mirror : 'Mirror',
	mirrorType : 'Mirror type',
	flip : 'Flip',
	website : 'website',
	version : 'version',
	y : 'Y',
	x : 'X',
	point1 : 'POINT 1',
	point2 : 'POINT 2',
	point3 : 'POINT 3',
	fill : 'Fill',
	tile : 'Tile',
	replaceTile : 'Replace tile',
	tileToReplace : 'OLD TILE',
	tileToReplaceWith : 'NEW TILE',
	width : 'Width',
	height : 'Height',
	close : 'Close',
	language : 'Language',
	resizeContainer : 'Fit editor\'s size'
};