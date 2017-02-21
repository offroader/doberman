function createViewport () {
    Ext.QuickTips.init()
        
    var viewport = Ext.create('Ext.Viewport', {
        layout: 'fit',
        renderTo: document.body,
        items: [Ext.create('app.Panel')]
    })
}
