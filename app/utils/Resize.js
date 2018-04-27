Ext.define('app.utils.Resize', {
    constructor: function () {
        this.resize = function (canvas, size) {
            var width = size.width
            var height = size.height

            var img = new Image()
            img.onload = function () {
                img.width = width
                img.height = height
                
                canvas.width = width
                canvas.height = height
                var c = canvas.getContext('2d')
                c.drawImage(img, 0, 0, width, height)
            }
            img.src = canvas.toDataURL()
        }
    }
})
