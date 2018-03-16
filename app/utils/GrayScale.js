Ext.define('app.utils.GrayScale', {
    constructor: function () {
        const coef = 1
        
        this.filter = function (canvas) {
            var c = canvas.getContext('2d')
            
            var imageData = c.getImageData(0, 0, canvas.width, canvas.height)
            
            var data = imageData.data
            
            for (var i = 0; i < data.length; i += 4) {
                var r = data[i],
                    g = data[i + 1],
                    b = data[i + 2],
                    a = data[i + 3];

                var temp = 0.2126 * coef * r + 0.7152 * coef * g + 0.0722 * coef * b
                
                data[i] = data[i + 1] = data[i + 2] = temp
            }
            
            c.putImageData(imageData, 0, 0)
        }
    }
})
