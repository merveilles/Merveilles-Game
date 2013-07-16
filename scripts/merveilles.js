var Merveilles = {

	/* data */
	map: [],
	players: [],
	monsters: [],
	status: { x: 0, y: 0, xp: null, percentXp: null, level: null, hp: null, mp: null },
	
	viewport: { x: 17, y: 17, middleX: 8, middleY: 8 },
	
	/* elements */
	elementPosition: null,
	elementXPText: null,
	elementXPBar: null,
	elementLevelText: null,
	elementHP: null,
	elementMP: null,
	elementEquipText: null,
	elementNav: null,
	
	elementMessage: null,
	
	elementPlayerChatMessage: null,
	elementPlayerChat: null,
	elementPlayer: null,
	elementGround: null,
	elementMap: null,
	
	/* internal */
	directions:
	{
		left: 0,
		right: 0,
		up: 0,
		down: 0
	},
	timer: null,
	refreshTimer: null,
	eventTimer: null,
	requestEnable: true,
	messageOpened: false,
	messageStack: [],
	flipped: false,
	isDead: false,
	
	currentEvent: null,
	moved: false,
	updateWithoutMove: 0,
	
	setViewport: function(x, y)
	{
		this.viewport = {
			'x' : (x < 17 ? 17 : x),
			'y' : y,
			'middleX' : Math.floor(x / 2),
			'middleY' : Math.floor(y / 2)
		};
	},
	log: function(item)
	{
		//if(console && console.log) console.log(item);
	},
	init: function(data)
	{
		var width = (this.viewport.x * 16);
		var height = (this.viewport.y * 16);
		
		var body = $('body');
		body.addClass('dimension' + this.viewport.x + 'x' + this.viewport.y);
		this.elementPosition = new Element('div', { 'id' : 'position' });
		body.adopt(this.elementPosition);
		
		var statusDiv = new Element('div', { 'id' : 'status' });
		
			var table = new Element('table');
			
				var tr = new Element('tr');
				
					this.elementLevelText = new Element('td');
					tr.adopt(this.elementLevelText);
					
					this.elementXPText = new Element('td');
					tr.adopt(this.elementXPText);
					
					var td = new Element('td', { 'valign' : 'top', 'width' : '50px' });
						var bar = new Element('div', { 'class' : 'bar' });
							this.elementXPBar = new Element('div', { 'class' : 'xp' });
							bar.adopt(this.elementXPBar);
						td.adopt(bar);
					tr.adopt(td);
					
				table.adopt(tr);
				
				tr = new Element('tr');
				
					td = new Element('td');
						td.adopt(this.generateText('hp'));
					tr.adopt(td);
					
					this.elementHPText = new Element('td');
					tr.adopt(this.elementHPText);
					
					td = new Element('td', { 'valign' : 'top', 'width' : '50px' });
						bar = new Element('div', { 'class' : 'bar' });
							this.elementHPBar = new Element('div', { 'class' : 'hp' });
							bar.adopt(this.elementHPBar);
						td.adopt(bar);
					tr.adopt(td);
					
				table.adopt(tr);
				
				tr = new Element('tr');
				
					td = new Element('td');
						td.adopt(this.generateText('mp'));
					tr.adopt(td);
					
					this.elementMPText = new Element('td');
					tr.adopt(this.elementMPText);
					
					td = new Element('td', { 'valign' : 'top', 'width' : '50px' });
						bar = new Element('div', { 'class' : 'bar' });
							this.elementMPBar = new Element('div', { 'class' : 'mp' });
							bar.adopt(this.elementMPBar);
						td.adopt(bar);
					tr.adopt(td);
					
				table.adopt(tr);
				
			statusDiv.adopt(table);


			avatar = new Element('div', { 'id' : 'avatar' });

			statusDiv.adopt(avatar);
			
		body.adopt(statusDiv);
		
		this.elementGround = new Element('div', { 'id' : 'ground', 'style' : 'width: ' + width + 'px; height: ' + height + 'px' });
			this.elementHome = new Element('div', { 'id' : 'home' });
				this.elementNav = new Element('div', { 'id' : 'nav' });
					var div = new Element('div');
						this.elementPlayer = new Element('a', {
							'class' : 'starter',
							'href' : '#',
							'style' : 'top: ' + (height / 2 - 8) + 'px; left: ' + (width / 2 - 8) + 'px',
							'events' : { 'click' : function() { this.blur(); Merveilles.fireEvent('c'); return false; } }
						});
						
						this.elementPlayer.adopt(new Element('div', { 'class' : 'playerShadow' }));
						this.elementPlayer.adopt(new Element('div', { 'class' : 'playerHead', 'style' : 'background-position: 0px ' + (data.status.avatarHead * 8) + 'px'  }));
						this.elementPlayer.adopt(new Element('div', { 'class' : 'playerBody', 'style' : 'background-position: -16px ' + (data.status.avatarBody * 8) + 'px' }));
						
						div.adopt(this.elementPlayer);
						
						this.elementPlayerChat = new Element('div', {
							'class' : 'test',
							'style' : 'position:absolute; top:' + (height / 2 - 24) + 'px; left:' + (width / 2 - 12) + 'px; z-index:11;'
						});
						
						this.elementPlayerChatMessage = new Element('div', {
							'class' : 'test2',
							'style' : 'position:absolute; width:24px; height:6px; background-color:#fff; padding:2px 0px 2px 2px; z-index:11;'
						});
						
						this.elementPlayerChat.adopt(this.elementPlayerChatMessage);
						
						this.elementPlayerChat.adopt(new Element('div', {
							'class' : 'test2',
							'style' : 'position:absolute; width:2px; height:2px; position:absolute; background:#fff; top:10px; left:4px; z-index:11;'
						}));
						
						div.adopt(this.elementPlayerChat);
						
						var arrow = new Element('a', {
							'class' : 'arr_right',
							'href' : '#',
							'events' : {
								'mousedown' : function() {
									this.blur();
									Merveilles.fireEvent('right');
								},
								'mouseup' : function() {
									this.blur();
									Merveilles.fireEvent('stop', 'right');
								}
							}
						});
						div.adopt(arrow);
						
						arrow = new Element('a', {
							'class' : 'arr_left',
							'href' : '#',
							'events' : {
								'mousedown' : function() {
									this.blur();
									Merveilles.fireEvent('left');
								},
								'mouseup' : function() {
									this.blur();
									Merveilles.fireEvent('stop', 'left');
								}
							}
						});
						div.adopt(arrow);
						
						arrow = new Element('a', {
							'class' : 'arr_up',
							'href' : '#',
							'events' : {
								'mousedown' : function() {
									this.blur();
									Merveilles.fireEvent('up');
								},
								'mouseup' : function() {
									this.blur();
									Merveilles.fireEvent('stop', 'up');
								}
							}
						});
						div.adopt(arrow);
						
						arrow = new Element('a', {
							'class' : 'arr_down',
							'href' : '#',
							'events' : {
								'mousedown' : function() {
									this.blur();
									Merveilles.fireEvent('down');
								},
								'mouseup' : function() {
									this.blur();
									Merveilles.fireEvent('stop', 'down');
								}
							}
						});
						div.adopt(arrow);
						
					this.elementNav.adopt(div);
					
				this.elementHome.adopt(this.elementNav);
				
					this.elementMap = new Element('div', { 'id' : 'map' });
					
				this.elementHome.adopt(this.elementMap);
					
			this.elementGround.adopt(this.elementHome);
		body.adopt(this.elementGround);
	
		//generate window element
		this.Window.init(this);
		
		//generate message element
		this.elementMessage = new Element('div', { 'class' : 'message hide', 'style' : 'padding: 8px 8px' });
		this.elementNav.adopt(this.elementMessage);
		
		//generate chat element
		this.Chat.init(this);
		
		//generate key events
		window.addEvent('keydown', function(e) {
			if(this.currentEvent != e.key) this.fireEvent(e.key);
		}.bindWithEvent(this));
		
		window.addEvent('keyup', function(e) {
			this.fireEvent('stop', e.key);
		}.bindWithEvent(this));
		
		this.elementGround.className = 'level' + Math.floor(this.status.level / 10) + '0 floor' + this.status.floor;
		
		this.refresh(data);
		
		this.timer = this.update.delay(4000, this);
	},
	showMessage: function(dom)
	{
		this.elementMessage.empty();
		this.messageOpened = true;
		this.elementMessage.adopt(dom);
		this.elementMessage.removeClass('hide');
	},
	hideMessage: function()
	{
		this.elementMessage.addClass('hide');
		this.messageOpened = false;
	},
	refresh: function(data, noVisualReresh)
	{
		if(this.Chat.opened || this.Window.opened) return;
		
		var oldStatus = this.status;
		
		if(data)
		{
			if(data.logs) data.logs.each(this.log);
			if(data.map) this.map = data.map;
			if(data.monsters) this.monsters = data.monsters;
			if(data.players) this.players = data.players;
			
			this.status = data.status;
		}
		
		var letters = null;
		
		/* Status update */
		
		if(oldStatus.build != this.status.build)
		{
			this.elementPlayer.empty();
			this.elementPlayer.adopt(new Element('div', { 'class' : 'playerShadow' }));
			this.elementPlayer.adopt(new Element('div', { 'class' : 'playerHead', 'style' : 'background-position: 0px ' + (data.status.avatarHead * 8) + 'px'  }));
			this.elementPlayer.adopt(new Element('div', { 'class' : 'playerBody', 'style' : 'background-position: -16px ' + (data.status.avatarBody * 8) + 'px' }));
		}
		
		if(oldStatus.message != this.status.message)
		{
			if(this.status.message == '' || this.status.message == null)
			{
				this.elementPlayerChat.addClass('hide');
			}
			else
			{
				this.elementPlayerChatMessage.empty();
				this.Chat.showMessage(this.status.message, 2, 2, this.elementPlayerChatMessage);
				this.elementPlayerChat.removeClass('hide');
			}
		}
		
		if(oldStatus.xp != this.status.xp)
		{
			this.elementXPText.empty();
			letters = this.generateText(this.status.xp.toString() + 'xp');
			this.elementXPText.adopt(letters);
			
			this.elementXPBar.style.width = this.status.percentXp.toString() + '%';
			
			this.elementLevelText.empty();
			letters = this.generateText('lvl');
			letters.include(this.generateText(this.status.level.toString(), 'white'));
			this.elementLevelText.adopt(letters);
		}
		
		this.elementGround.className = 'level' + this.status.level + ' floor' + this.status.floor;
		
		if(this.status.hp > 0)
		{
			this.isDead = false;
		}
		else
		{
			this.isDead = true;
			this.elementGround.className+= ' phantom';
		}
		
		if(oldStatus.hp != this.status.hp)
		{
			this.elementHPText.empty();
			letters = this.generateText(this.status.hp.toString() + '/30');
			this.elementHPText.adopt(letters);
			
			var percentHp = Math.ceil((this.status.hp / 30) * 100);
			this.elementHPBar.style.width = percentHp.toString() + '%';
		}
		
		if(oldStatus.mp != this.status.mp)
		{
			this.elementMPText.empty();
			letters = this.generateText(this.status.mp.toString() + '/30');
			this.elementMPText.adopt(letters);
			
			var percentMp = Math.ceil((this.status.mp / 30) * 100);
			this.elementMPBar.style.width = percentMp.toString() + '%';
		}
		
		if(noVisualReresh)
		{
			this.status.x = oldStatus.x;
			this.status.y = oldStatus.y;
		}
		
		this.elementPosition.empty();
		this.elementPosition.adopt(this.generateText('f' + this.status.floor + ' / ' + this.status.x + '-' + this.status.y));
		
		var tile = this.map[this.status.y] != null ? this.map[this.status.y][this.status.x] : null;
		var classname = 'starter';
		
		if(tile == 7)
		{
			classname+= ' hide';
		}
		else if(tile == 8)
		{
			classname+= ' inwater';
		}
		
		if(this.flipped)
		{
			classname+= ' flip';
		}
		
		if(this.elementPlayer.className != classname) this.elementPlayer.className = classname;
		
		if(noVisualReresh)
		{
			return;
		}
		
		$clear(this.refreshTimer);
		
		/* Map update */
		
		var visibBaseX = this.viewport.middleX;
		var visibBaseY = this.viewport.middleY;
		
		var groundx = ((this.status.x + visibBaseX + 1) * 16) - 1152;
		var groundy = ((this.status.y + visibBaseY + 1) * 16) - 1152;
		
		this.elementGround.style.backgroundPosition = groundx.toString() + 'px ' + groundy.toString() + 'px';
		if(data && data.background) this.elementGround.style.backgroundImage = 'url(img/' + data.background + ')';
		
		/* display all the tiles */
		
		this.elementMap.empty();
		
		var y = 0;
		
		while(y < this.viewport.y)
		{
			var currentY = this.status.y + y - visibBaseY;
			var x = 0;
			
			while(x < this.viewport.x)
			{
				var currentX = this.status.x + x - visibBaseX;
				var tile = 0;
				
				if(this.map[currentY] != null && this.map[currentY][currentX] != null)
				{
					tile = this.map[currentY][currentX];
				}
				
				if(tile != 0)
				{
					var className = null;
					var events = {};
					var style = '';
					var healthPercent = null;
					
					if(tile == 1)
					{
						className = 'wall';
					}
					else if(tile > 19)
					{
						className = 'add-wall-' + (tile - 19);
					}
					else if(tile == 2)
					{
						var attackable = !this.isDead && ((currentX == this.status.x) && ( currentY == this.status.y + 1 || currentY == this.status.y - 1)) || ((currentY == this.status.y) && ( currentX == this.status.x + 1 || currentX == this.status.x - 1));
						
						healthPercent = (this.monsters[currentY] && this.monsters[currentY][currentX]);
										
						if(attackable)
						{
							events = {
								'click' : function(x, y) {
									this.attack(x, y);
								}.bind(this, [currentX, currentY])
							};
							
							className = 'monstera';
						}
						else
						{
							className = 'monster';
						}
					}
					else if(tile == 3)
					{
						className = 'monsterd';
					}
					else if(tile == 4 || tile == 5)
					{
						var takeable = ((currentX == this.status.x) && ( currentY == this.status.y + 1 || currentY == this.status.y - 1)) || ((currentY == this.status.y) && ( currentX == this.status.x + 1 || currentX == this.status.x - 1));
						
						className = (tile == 4 ? 'stairup' : 'stairdown');
						
						if(takeable)
						{
							events = {
								'click' : function(x, y) {
									this.takeStair(x, y);
								}.bind(this, [currentX, currentY])
							};
							
							className+= ' clickable';
						}
					}
					else if($type(tile) == 'object' && tile.image != '')
					{
						className = 'special';
						style = 'background-image:url(img/specials/' + tile.image + ')';
					}
					
					
					if(className != null)
					{
						var posX = (this.status.x - currentX + visibBaseX) * 16;
						var posY = (this.status.y - currentY + visibBaseY) * 16;
						
						this.elementMap.adopt(new Element('div', {
							'class' : className,
							'style' : 'top:' + posY  + 'px; left:' + posX + 'px;' + style,
							'events' : events
						}));
						
						if(healthPercent)
						{
							this.elementMap.adopt(new Element('div', {
								'class': 'bar',
								'style' : 'top:' + (posY - 6) + 'px; left:' + (posX - 2) + 'px;'
							}).adopt(new Element('div', { 'class' : 'health' }).adopt(new Element('div', { 'style' : 'width:' + healthPercent + '%' }))));
						}
					}
				}
				
				x++;
			}
			
			y++;
		}
		
		/* display all the players */
		
		var l = this.players.length;
		for(var i = 0; i < l; i++)
		{
			var player = this.players[i];
			
			var x = this.status.x - player.x + visibBaseX;
			var y = this.status.y - player.y + visibBaseY;
			
			if(x < 0 || y < 0 || x >= this.viewport.x || y >= this.viewport.y || (x == this.viewport.middleX && y == this.viewport.middleY)) continue;
			
			var tile = this.map[player.y] != null ? this.map[player.y][player.x] : null;
			
			if(tile != null && tile != 7) //zone "invisible"
			{
				x*= 16;
				y*= 16;
				
				var nx = x - 4;
				var ny = y - 12;
				
				var sbx = x;
				var sby = y - 2;
				
				var healable = player.hp < 16 && this.status.mp > 0 && (player.hp > 0 || this.status.level > 29);
				
				var name = new Element('div', {
					'style' : 'width:24px; height:6px; position:absolute; top:' + ny + 'px; left:' + nx + 'px; background-color:#fff; padding:2px 0px 2px 2px; z-index:11'
				});
				
				if(player.message)
				{
					this.Chat.showMessage(player.message, 2, 2, name);
				}
				else
				{
					name.adopt(this.generateText(player.name, (healable ? 'red' : 'normal')));
				}
				
				this.elementMap.adopt(name);
				
				this.elementMap.adopt(new Element('div', {
					'style' : 'width:2px; height:2px; position:absolute; background:#fff; top:' + sby + 'px; left:' + sbx + 'px'
				}));
				
				var div = null;				
				
				var classname = '';
				
				
				if(player.hp < 1) classname+= 'spirit ';
				if(tile == 8) classname+= 'inwater ';
				
				if(healable)
				{
					div = new Element('div', {
						'style' : 'width:16px; height:16px; position:absolute; top:' + y + 'px; left:' + x + 'px',
						'class' : classname + 'clickable',
						'events' : {
							'click' : function(name)
							{
								this.heal(name);
							}.bind(this, [player.name])
						}
					});
				}
				else
				{
					div = new Element('div', {
						'style' : 'width:16px; height:16px; position:absolute; top:' + y + 'px; left:' + x + 'px',
						'class' : classname
					});
				}
				
				div.adopt(new Element('div', { 'class' : 'playerShadow' }));
				div.adopt(new Element('div', { 'class' : 'playerHead', 'style' : 'background-position: 0px ' + (player.avatarHead * 8) + 'px'  }));
				div.adopt(new Element('div', { 'class' : 'playerBody', 'style' : 'background-position: -16px ' + (player.avatarBody * 8) + 'px' }));
				
				this.elementMap.adopt(div);
			}
		}
		
		/* if there is a battleresult, show the window */
		
		if(data && data.information)
		{
			this.showInformation(data.information, oldStatus);
		}
		
		this.refreshTimer = this.refresh.delay(2000, this);
	},
	showInformation: function(info, oldStatus)
	{
		var content = null;
		
		switch(info.type)
		{
			case 1: //victory report
			case 2: //failure report
				var selfDamage = '-' + info.self.damage;
				var monsDamage = '' + info.monster.damage;
				
				var x = this.viewport.middleX * 16;
				var y = (this.viewport.middleY * 16) - 12;
				selfDamage = new Element('div', { 'class' : 'player-damage', 'style' : 'z-index:200;position:absolute; top:' + (y - 10) + 'px; left:' + x + 'px;' }).adopt(this.generateText(selfDamage, 'red'));
				monsDamage = new Element('div', { 'class' : 'monster-damage', 'style' : 'z-index:200;position:absolute; top:' + (y - info.monster.relativeY * 16) + 'px; left:' + (x - info.monster.relativeX * 16) + 'px;' }).adopt(this.generateText(monsDamage, 'red'));
				
				this.elementMap.adopt(selfDamage);
				this.elementMap.adopt(monsDamage);
				break;
				
				case 9: //healing report
							content = new Element('div');
							var div = new Element('div', { 'style' : 'clear:both; padding-left:50px; padding-bottom:12px' });
								div.adopt(this.generateText('healing', 'white'));
							content.adopt(div);

							var difMp = oldStatus.mp - this.status.mp;
							var difXp = this.status.xp - oldStatus.xp;
							var div = new Element('div', { 'style' : 'clear:both; margin-left:0px; padding-bottom:15px;' });
								div.adopt(this.generateText('lvl' + info.playerLevel, 'white'));
								div.adopt(this.generateText(' +' + info.heal + 'hp'));
								div.adopt(this.generateText(' +' + difXp + 'xp '));
								div.adopt(this.generateText('-' + difMp + 'mp', 'red'));
							content.adopt(div);
							break;
				
			default: //shouldn't be there
				return;
		}
		
		if(content)
		{
			content.adopt(new Element('hr', { 'style' : 'clear:both;border:0; border-top:2px dotted #cacbb7; padding-bottom:3px' }));
			
			var a = new Element('a', {
				'href' : '#',
				'style' : 'clear:both; background-image:none; width:60px; padding-left:60px; margin-top:4px;',
				'events' : {
					'click' : function() {
						this.Window.hide();
					}.bind(this)
				}
			});
			
			a.adopt(this.generateText('close'));
			
			content.adopt(a);
			
			this.Window.show(content);
		}
	},
	generateText: function(texte, color)
	{
		texte = texte.toLowerCase();
		var l = texte.length;
		var letters = [];
		var col = (color == 'red' ? 'r' : (color == 'white' ? 'w' : ''));
		
		for(var x = 0; x < l; x++)
		{
			var c = texte.charAt(x);
			
			switch(c)
			{
				case '/': c = 'slas'; break;
				case ' ': c = 'spac'; break;
				case '+': c = 'plus'; break;
				case '-': c = 'minu'; break;
				default: break;
			}
			
			letters.push(new Element('div', {
				'class' : 'letter' + col + c
			}));
		}
		
		return letters;
	},
	message: function(m)
	{
		if($type(m) == 'string')
		{
			m = m.replace('\n','').split('\r');
		}
		
		this.messageStack = m;
		
		var letters = this.generateText(this.messageStack[0]);
		this.messageStack.shift();
		this.showMessage(letters);
	},
	fireEvent: function(e, e2)
	{
		this.moved = true;
		
		$clear(this.eventTimer);
		
		if(e != 'stop')
		{
			if(this.Window.opened)
			{
				this.Window.hide();
				return;
			}
			
			if(this.messageOpened)
			{
				if(this.messageStack.length > 0)
				{
					this.message(this.messageStack);
				}
				else
				{
					this.hideMessage();
				}
				return;
			}
		}
		else
		{
			if(e2 == 'left')
			{
				this.directions.left = 0;
			}
			else if(e2 == 'right')
			{
				this.directions.right = 0;
			}
			else if(e2 == 'up')
			{
				this.directions.up = 0;
			}
			else if(e2 == 'down')
			{
				this.directions.down = 0;
			}
		}
		
		if(this.Chat.opened)
		{
			if(e == 'c')
			{
				this.Chat.hide();
			}
			
			return; //block all event when in chat
		}
		else
		{
			if(e == 'c')
			{
				this.Chat.show();
			}
		}
		
		var difX = 0;
		var difY = 0;
		
		if(e == 'left')
		{
			this.directions.left = 1;
		}
		else if(e == 'right')
		{
			this.directions.right = 1;
		}
		else if(e == 'up')
		{
			this.directions.up = 1;
		}
		else if(e == 'down')
		{
			this.directions.down = 1;
		}
		
		var doTimer = false;
		
		if(this.directions.left)
		{
			difX = 1;
		}
		else if(this.directions.right)
		{
			difX = -1;
		}
		
		if(this.directions.up)
		{
			difY = 1;
		}
		else if(this.directions.down)
		{
			difY = -1;
		}
		
		if(difY != 0 || difX != 0)
		{
			var x = this.status.x;
			var y = this.status.y;
			
			var newX = x + difX;
			var newY = y + difY;
				
			if(difX > 0)
			{
				this.flipped = true;
			}
			else if(difX < 0)
			{
				this.flipped = false;
			}
			
			var diagonalMove = (difX != 0 && difY != 0);
			
			var tile = 1;
			var tileAdj1 = 1;
			var tileAdj2 = 1;
			
			if(this.map[newY] != null && this.map[newY][newX] != null) tile = this.map[newY][newX];
			if(diagonalMove && this.map[newY] != null && this.map[newY][x] != null) tileAdj1 = this.map[newY][x];
			if(diagonalMove && this.map[y] != null && this.map[y][newX] != null) tileAdj2 = this.map[y][newX];
			
			doTimer = true;
			
			if(
				diagonalMove &&
				!(tileAdj1 < 1 || tileAdj1 == 3 || tileAdj1 == 8 || tileAdj1 == 7 || tileAdj1 == 9 || tileAdj1 == 4 || tileAdj1 == 5 || tileAdj1 == 10 || tileAdj1 == 11) &&
				!(tileAdj2 < 1 || tileAdj2 == 3 || tileAdj2 == 8 || tileAdj2 == 7 || tileAdj2 == 9 || tileAdj2 == 4 || tileAdj2 == 5 || tileAdj2 == 10 || tileAdj2 == 11)
			)
			{
				doTimer = false;
			}
			else if(tile < 1 || tile == 3 || tile == 8 || tile == 7) //void OR dead monster OR water OR invisible !
			{
				this.move(newX, newY);
			}
			else if(tile == 9) //raise point
			{
				if((this.status.hp < 30 || this.status.mp < 30))
				{
					this.status.y = newY;
					this.status.x = newX;
					this.updateWithRefresh();
				}
				else
				{
					this.move(newX, newY);
				}
			}
			else if(tile == 2) //monster ! kick the monster !
			{
				if(!this.isDead)
				{
					this.attack(newX, newY);
					doTimer = false;
				}
				else
				{
					this.move(newX, newY);
				}
			}
			else if(tile == 4 || tile == 5 || tile == 10 || tile == 11) //stair
			{
				if(this.isDead && this.status.maxFloor == this.status.floor && (tile == 4 || tile == 10))
				{
					this.message('Lowly ghosts aren\'t welcome here.');
					doTimer = false;
				}
				else
				{
					this.takeStair(newX, newY);
					doTimer = false;
				}
			}
			else if($type(tile) == 'object') //special
			{
				this.triggerSpecial(tile);
				doTimer = false;
			}
			else
			{
				doTimer = false;
			}
		}
		
		if(doTimer)
		{
			this.eventTimer = this.fireEvent.delay(180, this, [e]);
			this.currentEvent = e;
		}
		else
		{
			this.eventTimer = false;
			this.currentEvent = null;
		}
	},
	takeStair: function(x, y)
	{
		this.request('stair', x, y, this.takeStairCallback);
	},
	takeStairCallback: function(data)
	{
		this.refresh(data);
		this.requestEnable = true;
	},
	heal: function(name)
	{
		this.request('heal', name, name, this.healCallback);
	},
	healCallback: function(data)
	{
		this.refresh(data);
		this.requestEnable = true;
	},
	triggerSpecial: function(special)
	{
		if(special.message != '')
		{
			this.message(special.message);
		}
		else if(special.toFloor > 0)
		{
			this.request('portal', special.x, special.y, this.portalCallback);
		}
	},
	portalCallback: function(data)
	{
		this.refresh(data);
		this.requestEnable = true;
	},
	move: function(x, y)
	{
		if(!this.requestEnable) return;
		
		var data = {
			'status' : this.status
		};
		
		data.status.x = x;
		data.status.y = y;
		
		//lets checks if there is no player here though...
		var l = this.players.length;
		var healablePlayer = false;
		
		for(var i = 0; i < l && !healablePlayer; i++)
		{
			var p = this.players[i];
			
			if(p.y == data.status.y && p.x == data.status.x)
			{
				if(p.hp < 16 && this.status.mp > 0 && (p.hp > 0 || this.status.level > 29))
				{
					healablePlayer = p.name;
				}
			}
		}
		
		if(healablePlayer) 
		{
			this.status = data.status;
			this.heal(healablePlayer);
		}
		else
		{
			this.refresh(data);
		}
	},
	attack: function(x, y)
	{
		if(this.isDead) return; //you're supposed to be dead.
		this.request('attack', x, y, this.attackCallback);
	},
	attackCallback: function(data)
	{
		this.refresh(data);
		this.requestEnable = true;
	},
	update: function()
	{
		this.request('update', 0, 0, this.updateCallback);
	},
	updateCallback: function(data)
	{
		this.refresh(data, true);
		this.requestEnable = true;
	},
	updateWithRefresh: function()
	{
		this.request('updateWithRefresh', 0, 0, this.updateWithRefreshCallback);
	},
	updateWithRefreshCallback: function(data)
	{
		this.refresh(data);
		this.requestEnable = true;
	},
	request: function(action, x, y, callback, callbackBinding)
	{
		if(!this.requestEnable || (this.Chat.opened && action != 'chat')) return;
		
		this.requestEnable = action != 'update' ? false : true;
		
		$clear(this.timer);
		//$clear(this.refreshTimer);
		
		var delayNext = 2000;
		
		if(action == 'update' && this.moved == false)
		{
			this.updateWithoutMove++;
			
			if(this.updateWithoutMove > 10)
			{
				delayNext = 10000;
			}
			else if(this.updateWithoutMove > 4)
			{
				delayNext = 4000;
			}
		}
		else
		{
			this.moved = false;
			this.updateWithoutMove = 0;
		}
		
		new Request.JSON({
			'url' : 'portable.php',
			'method' : 'get',
			'onSuccess' : function(data) {
				this.timer = this.update.delay(delayNext, this);
				callback.run(data, callbackBinding || this);
			}.bind(this),
			'onFailure' : function(data) {
				this.timer = this.update.delay(delayNext, this);
				this.requestEnable = true;
			}.bind(this),
			'data' : {
				'position_x' : this.status.x,
				'position_y' : this.status.y,
				'action' : action,
				'x' : x,
				'y' : y,
				'viewport_x' : this.viewport.x,
				'viewport_y' : this.viewport.y
			}
		}).send();
	}
};

