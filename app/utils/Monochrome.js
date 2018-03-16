Ext.define('app.utils.Monochrome', {
    constructor: function () {
        this.filter = function (canvas) {
            var c = canvas.getContext('2d')
            
            var imageData = c.getImageData(0, 0, canvas.width, canvas.height)
            
            var data = imageData.data
            
            for (var i = 0; i < data.length; i += 4) {
                var r = data[i],
                    g = data[i + 1],
                    b = data[i + 2];
                    
                var temp = ((r + g + b) / 3 > 127 ? 255 : 0);

                data[i] = data[i + 1] = data[i + 2] = temp
            }
            
            c.putImageData(imageData, 0, 0)
        }
    }
})
