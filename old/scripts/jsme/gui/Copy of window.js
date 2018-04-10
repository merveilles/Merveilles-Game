/*
 * Extend Highslide !
 */
hs.initDom = function(graphicsDir, closeLbl, moveLbl, resizeLbl, outline)
{
	hs.graphicsDir = graphicsDir;
	hs.outlineType = (outline ? outline : 'rounded-white');
	hs.openerTagNames = [];
	hs.wrapperClassName = 'draggable-header';
	hs.allowSizeReduction = false;
	hs.preserveContent = true;
	hs.showCredits = false;
	hs.cacheAjax = false;
	hs.allowMultipleInstances = false;
	
	hs.expandDom = function(a, title, node, resizeable)
	{
		if(!hs.cacheBindings) hs.cacheBindings = new Array();
		var content = hs.getCacheBinding(a);
		
		if(content)
		{
			hs.htmlExpand(a);
		}
		else
		{
			var i = hs.cacheBindings.length;
			hs.cacheBindings[i] = new Array();
			hs.cacheBindings[i][0] = a;
			
			var div = document.createElement('div');
			div.className = 'highslide-dom';
			
			var divH = document.createElement('div');
			divH.className = 'highslide-header';
			
				var ul = document.createElement('ul');
	
					var li = document.createElement('li');
					li.className = 'highslide-move';
					
				ul.appendChild(li);
					
					li = document.createElement('li');
					li.className = 'highslide-close';
						var ah = document.createElement('a');
						ah.href = '#';
						ah.title = closeLbl;
						ah.onclick = function() { return hs.close(this); }
							var span = document.createElement('span');
							span.appendChild(document.createTextNode(closeLbl));
						ah.appendChild(span);
					li.appendChild(ah);
					
				ul.appendChild(li);
	
			divH.appendChild(ul);
			
			var divB = document.createElement('div');
			divB.className = 'highslide-body';
			
			if(node.style.width)
			{
				div.style.width = node.style.width;
				node.style.width = 'auto';
			}
	
			divB.appendChild(node);
			
			div.appendChild(divH);
			div.appendChild(divB);
			
			if(resizeable)
			{
				var divF = document.createElement('div');
				divF.className = 'highslide-footer';
					var divF2 = document.createElement('div');
						span = document.createElement('span');
						span.className = 'highslide-resize';
						span.title = resizeLbl;
							span2 = document.createElement('span');
						span.appendChild(span2);
					divF2.appendChild(span);
				divF.appendChild(divF2);
				
				div.appendChild(divF);
			}
			
			hs.cacheBindings[i][1] = div;
			
			hs.htmlExpand(a, { headingText: title, align: 'center' });
			
			return div;
		}
	}
}

function Window(closeLabel, moveLabel, resizeLabel)
{
	this.windows = [];
	hs.initDom('scripts/jsme/gui/highslide/graphics/', closeLabel, moveLabel, resizeLabel);
}

Window.prototype.windows;

Window.prototype.show = function(id, title, content, fixed)
{
	if(title == null || content == null)
	{
		hs.expandDom($(id));
	}
	else
	{
		var self = this;
		var div = document.createElement('div');
		div.style.width = '425px';
		div.appendChild(content);
		
		this.windows[id] = hs.expandDom($(id), title, div, !fixed);
	}
}

Window.prototype.close = function(id)
{
	hs.close(this.windows[id]);
}

Window.prototype.exists = function(id)
{
	return (this.windows[id] != null);
}