Merveilles.Window = {
	parent: null,
	opened: false,
	element:null,
	container:null,
	init: function(parent)
	{
		this.parent = parent;
		
		this.container = new Element('div', { 'class' : 'window hide', 'style' : 'left:' + ((parent.viewport.x * 16 - 176) / 2) + 'px; top:' + ((parent.viewport.y * 16 - 108) / 2) + 'px;' });
		
			this.element = new Element('div', { 'style' : 'padding:10px; font-size:12px;' });
			this.container.adopt(this.element);
		
		this.parent.elementNav.adopt(this.container);
	},
	show: function(dom)
	{
		this.opened = true;
		this.element.adopt(dom);
		this.container.removeClass('hide');
	},
	hide: function()
	{
		this.container.addClass('hide');
		this.element.empty();
		this.opened = false;
	}
}

Merveilles.Chat = {
	parent: null,
	opened: false,
	element:null,
	value:[],
	init: function(parent)
	{
		this.parent = parent;
		
		this.element = new Element('div', { 'class' : 'chat hide' });
		
			this.element.adopt(new Element('div', { 'class' : 'button', 'id' : 'chat-button1', 'style' : 'margin-top:6px; margin-left:6px;' }));
			this.element.adopt(new Element('div', { 'class' : 'button', 'id' : 'chat-button2', 'style' : 'margin-top:6px; margin-left:60px;' }));
			this.element.adopt(new Element('div', { 'class' : 'button', 'id' : 'chat-button3', 'style' : 'margin-top:6px; margin-left:114px;' }));
			
			this.element.adopt(new Element('div', { 'class' : 'button', 'id' : 'chat-button4', 'style' : 'margin-top:60px; margin-left:6px;' }));
			this.element.adopt(new Element('div', { 'class' : 'button', 'id' : 'chat-button5', 'style' : 'margin-top:60px; margin-left:60px;' }));
			this.element.adopt(new Element('div', { 'class' : 'button', 'id' : 'chat-button6', 'style' : 'margin-top:60px; margin-left:114px;' }));
			
			this.element.adopt(new Element('div', { 'class' : 'button', 'id' : 'chat-button7', 'style' : 'margin-top:114px; margin-left:6px;' }));
			this.element.adopt(new Element('div', { 'class' : 'button', 'id' : 'chat-button8', 'style' : 'margin-top:114px; margin-left:60px;' }));
			this.element.adopt(new Element('div', { 'class' : 'button', 'id' : 'chat-button9', 'style' : 'margin-top:114px; margin-left:114px;' }));
			
			this.element.adopt(new Element('div', { 'class' : 'clear', 'style' : 'margin-top:172px; margin-left:18px;', 'events' : { 'dblclick': this.hide.bind(this) } }));
			this.element.adopt(new Element('div', { 'class' : 'next', 'style' : 'margin-top:172px; margin-left:72px;' }));
			this.element.adopt(new Element('div', { 'class' : 'send', 'style' : 'margin-top:174px; margin-left:126px;' }));
		
		this.element.addEvent('click', this.clickHandler.bindWithEvent(this));
		
		this.parent.elementNav.adopt(this.element);
	},
	show: function()
	{
		this.opened = true;
		this.clear();
		this.element.removeClass('limit');
		this.element.removeClass('hide');
	},
	hide: function()
	{
		this.element.addClass('hide');
		this.opened = false;
	},
	request: function()
	{
		this.parent.request('chat', this.value.join(','), 0, this.callback, this);
	},
	callback: function(data)
	{
		this.hide();
		this.parent.refresh(data, true);
		this.parent.requestEnable = true;
	},
	clickHandler: function(e)
	{
		var t = $(e.target);
		
		if(t.hasClass('button'))
		{
			if(t.hasClass('buttonsel1'))
			{
				t.removeClass('buttonsel1');
				t.addClass('buttonsel2');
			}
			else if (t.hasClass('buttonsel2'))
			{
				t.removeClass('buttonsel2');
			}
			else
			{
				t.addClass('buttonsel1');
			}
		}
		else if(t.hasClass('clear'))
		{
			this.clear();
		}
		else if(t.hasClass('next'))
		{
			this.value.push(this.getState());
			if(this.value.length == 2) this.element.addClass('limit'); //limite à trois char (ew c'est laid ça)
			this.clear();
		}
		else if(t.hasClass('send'))
		{
			this.value.push(this.getState());
			this.request();
			this.value = [];
		}
	},
	getState: function()
	{
		var children = this.element.getChildren();
		var value = '';
		
		for(var x = 0; x < 9; x++)
		{
			var c = children[x];
			
			value+= c.hasClass('buttonsel1') ? '1' : (c.hasClass('buttonsel2') ? '2' : '0');
		}
		
		return value;
	},
	clear: function()
	{
		this.element.getChildren().removeClass('buttonsel1').removeClass('buttonsel2');
	},
	showMessage: function(message, top, left, element)
	{
		if(element == null || element == '') return;
		
		var a = message.split(',');
		var divs = [];
		var w = 2;
		
		for(var x = 0, l = a.length; x < l; x++)
		{
			for(var y = 0; y < 9; y++)
			{
				var c = a[x].charAt(y);
				
				if(c != '0')
				{
					divs.push(new Element('div', { 'class' : 'scribble' + c, style : 'top:' + (top + w * parseInt(y / 3)) + 'px; left:' + (left + w * ((y % 3) + x * 4)) + 'px;' }));
				}
			}
		}
		
		element.adopt(divs);
	}
}

function toggle_visibility(id) {
   var e = document.getElementById(id);
   if(e.style.display == 'block')
      e.style.display = 'none';
   else
      e.style.display = 'block';

	return false;
}