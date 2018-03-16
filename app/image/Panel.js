Ext.define('app.image.Panel', {
    extend: 'Ext.panel.Panel',
    layout: 'fit',
    constructor: function () {
        var that = this
        
        const MAX_WIDTH = 2560
        const MAX_HEIGHT = 1440
        
        var canvas,
            context,
            storedData,
            storedWidth,
            storedHeight;
        
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
                        
                        canvas.width = storedWidth = size.width
                        canvas.height = storedHeight = size.height
                        
                        context.drawImage(image, 0, 0, size.width, size.height)
                        
                        storedData = context.getImageData(0, 0, canvas.width, canvas.height)
                        
                        URL.revokeObjectURL(src)
                        
                        input.value = ''
                        
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
            overflowY: true,
            html: '<canvas id="' + canvasId + '" style="position:absolute; top:0px; left:0px;"></canvas>',
            hidden: true
        })
        
        that.items = [buttonContainer, canvasContainer]
        
        that.callParent(arguments)
        
        that.on('afterrender', function () {
            canvas = document.getElementById(canvasId)
            canvas.width = MAX_WIDTH
            canvas.height = MAX_HEIGHT
            context = canvas.getContext('2d')
        })
        
        that.addFilter = function (filter) {
            var filters = {
                blur: 'app.utils.Blur',
                edgeDetection: 'app.utils.EdgeDetection',
                grayScale: 'app.utils.GrayScale',
                invertColors: 'app.utils.InvertColors',
                laplacian: 'app.utils.Laplacian',
                monochrome: 'app.utils.MonochromeOtsu',
                monochromeOtsu: 'app.utils.MonochromeOtsu',
                sepia: 'app.utils.Sepia',
                sepia2: 'app.utils.Sepia2'
            }
        
            if (filters.hasOwnProperty(filter)) {
                var panelName = filters[filter]
                Ext.create(panelName).filter(canvas)
            }
        }
        
        that.contrast = function (contrast) {
            Ext.create('app.utils.Contrast').filter(canvas, contrast)
        }
        
        that.restoreImage = function () {
            if (canvasContainer.isVisible() && storedData) {
                canvas.width = storedWidth
                canvas.height = storedHeight
                context.putImageData(storedData, 0, 0)
            }
        }
        
        that.downloadImage = function () {
            if (canvasContainer.isVisible()) {
                var link = document.createElement('a')
                link.setAttribute('download', 'download.png')
                link.setAttribute('href', canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'))
                link.click()
            }
        }
        
        that.clearImage = function () {
            if (canvasContainer.isVisible()) {
                buttonContainer.setVisible(true)
                canvasContainer.setVisible(false)
                context.clearRect(0, 0, canvas.width, canvas.height)
            }
        }
        
        that.rotateLeft = function () {
            if (canvasContainer.isVisible()) {
                Ext.create('app.utils.Rotate').rotate(canvas, -90)
            }
        }
        
        that.rotateRight = function () {
            if (canvasContainer.isVisible()) {
                Ext.create('app.utils.Rotate').rotate(canvas, 90)
            }
        }
        
        that.flipH = function () {
            if (canvasContainer.isVisible()) {
                Ext.create('app.utils.Flip').flipH(canvas)
            }
        }
        
        that.flipV = function () {
            if (canvasContainer.isVisible()) {
                Ext.create('app.utils.Flip').flipV(canvas)
            }
        }
        
        that.startCropping = function (afterStart) {
            if (canvasContainer.isVisible()) {
                Ext.create('app.utils.Crop').startCropping(that, canvas)
                if (typeof afterStart === 'function') {
                    afterStart.call()
                }
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
