Ext.define('app.menu.Panel', {
    extend: 'Ext.panel.Panel',
    constructor: function () {
        var that = this
        
        const ITEM_WIDTH = 160
        
        var utils = Ext.create('app.Utils')
        
        var menuConfig = [{
            text: 'შავ-თეთრი',
            filter: 'grayScale',
            icon: 'static/icon/grayscale.png'
        }, {
            text: 'ერთფეროვანი',
            filter: 'monochrome',
            iconCls: 'fa fa-square'
        }, {
            text: 'ოტსუს მეთოდი',
            filter: 'monochromeOtsu',
            iconCls: 'fa fa-square'
        }, {
            text: 'ინვერსია',
            filter: 'invertColors',
            icon: 'static/icon/inverse.png'
        }, {
            text: 'სეპია',
            filter: 'sepia',
            icon: 'static/icon/sepia.png'
        }, {
            text: 'სეპია-2',
            filter: 'sepia2',
            icon: 'static/icon/sepia.png'
        }, {
            text: 'ბუნდოვანი',
            filter: 'blur',
            icon: 'static/icon/blur.png'
        }, {
            text: 'ლაპლასის ფილტრი',
            filter: 'laplacian',
            icon: 'static/icon/laplace.png'
        }, {
            text: 'წიბოების დეტექცია',
            filter: 'edgeDetection',
            icon: 'static/icon/edge.png'
        }]
        
        var filterMenuItems = Ext.Array.map(menuConfig, function (config) {
            return Ext.create('Ext.menu.Item', {
                text: config.text,
                icon: config.icon,
                iconCls: config.iconCls,
                align: 'center',
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
            iconCls: 'fa fa-file-o',
            width: ITEM_WIDTH,
            textAlign: 'left',
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
            iconCls: 'fa fa-filter',
            width: ITEM_WIDTH,
            textAlign: 'left',
            handler: expandMenu,
            menu: Ext.create('Ext.menu.Menu', {
                items: filterMenuItems
            })
        })
        
        var editMenu = Ext.create('Ext.button.Split', {
            text: 'რედაქტირება',
            iconCls: 'fa fa-pencil',
            width: ITEM_WIDTH,
            textAlign: 'left',
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
                    iconCls: 'fa fa-arrows-h',
                    handler: function () {
                        that.fireEvent('flipH')
                    }
                }, {
                    text: 'ვერტ. ანარეკლი',
                    iconCls: 'fa fa-arrows-v',
                    handler: function () {
                        that.fireEvent('flipV')
                    }
                }, {
                    text: 'ამოჭრა',
                    iconCls: 'fa fa-crop',
                    handler: function () {
                        that.fireEvent('crop')
                    }
                }]
            })
        })
        
        var contrastButton = Ext.create('Ext.button.Button', {
            icon: 'static/icon/grayscale.png',
            style: {marginRight: '0'},
            handler: function () {
            	that.fireEvent('contrast', contrastField.getValue())
            }
        })
        
        var contrastField = Ext.create('Ext.form.field.Number', {
        	width: 80,
        	minValue: -255,
        	maxValue: 255,
        	value: 0,
        	listeners: {
        		change: function (field) {
        			that.fireEvent('contrast', field.getValue())
        		}
        	}
        })
        
        that.tbar = [logo, fileMenu, filterMenu, contrastButton, contrastField, editMenu]
        
        that.callParent(arguments)
        
        function expandMenu (button) {
            button.showMenu()
        }
    }
})
