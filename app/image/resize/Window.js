Ext.define('app.image.resize.Window', {
    extend: 'Ext.window.Window',
    title: 'ზომის შეცვლა',
    layout: 'anchor',
    buttonAlign: 'center',
    autoShow: true,
    width: 500,
    height: 200,
    bodyPadding: 20,
    closable: false,
    resizable: false,
    constructor: function (config) {
        var that = this
        
        var width = config.currentWidth
        var height = config.currentHeight
        
        var ratioW = width/height
        var ratioH = height/width
        
        var widthField = Ext.create('Ext.form.field.Number', {
            fieldLabel: 'სიგანე',
            labelAlign: 'right',
            minValue: 0,
            value: width,
            increment: 1,
            width: 200,
            listeners: {
                change: function (f, value) {
                    heightField.suspendEvents()
                    heightField.setValue(Math.round(value / ratioW))
                    heightField.resumeEvents()
                }
            }
        })
        
        var heightField = Ext.create('Ext.form.field.Number', {
            fieldLabel: 'სიგრძე',
            labelAlign: 'right',
            minValue: 0,
            value: height,
            increment: 1,
            width: 200,
            listeners: {
                change: function (f, value) {
                    widthField.suspendEvents()
                    widthField.setValue(Math.round(value / ratioH))
                    widthField.resumeEvents()
                }
            }
        })
        
        that.items = [widthField, heightField]
        
        that.buttons = [{
            text: 'შენახვა',
            handler: function () {
                that.fireEvent('save', {
                    width: widthField.getValue(),
                    height: heightField.getValue()
                })
                that.close()
            }
        }, {
            text: 'გაუქმება',
            handler: function () {
                that.close()
            }
        }]
        
        that.callParent(arguments)
    }
}) 
