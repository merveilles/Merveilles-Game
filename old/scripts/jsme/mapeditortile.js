function METile(img, value, secondaryValue, label, isSelectable, layout) 
{
	this.image = img;
	this.value = value;
	this.secondaryValue = secondaryValue || value;
	this.label = label;
	this.isSelectable = (isSelectable == false ? false : true);
	this.countInMap = 0;
	this.layout = layout;
}

METile.prototype.image;
METile.prototype.value;
METile.prototype.secondaryValue;
METile.prototype.label;
METile.prototype.isSelectable;
METile.prototype.countInMap;
METile.prototype.paletteElement;
METile.prototype.layout;