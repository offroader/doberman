Ext.define('app.utils.MonochromeOtsu', {
    constructor: function () {
        this.filter = function (canvas) {
            var c = canvas.getContext('2d')
            
            var imageData = c.getImageData(0, 0, canvas.width, canvas.height)

            var histogram = []
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
    }
})
