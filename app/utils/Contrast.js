Ext.define('app.utils.Contrast', {
    constructor: function () {
        this.filter = function (canvas, con) {
            var c = canvas.getContext('2d')
            
            var imageData = c.getImageData(0, 0, canvas.width, canvas.height)
            
            var data = imageData.data
            
            for (var i = 0; i < data.length; i += 4) {
                var r = data[i],
                    g = data[i + 1],
                    b = data[i + 2],
                    a = data[i + 3];
                    
	            var factor = (259 * (con + 255)) / (255 * (259 - con))
	            
				var newRed   = Math.floor(factor * (r   - 128) + 128)
				var newGreen = Math.floor(factor * (g - 128) + 128)
				var newBlue  = Math.floor(factor * (b  - 128) + 128)
				
                data[i] = newRed
                data[i + 1] = newGreen
                data[i + 2] = newBlue
            }
            
            c.putImageData(imageData, 0, 0)
        }
    }
})
