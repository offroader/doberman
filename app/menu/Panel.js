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
                //scale: 'large',
                align: 'center',
                handler: function () {
                    that.fireEvent('addFilter', config.filter)
                }
            })
        })
        
        var downloadButton = Ext.create('Ext.button.Button', {
            text: 'გადმოწერა',
            iconCls: 'fa fa-download',
            align: 'center',
            handler: function () {
                that.fireEvent('downloadImage')
            }
        })
        
        var newButton = Ext.create('Ext.button.Button', {
            text: 'ახალი',
            iconCls: 'fa fa-file-o',
            align: 'center',
            handler: function () {
                that.fireEvent('clearImage')
            }
        })
        
        var restoreButton = Ext.create('Ext.button.Button', {
            text: 'აღდგენა',
            iconCls: 'fa fa-clipboard',
            align: 'center',
            handler: function () {
                that.fireEvent('restoreImage')
            }
        })
        
        var logoButton = Ext.create('Ext.button.Button', {
            text: 'Doberman',
            icon: 'static/icon/track.png',
            scale: 'large',
            align: 'center',
            style: {
                marginRight: '20px'
            },
            disabled: true
        })

        menuItems.unshift(logoButton)
        menuItems.push('->', downloadButton, newButton, restoreButton)
        
        that.tbar = menuItems
        
        that.callParent(arguments)
    }
})
