var jsMEMavDialog = new Class({
	Extends: MavDialog,
	close: function()
	{
		this.hide();
		this.toggleShade();
	}
});

function Window(closeLabel, moveLabel, resizeLabel)
{
	
}

Window.prototype.windows = {};

Window.prototype.show = function(id, title, content, fixed)
{
	if(title == null || content == null)
	{
		this.windows[id].show();
	}
	else
	{
		content.className = 'content';
		
		this.windows[id] = new jsMEMavDialog({
			'force': true,
			'title': title,
			'width': '425',
			'message': content
		});
	}
}

Window.prototype.close = function(id)
{
	this.windows[id].close();
}

Window.prototype.exists = function(id)
{
	return (this.windows[id] != null);
}