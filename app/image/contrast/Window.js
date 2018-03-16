Ext.define('app.image.contrast.Window', {
    extend: 'Ext.window.Window',
    title: 'კონტრასტი',
    layout: 'fit',
    buttonAlign: 'center',
    autoShow: true,
    width: 500,
    height: 180,
    bodyPadding: 20,
    closable: false,
    resizable: false,
    constructor: function (config) {
        var that = this
        
        var slider = Ext.create('Ext.slider.Single', {
    	    minValue: -128,
    	    maxValue: 128,
            value: config.currentValue,
    	    increment: 1,
            hideLabel: true,
            anchor: '100%',
            listeners: {
            	change: function (f, value) {
            		that.fireEvent('contrastChange', value)
            	}
            }
        })
        
        that.items = [slider]
        
        window.slider = slider
        
        that.buttons = [{
            text: 'შენახვა',
            handler: function () {
                that.fireEvent('contrastSave', slider.getValue())
                that.close()
            }
        }, {
            text: 'გაუქმება',
            handler: function () {
                that.fireEvent('contrastCancel')
                that.close()
            }
        }]
        
        that.callParent(arguments)
        
        
                
    }
}) 
