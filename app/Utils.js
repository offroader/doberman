Ext.define('app.Utils', {
    constructor: function () {
        var that = this
        
        var filters = {
            invertColors: invertColors,
            grayScale: grayScale,
            monochrome: monochrome,
            monochromeOtsu: monochromeOtsu,
            sepia: sepia,
            sepia2: sepia2,
            blur: blur,
            laplacian: laplacian,
            edgeDetection: edgeDetection
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
        that.flipH = flipH
        that.flipV = flipV
        
        that.contrast = function (_canvas, con) {
            canvas = _canvas
        	contrast(canvas.getContext('2d'), con)
        }
        
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

        function sepia2 (c) {
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
        
        function sepia (c) {
            grayScale(c)
            
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
        
        function flipH (c, canvas) {
            var imageData = c.getImageData(0, 0, canvas.width, canvas.height)
            var data = imageData.data
            var length = data.length
            
            var width = canvas.width
            
            var height = canvas.height / 2
            if (height % 2 == 0) {
                height++
            }
            
            var newData = []
            
            for (var j = 0; j < height; j += 4 * width) {
                for (var i = 0; i < width; i++) {
                    newData[length - j * width + i] = data[j * width + i]
                    newData[length - j * width + i + 1] = data[j * width + i + 1]
                    newData[length - j * width + i + 2] = data[j * width + i + 2]
                    newData[length - j * width + i + 3] = data[j * width + i + 3]
                }
            }
            
            for (var i = 0; i < length; i++) {
                data[i] = newData[i]
            }
            
            c.putImageData(imageData, 0, 0)
        }
        
        function flipV (c, canvas) {
            var imageData = c.getImageData(0, 0, canvas.width, canvas.height)
            var data = imageData.data
            var length = data.length
            
            var newData = []
            
            for (var i = 0; i < length; i += 4) {
                var r = data[length - 1 - i - 3],
                    g = data[length - 1 - i - 2],
                    b = data[length - 1 - i - 1],
                    a = data[length - 1 - i];
                    
                newData[i] = r
                newData[i + 1] = g
                newData[i + 2] = b
                newData[i + 3] = a
            }
            
            for (var i = 0; i < length; i += 4) {
                data[i] = newData[i]
                data[i + 1] = newData[i + 1]
                data[i + 2] = newData[i + 2]
                data[i + 3] = newData[i + 3]
            }
            
            c.putImageData(imageData, 0, 0)
        }
        
        function edgeDetection (c, notPut) {
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
        
        function blur (c) {
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

        function laplacian (c) {
            var edgeData = edgeDetection(c, true);
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
        
        
        // https://en.wikipedia.org/wiki/Otsu's_method
        function otsuBug(histogram, pixelsNumber) {
            var sum = 0
              , sumB = 0
              , wB = 0
              , wF = 0
              , mB
              , mF
              , max = 0
              , between
              , threshold = 0;
            for (var i = 0; i < 256; ++i) {
              wB += histogram[i];
              if (wB == 0)
                continue;
              wF = pixelsNumber - wB;
              if (wF == 0)
                break;
              sumB += i * histogram[i];
              mB = sumB / wB;
              mF = (sum - sumB) / wF;
              between = wB * wF * Math.pow(mB - mF, 2);
              if (between > max) {
                max = between;
                threshold = i;
              }
            }
            return threshold;
        }
        
        function otsu (histogram, total) {
            var sum = 0
            for (var i = 0; i < histogram.length; ++i) {
                sum += i * histogram[i]
            }
            
            var sumB = 0;
            var wB = 0;
            var wF = 0;
            var mB;
            var mF;
            var max = 0.0;
            var between = 0.0;
            var threshold1 = 0.0;
            var threshold2 = 0.0;
            
            for (var i = 0; i < histogram.length; ++i) {
                wB += histogram[i];
                if (wB == 0)
                    continue;
                    
                wF = total - wB;
                if (wF == 0)
                    break;
                    
                sumB += i * histogram[i];
                mB = sumB / wB;
                mF = (sum - sumB) / wF;
                between = wB * wF * (mB - mF) * (mB - mF);
                
                if ( between >= max ) {
                    threshold1 = i;
                    if ( between > max ) {
                        threshold2 = i;
                    }
                    max = between;            
                }
            }
            
            return ( threshold1 + threshold2 ) / 2.0;
        }
        
        function monochromeOtsu (c) {
            var imageData = c.getImageData(0, 0, canvas.width, canvas.height)

            var histogram = Array(256)
            for (var i = 0; i < 256; i++) {
                histogram[i] = 0
            }
	            
            for (var i = 0; i < imageData.data.length; i += 4) {
              var red = imageData.data[i]
              var blue = imageData.data[i + 1]
              var green = imageData.data[i + 2]
              
              var gray = red * 0.2126 + green * 0.7152 + blue * 0.0722
              
              histogram[Math.round(gray)] += 1
            }
            
            var threshold = otsu(histogram, imageData.data.length / 4)

            console.log("threshold = %s", threshold)
            
            for (var i = 0; i < imageData.data.length; i += 4) {
                var color = imageData.data[i] >= threshold ? 255 : 0
                imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = color
                imageData.data[i + 3] = 255
            }

            c.putImageData(imageData, 0, 0)
        }
        
        function contrast (c, con) {
        	var imageData = c.getImageData(0, 0, canvas.width, canvas.height)
            
            var data = imageData.data
            
            for (var i = 0; i < data.length; i += 4) {
                var r = data[i],
                    g = data[i + 1],
                    b = data[i + 2],
                    a = data[i + 3];
                    
	            var factor = (259 * (con + 255)) / (255 * (259 - con))
	            
				var newRed   = Math.floor(factor * (r   - 128) + 128)
				var newGreen = Math.floor(factor * (g - 128) + 128)
				var newBlue  = Math.floor(factor * (b  - 128) + 128)
				
                data[i] = newRed
                data[i + 1] = newGreen
                data[i + 2] = newBlue
            }
            
            c.putImageData(imageData, 0, 0)
        }
    }
})
