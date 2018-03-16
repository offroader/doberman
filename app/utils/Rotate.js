Ext.define('app.utils.Rotate', {
    constructor: function () {
        this.rotate = function (canvas, degrees) {
            var context = canvas.getContext('2d')
            
            var image = new Image()
            image.onload = function () {
                canvas.width = image.height
                canvas.height = image.width
                
                context.clearRect(0, 0, canvas.width, canvas.height)

                // save the unrotated context of the canvas so we can restore it later
                // the alternative is to untranslate & unrotate after drawing
                context.save()

                // move to the center of the canvas
                context.translate(canvas.width / 2, canvas.height / 2)

                // rotate the canvas to the specified degrees
                context.rotate(degrees * Math.PI /180)

                // draw the image
                // since the context is rotated, the image will be rotated also
                context.drawImage(image, -image.width / 2, -image.height / 2)

                // we’re done with the rotating so restore the unrotated context
                context.restore()
            }
            
            image.src = canvas.toDataURL('image/png')
        }
    }
})
