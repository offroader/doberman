Ext.define('app.Utils', {
    constructor: function () {
        var that = this
        
        var filters = {
            invertColors: invertColors,
            grayScale: grayScale,
            monochrome: monochrome,
            sepia: sepia
        }
        
        var canvas
        
        that.addFilter = function (_canvas, filter) {
            if (filters.hasOwnProperty(filter)) {
                canvas = _canvas
                var c = canvas.getContext('2d')
                filters[filter](c)
            }
        }
        
        that.rotate = rotate
        
        function invertColors (c) {
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
        
        
        function grayScale (c) {
            var imageData = c.getImageData(0, 0, canvas.width, canvas.height)
            
            var data = imageData.data
            
            const coef = 1
            
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
        
        function sepia (c) {
            grayScale(c)
            
            var imageData = c.getImageData(0, 0, canvas.width, canvas.height)
            
            var data = imageData.data
            
            const coef = 4
            
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
        
        function monochrome (c) {
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
        
        
        function rotate (canvas, context, degrees) {
            var image = new Image()
            image.src = canvas.toDataURL("image/png")
            image.onload = function () {
                canvas.width = image.height
                canvas.height = image.width
                
                context.clearRect(0,0,canvas.width,canvas.height);

                // save the unrotated context of the canvas so we can restore it later
                // the alternative is to untranslate & unrotate after drawing
                context.save();

                // move to the center of the canvas
                context.translate(canvas.width/2,canvas.height/2);

                // rotate the canvas to the specified degrees
                context.rotate(degrees*Math.PI/180);

                // draw the image
                // since the context is rotated, the image will be rotated also
                context.drawImage(image,-image.width/2,-image.height/2);

                // we’re done with the rotating so restore the unrotated context
                context.restore();
            }
        }
        
        function tmp () {
            function edgeDetection (notPut) {
                var canvas1 = document.createElement('canvas');
                canvas1.width = canvas.width + 2;
                canvas1.height = canvas.height + 2;
                var c1 = canvas1.getContext('2d');

                c1.putImageData(c.getImageData(0, 0, 1, canvas.height), 0, 1);
                c1.putImageData(c.getImageData(canvas.width - 1, 0, 1, canvas.height), canvas1.width - 1, 1);
                c1.putImageData(c.getImageData(0, 0, canvas.width, 1), 1, 0);
                c1.putImageData(c.getImageData(0, canvas.height - 1, canvas.width, 1), 1, canvas1.height - 1);
                c1.putImageData(c.getImageData(0, 0, canvas.width, canvas.height), 1, 1);
                
                // left top pixel
                (function () {
                    var p1 = c1.getImageData(0, 1, 1, 1);
                    var p2 = c1.getImageData(1, 0, 1, 1);
                    var p = c1.getImageData(0, 0, 1, 1);        
                    c1.putImageData(fillPixel(p, p1, p2), 0, 0);
                })();
                
                // left bottom pixel
                (function () {
                    var p1 = c1.getImageData(0, canvas1.height - 2, 1, 1);
                    var p2 = c1.getImageData(1, canvas1.height - 1, 1, 1);
                    var p = c1.getImageData(0, canvas1.height - 1, 1, 1);
                    c1.putImageData(fillPixel(p, p1, p2), 0, canvas1.height - 1);
                })();
                        
                // right top pixel
                (function () {
                    var p1 = c1.getImageData(canvas1.width - 2, 0, 1, 1);
                    var p2 = c1.getImageData(canvas1.width - 1, 1, 1, 1);
                    var p = c1.getImageData(canvas1.width - 1, 0, 1, 1);
                    c1.putImageData(fillPixel(p, p1, p2), canvas1.width - 1, 0);
                })();
                
                // right bottom pixel
                (function () {
                    var p1 = c1.getImageData(canvas1.width - 2, canvas1.height - 1, 1, 1);
                    var p2 = c1.getImageData(canvas1.width - 1, canvas1.height - 2, 1, 1);
                    var p = c1.getImageData(canvas1.width - 1, canvas1.height - 1, 1, 1);
                    c1.putImageData(fillPixel(p, p1, p2), canvas1.width - 1, canvas1.height - 1);
                })();
                

                var imageData = c.getImageData(0, 0, canvas.width, canvas.height);
                var data = imageData.data;
                
                var imageData1 = c1.getImageData(0, 0, canvas1.width, canvas1.height);
                var data1 = imageData1.data;
                
                for (var y = 1; y < imageData1.height - 1; y++) {
                    for (var x = 1; x < imageData1.width - 1; x++) {
                    
                        var curr = (x - 1) + (y - 1) * imageData.width;            
                        var curr1 = x + y * imageData1.width;
                        var top = x + (y - 1) * imageData1.width;
                        var right = (x + 1) + y * imageData1.width;
                        var bottom = x + (y + 1) * imageData1.width;
                        var left = (x - 1) + y * imageData1.width;
                        
                        top *= 4;
                        right *= 4;
                        bottom *= 4;
                        left *= 4;
                        curr1 *= 4;
                        curr *= 4;

                        var r = data1[curr1] * 4 - (data1[top] + data1[bottom] + data1[right] + data1[left]);
                        var g = data1[curr1 + 1] * 4 - (data1[top + 1] + data1[bottom + 1] + data1[right + 1] + data1[left + 1]);
                        var b = data1[curr1 + 2] * 4 - (data1[top + 2] + data1[bottom + 2] + data1[right + 2] + data1[left + 2]);                
                        
                        data[curr] = r;
                        data[curr + 1] = g;
                        data[curr + 2] = b;
                        
                    }
                }
                
                if (notPut) {
                    return imageData;
                } else {
                    c.putImageData(imageData, 0, 0);        
                }
            }

            function blur () {
                var canvas1 = document.createElement('canvas');
                canvas1.width = canvas.width + 2;
                canvas1.height = canvas.height + 2;
                var c1 = canvas1.getContext('2d');

                c1.putImageData(c.getImageData(0, 0, 1, canvas.height), 0, 1);
                c1.putImageData(c.getImageData(canvas.width - 1, 0, 1, canvas.height), canvas1.width - 1, 1);
                c1.putImageData(c.getImageData(0, 0, canvas.width, 1), 1, 0);
                c1.putImageData(c.getImageData(0, canvas.height - 1, canvas.width, 1), 1, canvas1.height - 1);
                c1.putImageData(c.getImageData(0, 0, canvas.width, canvas.height), 1, 1);
                
                // left top pixel
                (function () {
                    var p1 = c1.getImageData(0, 1, 1, 1);
                    var p2 = c1.getImageData(1, 0, 1, 1);
                    var p = c1.getImageData(0, 0, 1, 1);        
                    c1.putImageData(fillPixel(p, p1, p2), 0, 0);
                })();
                
                // left bottom pixel
                (function () {
                    var p1 = c1.getImageData(0, canvas1.height - 2, 1, 1);
                    var p2 = c1.getImageData(1, canvas1.height - 1, 1, 1);
                    var p = c1.getImageData(0, canvas1.height - 1, 1, 1);
                    c1.putImageData(fillPixel(p, p1, p2), 0, canvas1.height - 1);
                })();
                        
                // right top pixel
                (function () {
                    var p1 = c1.getImageData(canvas1.width - 2, 0, 1, 1);
                    var p2 = c1.getImageData(canvas1.width - 1, 1, 1, 1);
                    var p = c1.getImageData(canvas1.width - 1, 0, 1, 1);
                    c1.putImageData(fillPixel(p, p1, p2), canvas1.width - 1, 0);
                })();
                
                // right bottom pixel
                (function () {
                    var p1 = c1.getImageData(canvas1.width - 2, canvas1.height - 1, 1, 1);
                    var p2 = c1.getImageData(canvas1.width - 1, canvas1.height - 2, 1, 1);
                    var p = c1.getImageData(canvas1.width - 1, canvas1.height - 1, 1, 1);
                    c1.putImageData(fillPixel(p, p1, p2), canvas1.width - 1, canvas1.height - 1);
                })();
                

                var imageData = c.getImageData(0, 0, canvas.width, canvas.height);
                var data = imageData.data;
                
                var imageData1 = c1.getImageData(0, 0, canvas1.width, canvas1.height);
                var data1 = imageData1.data;
                
                for (var y = 1; y < imageData1.height - 1; y++) {
                    for (var x = 1; x < imageData1.width - 1; x++) {
                    
                        var curr = (x - 1) + (y - 1) * imageData.width;            
                        var curr1 = x + y * imageData1.width;
                        var top = x + (y - 1) * imageData1.width;
                        var right = (x + 1) + y * imageData1.width;
                        var bottom = x + (y + 1) * imageData1.width;
                        var left = (x - 1) + y * imageData1.width;
                        
                        top *= 4;
                        right *= 4;
                        bottom *= 4;
                        left *= 4;
                        curr1 *= 4;
                        curr *= 4;


            //            var r = (data1[curr1]);
            //            var g = (data1[curr1 + 1]);
            //            var b = (data1[curr1 + 2]);

                        var r = (data1[curr1] + data1[top] + data1[bottom] + data1[right] + data1[left]) / 5;
                        var g = (data1[curr1 + 1] + data1[top + 1] + data1[bottom + 1] + data1[right + 1] + data1[left + 1]) / 5;
                        var b = (data1[curr1 + 2] + data1[top + 2] + data1[bottom + 2] + data1[right + 2] + data1[left + 2]) / 5;
                        
                        data[curr] = r;
                        data[curr + 1] = g;
                        data[curr + 2] = b;
                        
                    }
                }
                

               c.putImageData(imageData, 0, 0);
            }

            function laplacianFilter () {
                var edgeData = edgeDetection(true);
                var eData = edgeData.data;
                
                var imageData = c.getImageData(0, 0, canvas.width, canvas.height);
                var data = imageData.data;
                
                for (var i = 0; i < data.length; i += 4) {
                    var r = data[i] + eData[i],
                        g = data[i + 1] + eData[i + 1],
                        b = data[i + 2] + eData[i + 2];

                    data[i] = r;
                    data[i + 1] = g;
                    data[i + 2] = b;
                }
                c.putImageData(imageData, 0, 0);
                
            }

            function fillPixel (p, p1, p2) {
                p1 = p1.data;
                p2 = p2.data;
                var pd = p.data;
                pd[0] = (p1[0] + p2[0]) / 2; /* red */
                pd[1] = (p1[1] + p2[1]) / 2; /* green */
                pd[2] = (p1[2] + p2[2]) / 2; /* blue */
                pd[3] = 255;
                return p;
            }
        }

    }
})        
