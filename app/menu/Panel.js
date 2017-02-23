Ext.define('app.menu.Panel', {
    extend: 'Ext.panel.Panel',
    constructor: function () {
        var that = this
        
        const ITEM_WIDTH = 150
        
        var utils = Ext.create('app.Utils')
        
        var menuConfig = [{
            text: 'შავ-თეთრი',
            filter: 'grayScale'
        }, {
            text: 'ერთფეროვანი',
            filter: 'monochrome'
        }, {
            text: 'ინვერსია',
            filter: 'invertColors'
        }, {
            text: 'სეპია',
            filter: 'sepia'
        }]
        
        var filterMenuItems = Ext.Array.map(menuConfig, function (config) {
            return Ext.create('Ext.menu.Item', {
                text: config.text,
                icon: config.icon,
                align: 'center',
                width: ITEM_WIDTH,
                handler: function () {
                    that.fireEvent('addFilter', config.filter)
                }
            })
        })
        
        var logo = Ext.create('Ext.button.Button', {
            text: 'Doberman',
            icon: 'static/icon/favicon.png',
            scale: 'large',
            align: 'center',
                border: false,
            style: {
                marginRight: '20px'
            },
            disabled: true
        })
        
        var fileMenu = Ext.create('Ext.button.Split', {
            text: 'ფაილი',
            width: ITEM_WIDTH,
            handler: expandMenu,
            menu: Ext.create('Ext.menu.Menu', {
                items: [{
                    text: 'გადმოწერა',
                    iconCls: 'fa fa-download',
                    align: 'center',
                    width: ITEM_WIDTH,
                    handler: function () {
                        that.fireEvent('downloadImage')
                    }
                }, {
                    text: 'ახალი',
                    iconCls: 'fa fa-file-o',
                    align: 'center',
                    handler: function () {
                        that.fireEvent('clearImage')
                    }                
                }, {
                    text: 'აღდგენა',
                    iconCls: 'fa fa-clipboard',
                    align: 'center',
                    handler: function () {
                        that.fireEvent('restoreImage')
                    }
                }]
            })
        })
        
        var filterMenu = Ext.create('Ext.button.Split', {
            text: 'ფილტრი',
            width: ITEM_WIDTH,
            handler: expandMenu,
            menu: Ext.create('Ext.menu.Menu', {
                items: filterMenuItems
            })
        })
        
        var editMenu = Ext.create('Ext.button.Split', {
            text: 'რედაქტირება',
            width: ITEM_WIDTH,
            handler: expandMenu,
            menu: Ext.create('Ext.menu.Menu', {
                items: [{
                    text: '90° მარცხნივ',
                    iconCls: 'fa fa-undo',
                    width: ITEM_WIDTH,
                    handler: function () {
                        that.fireEvent('rotateLeft')
                    }
                }, {
                    text: '90° მარჯვნივ',
                    iconCls: 'fa fa-repeat',
                    handler: function () {
                        that.fireEvent('rotateRight')
                    }
                }, {
                    text: 'ჰორიზ. ანარეკლი',
                    handler: function () {
                        that.fireEvent('flipH')
                    }
                }, {
                    text: 'ვერტ. ანარეკლი',
                    handler: function () {
                        that.fireEvent('flipV')
                    }
                }]
            })
        })

        that.tbar = [logo, fileMenu, filterMenu, editMenu]
        
        that.callParent(arguments)
        
        function expandMenu (button) {
            button.showMenu()
        }
    }
})
