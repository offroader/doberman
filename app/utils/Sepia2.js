Ext.define('app.utils.Sepia2', {
    constructor: function () {
        const grayScale = Ext.create('app.utils.GrayScale')
        const coef = 4
        
        this.filter = function (canvas) {
            grayScale.filter(canvas)
            
            var c = canvas.getContext('2d')
            
            var imageData = c.getImageData(0, 0, canvas.width, canvas.height)
            
            var data = imageData.data
            for (var i = 0; i < data.length; i += 4) {
                var r = data[i],
                    g = data[i + 1],
                    b = data[i + 2],
                    a = data[i + 3];

                data[i] = r * 0.439 * coef
                data[i + 1] = g * 0.259 * coef
                data[i + 2] = b * 0.078 * coef
            }
            
            c.putImageData(imageData, 0, 0)
        }
    }
})
