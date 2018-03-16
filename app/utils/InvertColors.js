Ext.define('app.utils.InvertColors', {
    constructor: function () {
        this.filter = function (canvas) {
            var c = canvas.getContext('2d')
            
            var imageData = c.getImageData(0, 0, canvas.width, canvas.height)
            
            var data = imageData.data
            
            for (var i = 0; i < data.length; i += 4) {
                var r = data[i],
                    g = data[i + 1],
                    b = data[i + 2],
                    a = data[i + 3];

                data[i] = 255 - r
                data[i + 1] = 255 - g
                data[i + 2] = 255 - b
            }
            
            c.putImageData(imageData, 0, 0)
        }
    }
})
