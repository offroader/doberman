Ext.define('app.Panel', {
    extend: 'Ext.panel.Panel',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'center'
    },
    constructor: function () {
        var that = this
        
        var menuPanel = Ext.create('app.menu.Panel', {
            listeners: {
                addFilter: function (filter) {
                    imagePanel.addFilter(filter)
                },
                downloadImage: function () {
                    imagePanel.downloadImage()
                },
                restoreImage: function () {
                    imagePanel.restoreImage()
                },
                clearImage: function () {
                    imagePanel.clearImage()
                },
                rotateLeft: function () {
                    imagePanel.rotateLeft()
                },
                rotateRight: function () {
                    imagePanel.rotateRight()
                }
            }
        })
        
        var imagePanel = Ext.create('app.image.Panel', {
            flex: 1
        })
        
        that.items = [menuPanel, imagePanel]
        
        that.callParent(arguments)
    }
})
