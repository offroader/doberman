Ext.define('app.utils.Flip', {
    constructor: function () {
        this.flipH = function (canvas) {
            var c = canvas.getContext('2d')
            
            var odd = canvas.width % 2 === 0
            var med = odd ? canvas.width / 2 : canvas.width / 2 + 1
            
            for (var i = 0; (odd ? i <= med : i < med); i++) {
                var x1 = i
                var x2 = canvas.width - i
                
                var imageData1 = c.getImageData(x1, 0, 1, canvas.height)
                var imageData2 = c.getImageData(x2, 0, 1, canvas.height)
                
                c.putImageData(imageData1, x2, 0)
                c.putImageData(imageData2, x1, 0)
            }
        }
        
        this.flipV = function (canvas) {
            var c = canvas.getContext('2d')
            
            var odd = canvas.height % 2 === 0
            var med = odd ? canvas.height / 2 : canvas.height / 2 + 1
            
            for (var i = 0; (odd ? i <= med : i < med); i++) {
                var y1 = i
                var y2 = canvas.height - i
                
                var imageData1 = c.getImageData(0, y1, canvas.width, 1)
                var imageData2 = c.getImageData(0, y2, canvas.width, 1)
                
                c.putImageData(imageData1, 0, y2)
                c.putImageData(imageData2, 0, y1)
            }
        }
    }
})
