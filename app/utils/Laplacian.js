Ext.define('app.utils.Laplacian', {
    constructor: function () {
        const edgeDetection = Ext.create('app.utils.EdgeDetection')
        
        this.filter = function (canvas) {
            var c = canvas.getContext('2d')
            
            var edgeData = edgeDetection.filter(canvas, true)
            var eData = edgeData.data
            
            var imageData = c.getImageData(0, 0, canvas.width, canvas.height)
            var data = imageData.data
            
            for (var i = 0; i < data.length; i += 4) {
                var r = data[i] + eData[i],
                    g = data[i + 1] + eData[i + 1],
                    b = data[i + 2] + eData[i + 2];

                data[i] = r
                data[i + 1] = g
                data[i + 2] = b
            }
            
            c.putImageData(imageData, 0, 0)
        }
    }
})
