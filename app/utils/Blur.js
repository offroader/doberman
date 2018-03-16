Ext.define('app.utils.Blur', {
    constructor: function () {
        this.filter = function (canvas) {
            var c = canvas.getContext('2d')
            
            var canvas1 = document.createElement('canvas')
            canvas1.width = canvas.width + 2
            canvas1.height = canvas.height + 2
            var c1 = canvas1.getContext('2d')

            c1.putImageData(c.getImageData(0, 0, 1, canvas.height), 0, 1)
            c1.putImageData(c.getImageData(canvas.width - 1, 0, 1, canvas.height), canvas1.width - 1, 1)
            c1.putImageData(c.getImageData(0, 0, canvas.width, 1), 1, 0)
            c1.putImageData(c.getImageData(0, canvas.height - 1, canvas.width, 1), 1, canvas1.height - 1)
            c1.putImageData(c.getImageData(0, 0, canvas.width, canvas.height), 1, 1)
            
            // left top pixel
            ;(function () {
                var p1 = c1.getImageData(0, 1, 1, 1)
                var p2 = c1.getImageData(1, 0, 1, 1)
                var p = c1.getImageData(0, 0, 1, 1)        
                c1.putImageData(fillPixel(p, p1, p2), 0, 0)
            })();
            
            // left bottom pixel
            ;(function () {
                var p1 = c1.getImageData(0, canvas1.height - 2, 1, 1)
                var p2 = c1.getImageData(1, canvas1.height - 1, 1, 1)
                var p = c1.getImageData(0, canvas1.height - 1, 1, 1)
                c1.putImageData(fillPixel(p, p1, p2), 0, canvas1.height - 1)
            })();
                    
            // right top pixel
            ;(function () {
                var p1 = c1.getImageData(canvas1.width - 2, 0, 1, 1)
                var p2 = c1.getImageData(canvas1.width - 1, 1, 1, 1)
                var p = c1.getImageData(canvas1.width - 1, 0, 1, 1)
                c1.putImageData(fillPixel(p, p1, p2), canvas1.width - 1, 0)
            })();
            
            // right bottom pixel
            (function () {
                var p1 = c1.getImageData(canvas1.width - 2, canvas1.height - 1, 1, 1)
                var p2 = c1.getImageData(canvas1.width - 1, canvas1.height - 2, 1, 1)
                var p = c1.getImageData(canvas1.width - 1, canvas1.height - 1, 1, 1)
                c1.putImageData(fillPixel(p, p1, p2), canvas1.width - 1, canvas1.height - 1)
            })();
            

            var imageData = c.getImageData(0, 0, canvas.width, canvas.height)
            var data = imageData.data
            
            var imageData1 = c1.getImageData(0, 0, canvas1.width, canvas1.height)
            var data1 = imageData1.data
            
            for (var y = 1; y < imageData1.height - 1; y++) {
                for (var x = 1; x < imageData1.width - 1; x++) {
                
                    var curr = (x - 1) + (y - 1) * imageData.width
                    var curr1 = x + y * imageData1.width
                    var top = x + (y - 1) * imageData1.width
                    var right = (x + 1) + y * imageData1.width
                    var bottom = x + (y + 1) * imageData1.width
                    var left = (x - 1) + y * imageData1.width
                    
                    top *= 4
                    right *= 4
                    bottom *= 4
                    left *= 4
                    curr1 *= 4
                    curr *= 4

                    var r = (data1[curr1] + data1[top] + data1[bottom] + data1[right] + data1[left]) / 5
                    var g = (data1[curr1 + 1] + data1[top + 1] + data1[bottom + 1] + data1[right + 1] + data1[left + 1]) / 5
                    var b = (data1[curr1 + 2] + data1[top + 2] + data1[bottom + 2] + data1[right + 2] + data1[left + 2]) / 5
                    
                    data[curr] = r
                    data[curr + 1] = g
                    data[curr + 2] = b
                }
            }
            
           c.putImageData(imageData, 0, 0)
        }
        
        function fillPixel (p, p1, p2) {
            var pData = p.data
            var p1Data = p1.data
            var p2Data = p2.data
            
            // red
            pData[0] = (p1Data[0] + p2Data[0]) / 2
            
            // green
            pData[1] = (p1Data[1] + p2Data[1]) / 2
            
            // blue
            pData[2] = (p1Data[2] + p2Data[2]) / 2
            
            // opacity
            pData[3] = 255
            
            return p
        }
    }
})
