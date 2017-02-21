Ext.define('app.menu.Panel', {
    extend: 'Ext.panel.Panel',
    constructor: function () {
        var that = this
        
        var utils = Ext.create('app.Utils')
        
        var menuConfig = [{
            text: 'ფერების შებრუნება',
            filter: 'invertColors'
        }, {
            text: 'შავ-თეთრი',
            filter: 'grayScale'
        }, {
            text: 'ერთფეროვანი',
            filter: 'monochrome'
        }, {
            text: 'სეპია',
            filter: 'sepia'
        }]
        
        var menuItems = Ext.Array.map(menuConfig, function (config) {
            return Ext.create('Ext.button.Button', {
                text: config.text,
                icon: config.icon,
                scale: 'large',
                align: 'center',
                style: {
                    marginLeft: 10
                },
                handler: function () {
                    that.fireEvent('addFilter', config.filter)
                }
            })
        })
        
        var restoreButton = Ext.create('Ext.button.Button', {
            text: 'აღდგენა',
            scale: 'large',
            align: 'center',
            handler: function () {
                that.fireEvent('restoreImage')
            }
        })
        
        menuItems.push('->', restoreButton)
        
        that.tbar = menuItems
        
        that.callParent(arguments)
    }
})
