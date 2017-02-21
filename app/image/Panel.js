Ext.define('app.image.Panel', {
    extend: 'Ext.panel.Panel',
    layout: 'fit',
    constructor: function () {
        var that = this
        
        const MAX_WIDTH = 2560
        const MAX_HEIGHT = 1440
        
        var utils = Ext.create('app.Utils')

        var canvas,
            context,
            storedData;
        
        var uploadButton = Ext.create('Ext.form.field.File', {
            buttonText: 'ატვირთვა...',
            buttonOnly: true,
            hideLabel: true,
            listeners: {
                change: function (field) {
                    var input = field.fileInputEl.dom
                    var file = input.files[0]
                    
                    var src = URL.createObjectURL(file)
                    
                    var image = new Image()
                    image.onload = function () {
                        var size = scaleImage({
                            width: this.width,
                            height: this.height
                        }, {
                            width: MAX_WIDTH,
                            height: MAX_HEIGHT
                        })
                        
                        canvas.style.position = 'absolute'
                        canvas.style.left = canvas.style.top = 0
                        
                        context.clearRect(0, 0, canvas.width, canvas.height)
                        
                        canvas.width = size.width
                        canvas.height = size.height
                        
                        context.drawImage(image, 0, 0, size.width, size.height)
                        
                        storedData = context.getImageData(0, 0, canvas.width, canvas.height)
                        
                        URL.revokeObjectURL(src)
                        
                        buttonContainer.setVisible(false)
                        canvasContainer.setVisible(true)
                    }
                    
                    image.src = src
                }
            }
        })
        
        var buttonContainer = Ext.create('Ext.panel.Panel', {
            layout: {
                type: 'hbox',
                align: 'stretch',
                pack: 'center'
            },
            items: [{
                xtype: 'container',
                flex: 1
            }, {
                xtype: 'container',
                width: 200,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'container',
                    flex: 1
                }, uploadButton, {
                    xtype: 'container',
                    flex: 1
                }]
            }, {
                xtype: 'container',
                flex: 1
            }]
        })
        
        var canvasId = Ext.id()
        var canvasContainer = Ext.create('Ext.panel.Panel', {
            layout: 'fit',
            html: '<canvas id="' + canvasId + '"></canvas>',
            hidden: true
        })
        
        that.items = [buttonContainer, canvasContainer]
        
        that.callParent(arguments)
        
        that.on('afterrender', function () {
            console.log('Event after render image panel')
            
            canvas = document.getElementById(canvasId)
            canvas.width = MAX_WIDTH
            canvas.height = MAX_HEIGHT
            context = canvas.getContext('2d')
        })
        
        that.addFilter = function (filter) {
            utils.addFilter(canvas, filter)
        }
        
        that.restoreImage = function () {
            if (storedData) {
                context.putImageData(storedData, 0, 0)
            }
        }
        
        function scaleImage (from, to) {
            var w = from.width,
                h = from.height;
                
            var toW = to.width,
                toH = to.height;

            var i = 0;

            if (w < toW && h < toH) {
                /*
                toW = toW * 0.9;
                toH = toH * 0.9;
                while (w < toW && h < toH) {
	                w = 1.1 * w;
	                h = 1.1 * h;
	                i++;
                }
                */
            } else {
                while (w > toW || h > toH) {
	                w = 0.9 * w
	                h = 0.9 * h
	                i++
                }
            }

            return {
                width: Math.floor(w),
                height: Math.floor(h)
            }
        }
    }
})
