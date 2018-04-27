Ext.define('app.image.resize.Window', {
    extend: 'Ext.window.Window',
    title: 'ზომის შეცვლა',
    layout: 'fit',
    buttonAlign: 'center',
    autoShow: true,
    width: 400,
    height: 250,
    closable: false,
    resizable: false,
    constructor: function (config) {
        var that = this
        
        var width = config.currentWidth
        var height = config.currentHeight
        
        var ratioW = width/height
        var ratioH = height/width
        
        var widthField = Ext.create('Ext.form.field.Number', {
            value: width,
            minValue: 1,
            maxValue: 5000,
            increment: 1,
            width: 100,
            listeners: {
                change: function (f, value) {
                    heightField.suspendEvents()
                    heightField.setValue(Math.round(value / ratioW))
                    heightField.resumeEvents()
                }
            }
        })
        
        var heightField = Ext.create('Ext.form.field.Number', {
            value: height,
            minValue: 1,
            maxValue: 5000,
            increment: 1,
            width: 100,
            listeners: {
                change: function (f, value) {
                    widthField.suspendEvents()
                    widthField.setValue(Math.round(value / ratioH))
                    widthField.resumeEvents()
                }
            }
        })
        
        var errorField = Ext.create('Ext.form.field.Display', {
            hidden: true,
            value: 'მაქსიმალური ზომა 5000x5000',
            fieldStyle: {
                color: 'red',
                fontStyle: 'italic',
                marginLeft: '70px'
            }
        })
        
        that.items = [{
            xtype: 'form',
            border: false,
            bodyPadding: 20,
            layout: 'anchor',
            items: [{
                xtype: 'fieldcontainer',
                fieldLabel: 'სიგანე',
                labelAlign: 'right',
                anchor: '100%',
                layout: 'hbox',
                items: [widthField, {
                    xtype: 'displayfield',
                    value: 'px',
                    margin: '0 0 0 10'
                }]
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: 'სიმაღლე',
                labelAlign: 'right',
                anchor: '100%',
                layout: 'hbox',
                items: [heightField, {
                    xtype: 'displayfield',
                    value: 'px',
                    margin: '0 0 0 10'
                }]
            }, errorField]
        }]
        
        that.buttons = [{
            text: 'შენახვა',
            handler: function () {
                if (widthField.isValid() && heightField.isValid()) {
                    errorField.hide()
                    that.fireEvent('save', {
                        width: widthField.getValue(),
                        height: heightField.getValue()
                    })
                    that.close()
                } else {
                    errorField.show()
                }
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
