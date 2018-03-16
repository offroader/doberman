Ext.define('app.utils.Crop', {
    constructor: function () {
        this.startCropping = function (imagePanel, canvas) {
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
            
            imagePanel.saveCropped = function () {
                var context = canvas.getContext('2d')
                var imageData = context.getImageData(currentX, currentY, currentW, currentH)
                canvas.width = currentW
                canvas.height = currentH
                context.putImageData(imageData, 0, 0)
                imagePanel.stopCropping()
            }
            
            imagePanel.stopCropping = function () {
                clearInterval(interval)
                parentEl.removeChild(overlayCanvas)
            }
        }
    }
})
