Ext.define('app.utils.Sepia', {
    constructor: function () {
        const grayScale = Ext.create('app.utils.GrayScale')
        
        this.filter = function (canvas) {
            grayScale.filter(canvas)
            
            var c = canvas.getContext('2d')
            
            var imageData = c.getImageData(0, 0, canvas.width, canvas.height)
            
            var data = imageData.data
            
            for (var i = 0; i < data.length; i += 4) {
                var r = data[i],
                    g = data[i + 1],
                    b = data[i + 2];

                data[i] = r * 0.393 + g * 0.769 + b * 0.189
                data[i + 1] = r * 0.349 + g * 0.686 + b * 0.168
                data[i + 2] = r * 0.272 + g * 0.534 + b * 0.131
            }
            
            c.putImageData(imageData, 0, 0)
        }
    }
})
