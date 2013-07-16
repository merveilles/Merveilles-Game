MapEditor.prototype.resizeMap = function(w, h)
{
	if(w != this._width || h != this._height)
	{
		if(this.CustomFunctions['Resize'] && !this.CustomFunctions['Resize'](w, h)) return false;
		
		this._height = h;
		this._width = w;
		
		var map = document.getElementById('ME_map');
		
		var parent = map.parentNode;
		
		var newMap = this.generateMap();

		var l = this.Map.length;
		for(var x = 0; x < l && x < this._height; x++)
		{
			var k = this.Map[x].length;
			for(var y = 0; y < k && y < this._width; y++)
			{
				this.applyTileTo(this.Map[x][y], this.getMapImage(y, x));
			}
		}
		
		parent.removeChild(map);
		parent.appendChild(newMap, map);
		this.MapElement = newMap;
	}
	
	this.resizeMapElement.delay(1000, this);
	
	return true;
}

MapEditor.prototype.replaceTileInMap = function(oldtile, newtile)
{
	this.replaceTileInRect(0, 0, this._width, this._height, oldtile, newtile);
}


MapEditor.prototype.replaceTileInRect = function(x, y, w, h, oldtile, newtile)
{
	var limitX = x + w;
	limitX.limit(0, this._width);
	var limitY = y + h;
	limitY.limit(0, this._height);
	
	for(var yy = y; yy < limitY; yy++)
	{
		for(var xx = x; xx < limitX; xx++)
		{
			if(this.Map[yy][xx].secondaryValue == oldtile.secondaryValue) this.brush(this.getMapImage(xx, yy), newtile, true);
		}
	}
}

MapEditor.prototype.mirrorMap = function(type)
{
	this.mirrorRect(0,0,this._width, this._height, type);
}

MapEditor.prototype.mirrorRect = function(x, y, w, h, type)
{
	var limitX = x + w;
	limitX.limit(0, this._width);
	var limitY = y + h;
	limitY.limit(0, this._height);
	
	var cache = new Array();
	
	for(var yy = y; yy < limitY; yy++)
	{
		cache[yy] = new Array();
		for(var xx = x; xx < limitX; xx++)
		{
			cache[yy][xx] = this.getMapTile(xx, yy);
			this.applyTileTo(this._defaultTile, this.getMapImage(xx, yy));
		}
	}
	
	for(var yy = y; yy < limitY; yy++)
	{
		for(var xx = x; xx < limitX; xx++)
		{
			var newY = yy;
			var newX = xx;
			switch(type)
			{
				case 1:
					newX = limitX - (xx + 1);
					break;
				case 2:
					newY = limitY - (yy + 1);
					break;
				default:
					newX = limitX - (xx + 1);
					newY = limitY - (yy + 1);
					break;
			}
	
			this.applyTileTo(cache[yy][xx], this.getMapImage(newX, newY));
			//if(this.CustomFunctions['PostBrush']) this.CustomFunctions['PostBrush'](cache[yy][xx], this.Map, newX, newY);
		}
	}
}

MapEditor.prototype.fillRect = function(x, y, w, h, tile)
{
	var limitX = x + w;
	limitX.limit(0, this._width);
	var limitY = y + h;
	limitY.limit(0, this._height);
	
	for(var yy = y; yy < limitY; yy++)
	{
		for(var xx = x; xx < limitX; xx++)
		{
			this.applyTileTo(tile, this.getMapImage(xx, yy));
		}
	}
	
	return true;
}

MapEditor.prototype.fillMap = function(tile)
{
	this.fillRect(0,0,this._width, this._height, tile);
}

MapEditor.prototype.copy = function(x, y, w, h, x2, y2, replacementTile)
{
	var limitX = x + w;
	limitX.limit(0, this._width);
	var limitY = y + h;
	limitY.limit(0, this._height);
	
	x2 = x2.limit(0, this._width);
	y2 = y2.limit(0, this._width);
	
	var cache = new Array();
	
	for(var yy = y; yy < limitY; yy++)
	{
		cache[yy] = new Array();
		for(var xx = x; xx < limitX; xx++)
		{
			cache[yy][xx] = this.getMapTile(xx, yy);
			if(replacementTile != null) this.applyTileTo(replacementTile, this.getMapImage(xx, yy));
		}
	}
	
	var diffX = x2 - x;
	var diffY = y2 - y;
	limitX = x2 + w;
	limitX.limit(0, this._width);
	limitY = y2 + h;
	limitY.limit(0, this._height);
	
	for(var yy = y2; yy < limitY && yy < this._height; yy++)
	{
		for(var xx = x2; xx < limitX && xx < this._width; xx++)
		{
			this.applyTileTo(cache[(yy - diffY)][(xx - diffX)], this.getMapImage(xx, yy));
		}
	}
}