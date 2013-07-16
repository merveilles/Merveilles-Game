MapEditor.Msg.EN.m_wall = 'Wall';
MapEditor.Msg.EN.m_add_wall1 = 'Wall (add1)';
MapEditor.Msg.EN.m_add_wall2 = 'Wall (add2)';
MapEditor.Msg.EN.m_hidden_wall = 'Hidden wall';
MapEditor.Msg.EN.m_invisible = 'Obstructed';
MapEditor.Msg.EN.m_water = 'Water';
MapEditor.Msg.EN.m_monster = 'Monster';
MapEditor.Msg.EN.m_stair_up = 'Stair up';
MapEditor.Msg.EN.m_stair_down = 'Stair down';
MapEditor.Msg.EN.m_raise = 'Raise point';
MapEditor.Msg.EN.m_stair_up_invisible = 'Stair up (invisible)';
MapEditor.Msg.EN.m_stair_down_invisible = 'Stair down (invisible)';

function MerveillesME_Init(id, data)
{
	var ME = new MapEditor(
		{
			container : id,
			width : 64,
			height : 64,
			pluginStylesheet : 'scripts/jsme/plugins/merveilles/style.css',
			pluginVersion : '1.1.0',
			pluginName : 'Merveilles jsME Plugin',
			pluginId : 'merveilles',
			pluginManualUrl : '',
			language : 'EN',
			isZoomable : true,
			isResizable : false,
			fileScriptPath : 'scripts/jsme/plugins/merveilles/file.php',
			imagesPath : 'scripts/jsme/plugins/merveilles/images/',
			tiles : [
				{ image : 'tile.gif', value : '0', isDefault : true },
				{ image : 'wall.gif', value : '1', label : 'm_wall' },
				{ image : 'add-wall-1.gif', value : '20', label : 'm_add_wall1' },
				{ image : 'add-wall-2.gif', value : '21', label : 'm_add_wall2' },
				{ image : 'empty.gif', value : '6', label : 'm_hidden_wall'},
				{ image : 'water.gif', value : '8', label : 'm_water'},
				{ image : 'hidden.gif', value : '7', label : 'm_invisible'},
				{ image : 'monster.gif', value : '2', label : 'm_monster' },
				{ image : 'raise.gif', value : '9', label : 'm_raise' },
				{ image : 'escalier-up.gif', value : '4', label : 'm_stair_up' },
				{ image : 'escalier-down.gif', value : '5', label : 'm_stair_down' },
				{ image : 'escalier-up.gif', value : '10', label : 'm_stair_up_invisible' },
				{ image : 'escalier-down.gif', value : '11', label : 'm_stair_down_invisible' }
			]
		}
	);
	
	var self = ME;
	
	ME.CustomFunctions['New'] = function()
	{
		self.fillMap(self.getTile('V'));
		return true;
	}
	
	ME.CustomFunctions['Fetch'] = function(tab, width, height)
	{
		var result = data.floor + ' ';
		
		for(var x = 63; x >= 0; x--)
		{
			for(var y = 63; y >= 0; y--)
			{
				result+= tab[y][x].value + ' ';
			}
		}

		self.outputText(result);
	};
	
	self.Toolbar.disableMenu('transform');
	self.Toolbar.disableOption('map', 'resize_container');
	self.Toolbar.disableOption('file', 'new');
	self.Toolbar.disableOption('file', 'exit');
	
	var rows = self.MapElement.getChildren('.jsME_map_row');
	var div = new Element('div', { 'class' : 'jsME_map_container', styles: { backgroundImage: 'url('+data.background+')' }});
	div.adopt(rows);
	self.MapElement.adopt(div);
	
	for(var y = 0, l = data.level.length; y < l; y++)
	{
		for(var x = 0, l = data.level[y].length; x < l; x++)
		{
			self.applyTileTo(self.getTile(data.level[y][x]), self.getMapImage((x - 63) * -1, (y - 63) * -1));
		}
	}
	
	self.resizeMapElement.delay(2000, self);
}
