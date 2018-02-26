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
            utils.addFilter(canvas, filter)
        }
        
        that.contrast = function (contrast) {
        	utils.contrast(canvas, contrast)
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
                link.setAttribute('download', 'download.png');
                link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
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
                utils.rotate(canvas, context, -90)
            }
        }
        
        that.rotateRight = function () {
            if (canvasContainer.isVisible()) {
                utils.rotate(canvas, context, 90)
            }
        }
        
        that.flipH = function () {
            if (canvasContainer.isVisible()) {
                utils.flipH(context, canvas)
            }
        }
        
        that.flipV = function () {
            if (canvasContainer.isVisible()) {
                utils.flipV(context, canvas)
            }
        }
        
        
        that.startCropping = function () {
            var overlayCanvas = document.createElement('canvas')
            
            overlayCanvas.width = canvas.width
            overlayCanvas.height = canvas.height
            overlayCanvas.style.position = 'absolute'
            overlayCanvas.style.top = '0px'
            overlayCanvas.style.left = '0px'
            
            var parentEl = canvas.parentElement
            parentEl.appendChild(overlayCanvas)
            
            var c = overlayCanvas.getContext('2d')
            
            var currentW = Math.floor(overlayCanvas.width / 2)
            var currentH = Math.floor(overlayCanvas.height / 2)
            
            var currentX = Math.floor(currentW / 2)
            var currentY = Math.floor(currentH / 2)
            
            var interval
            
            var resizing = false
            var buffer = 20

            var moving = false
            var movingStartPoint
            
            function paint () {
                c.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)
            
                c.fillStyle = 'rgba(155, 155, 155, 0.7)'
                c.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height)
                c.clearRect(currentX, currentY, currentW, currentH)
                
                c.strokeStyle = '#ffffff'
                c.lineWidth = 4
                c.strokeRect(currentX - 2, currentY - 2, currentW, currentH)
            }
            
            paint()
            
            overlayCanvas.addEventListener('mousemove', function (e) {
                
                // left top corner
                if (e.offsetX > currentX - buffer && e.offsetX < currentX + buffer
                    && e.offsetY > currentY - buffer && e.offsetY < currentY + buffer) {
                    
                    overlayCanvas.style.cursor = 'nw-resize'
                    
                    if (resizing) {
                        currentXDelta = currentX - e.offsetX
                        currentYDelta = currentY - e.offsetY
                        
                        currentX = e.offsetX
                        currentY = e.offsetY
                        
                        currentW += currentXDelta
                        currentH += currentYDelta
                    }
                    
                    
                // left bottom corner
                } else if (e.offsetX > currentX - buffer && e.offsetX < currentX + buffer
                    && e.offsetY > currentY + currentH - buffer && e.offsetY < currentY + currentH + buffer) {
                    
                    overlayCanvas.style.cursor = 'sw-resize'
                    
                    if (resizing) {
                        currentXDelta = currentX - e.offsetX
                        currentYDelta = e.offsetY - currentY - currentH
                        
                        currentX = e.offsetX
                        //currentY
                        
                        currentW += currentXDelta
                        currentH += currentYDelta
                    }

                // right top corner                    
                } else if (e.offsetX > currentX + currentW - buffer && e.offsetX < currentX + currentW + buffer
                    && e.offsetY > currentY - buffer && e.offsetY < currentY + buffer) {
                    
                    overlayCanvas.style.cursor = 'ne-resize'
                    
                    if (resizing) {
                        currentXDelta = e.offsetX - currentX - currentW
                        currentYDelta = currentY - e.offsetY
                        
                        //currentX
                        currentY = e.offsetY
                        
                        currentW += currentXDelta
                        currentH += currentYDelta
                    }
                    
                    
                // right bottom corner
                } else if (e.offsetX > currentX + currentW - buffer && e.offsetX < currentX + currentW + buffer
                    && e.offsetY > currentY + currentH - buffer && e.offsetY < currentY + currentH + buffer) {
                    
                    overlayCanvas.style.cursor = 'se-resize'
                    
                    if (resizing) {
                        currentXDelta = e.offsetX - currentX - currentW
                        currentYDelta = e.offsetY - currentY - currentH
                        
                        currentW += currentXDelta
                        currentH += currentYDelta
                    }
                    
                // top edge
                } else if (e.offsetX > currentX + buffer && e.offsetX < currentX + currentW - buffer
                        && e.offsetY > currentY - buffer && e.offsetY < currentY + buffer) {
                        
                    overlayCanvas.style.cursor = 'n-resize'
                
                    if (resizing) {
                        currentYDelta = currentY - e.offsetY
                        currentY = e.offsetY
                        currentH += currentYDelta
                    }
                
                // bottom edge
                } else if (e.offsetX > currentX + buffer && e.offsetX < currentX + currentW - buffer
                        && e.offsetY > currentY + currentH - buffer && e.offsetY < currentY + currentH + buffer) {
                        
                    overlayCanvas.style.cursor = 's-resize'
                
                    if (resizing) {
                        currentYDelta = e.offsetY - currentY - currentH
                        currentH += currentYDelta
                    }
                
                
                // left edge
                } else if (e.offsetY > currentY + buffer && e.offsetY < currentY + currentH - buffer
                        && e.offsetX > currentX - buffer && e.offsetX < currentX + buffer) {
                        
                    overlayCanvas.style.cursor = 'w-resize'
                
                    if (resizing) {
                        currentXDelta = currentX - e.offsetX
                        currentX = e.offsetX
                        currentW += currentXDelta
                    }
                
                // right edge
                } else if (e.offsetY > currentY + buffer && e.offsetY < currentY + currentH - buffer
                        && e.offsetX > currentX + currentW - buffer && e.offsetX < currentX + currentW + buffer) {
                        
                    overlayCanvas.style.cursor = 'e-resize'
                
                    if (resizing) {
                        currentXDelta = e.offsetX - currentX - currentW
                        currentW += currentXDelta
                    }
                        
                } else {
                    overlayCanvas.style.cursor = 'pointer'
                    
                    if (moving) {
                        overlayCanvas.style.cursor = 'move'
                        
                        var deltaX = e.offsetX - movingStartPoint.x
                        var deltaY = e.offsetY - movingStartPoint.y
                        
                        movingStartPoint.x = e.offsetX
                        movingStartPoint.y = e.offsetY
                        
                        currentX = Math.max(currentX + deltaX, 0)
                        currentY = Math.max(currentY + deltaY, 0)
                        
                        if (currentX + currentW > overlayCanvas.width) {
                            currentX = overlayCanvas.width - currentW
                        }
                        
                        if (currentY + currentH > overlayCanvas.height) {
                            currentY = overlayCanvas.height - currentH
                        }
                    }
                }
            })
            
            overlayCanvas.addEventListener('mousedown', function (e) {
                if (
                    (e.offsetX > currentX - buffer && e.offsetX < currentX + buffer
                        && e.offsetY > currentY - buffer && e.offsetY < currentY + currentH + buffer)
                    
                    || (e.offsetX > currentX + currentW - buffer && e.offsetX < currentX + currentW + buffer
                        && e.offsetY > currentY - buffer && e.offsetY < currentY + currentH + buffer)
                    
                    || (e.offsetY > currentY - buffer && e.offsetY < currentY + buffer
                        && e.offsetX > currentX - buffer && e.offsetX < currentX + currentW + buffer)
                    
                    || (e.offsetY > currentY + currentH - buffer && e.offsetY < currentY + currentH + buffer
                        && e.offsetX > currentX - buffer && e.offsetX < currentX + currentW + buffer) 
                ) {
                    
                    resizing = true
                    moving = false
                    interval = setInterval(paint, 10)
                    
                } else {
                    resizing = false
                    moving = true
                    movingStartPoint = {
                        x: e.offsetX,
                        y: e.offsetY
                    }
                    
                    overlayCanvas.style.cursor = 'move'
                    
                    interval = setInterval(paint, 10)
                }
            })
            
            overlayCanvas.addEventListener('mouseup', function (e) {
                resizing = false
                moving = false
                clearInterval(interval)
                
                overlayCanvas.style.cursor = 'pointer'
            })
            
            that.saveCropped = function () {
                var imageData = context.getImageData(currentX, currentY, currentW, currentH)
                canvas.width = currentW
                canvas.height = currentH
                context.putImageData(imageData, 0, 0)
                that.stopCropping()
            }
            
            that.stopCropping = function () {
                clearInterval(interval)
                parentEl.removeChild(overlayCanvas)
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
