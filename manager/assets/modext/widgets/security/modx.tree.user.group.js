/**
 * Generates the User Group Tree
 *
 * @class MODx.tree.UserGroup
 * @extends MODx.tree.Tree
 * @param {Object} config An object of options.
 * @xtype modx-tree-usergroup
 */
MODx.tree.UserGroup = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('user_groups')
        ,id: 'modx-tree-usergroup'
        ,url: MODx.config.connectors_url+'security/group.php'
        ,root_id: 'n_ug_0'
        ,root_name: _('user_groups')
        ,enableDrag: true
        ,enableDrop: true
        ,rootVisible: false
        ,ddAppendOnly: true
        ,useDefaultToolbar: true
        ,tbar: [{
            text: _('user_group_new')
            ,scope: this
            ,handler: this.create.createDelegate(this,[true],true)
        }]
    });
    MODx.tree.UserGroup.superclass.constructor.call(this,config);
};
Ext.extend(MODx.tree.UserGroup,MODx.tree.Tree,{	
    windows: {}
	
    ,addUser: function(item,e) {
        var n = this.cm.activeNode;
        var ug = n.id.substr(2).split('_'); ug = ug[1];
        if (ug === undefined) { ug = 0; }
        var r = {usergroup: ug};

        if (!this.windows.adduser) {
            this.windows.adduser = MODx.load({
                xtype: 'modx-window-usergroup-adduser'
                ,record: r
                ,listeners: {
                    'success': {fn:this.refresh,scope:this}
                }
            });
        }
        this.windows.adduser.setValues(r);
        this.windows.adduser.show(e.target);
    }
	
    ,create: function(item,e,tbar) {
        tbar = tbar || false;
        var p;
        if (tbar === false) {
            var n = this.cm.activeNode;
            p = n.id.substr(2).split('_'); p = p[1];
            if (p === undefined) { p = 0; }
        } else { p = 0; }

        var r = {'parent': p};

        if (!this.windows.createUsergroup) {
            this.windows.createUsergroup = MODx.load({
                xtype: 'modx-window-usergroup-create'
                ,record: r
                ,listeners: {
                    'success': {fn:this.refresh,scope:this}
                }
            });
        } else {
            this.windows.createUsergroup.setValues(r);
        }
        this.windows.createUsergroup.show(e.target);
    }
    
    ,update: function(item,e) {
        var n = this.cm.activeNode;
        var id = n.id.substr(2).split('_'); id = id[1];
        
        location.href = 'index.php'
            + '?a=' + MODx.action['security/usergroup/update']
            + '&id=' + id;
    }
	
    ,remove: function(item,e) {
        var n = this.cm.activeNode;
        var id = n.id.substr(2).split('_'); id = id[1];

        MODx.msg.confirm({
            title: _('warning')
            ,text: _('user_group_remove_confirm')
            ,url: this.config.url
            ,params: {
                action: 'remove'
                ,id: id
            }
            ,listeners: {
                'success': {fn:this.refresh,scope:this}
            }
        });
    }

    ,removeUser: function(item,e) {
        var n = this.cm.activeNode;
        var user_id = n.id.substr(2).split('_'); user_id = user_id[1];
        var group_id = n.parentNode.id.substr(2).split('_'); group_id = group_id[1];

        MODx.msg.confirm({
            title: _('warning')
            ,text: _('user_group_user_remove_confirm')
            ,url: this.config.url
            ,params: {
                action: 'removeUser'
                ,user_id: user_id
                ,group_id: group_id
            }
            ,listeners: {
                'success':{fn:this.refresh,scope:this}
            }
        });
    }
});
Ext.reg('modx-tree-usergroup',MODx.tree.UserGroup);

MODx.window.CreateUserGroup = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('user_group_create')
        ,height: 150
        ,width: 400
        ,url: MODx.config.connectors_url+'security/usergroup/index.php'
        ,action: 'create'
        ,fields: [{
            xtype: 'hidden'
            ,name: 'parent'
            ,value: 0
        },{
            fieldLabel: _('name')
            ,name: 'name'
            ,hiddenName: 'name'
            ,id: 'modx-cug-name'
            ,xtype: 'textfield'
            ,allowBlank: false
            ,anchor: '90%'
        }]
    });
    MODx.window.CreateUserGroup.superclass.constructor.call(this,config);
};
Ext.extend(MODx.window.CreateUserGroup,MODx.Window);
Ext.reg('modx-window-usergroup-create',MODx.window.CreateUserGroup);

MODx.window.CreateUserGroup = function(config) {
    config = config || {};
    this.ident = config.ident || 'cugrp'+Ext.id();
    Ext.applyIf(config,{
        title: _('create_user_group')
        ,id: this.ident
        ,height: 150
        ,width: 375
        ,url: MODx.config.connectors_url+'security/group.php'
        ,action: 'create'
        ,fields: [{
            fieldLabel: _('name')
            ,name: 'name'
            ,id: 'modx-'+this.ident+'-name'
            ,xtype: 'textfield'
            ,anchor: '90%'
        },{
            name: 'parent'
            ,id: 'modx-'+this.ident+'-parent'
            ,xtype: 'hidden'
        }]
    });
    MODx.window.CreateUserGroup.superclass.constructor.call(this,config);
};
Ext.extend(MODx.window.CreateUserGroup,MODx.Window);
Ext.reg('modx-window-usergroup-create',MODx.window.CreateUserGroup);

MODx.window.AddUserToUserGroup = function(config) {
    config = config || {};
    this.ident = config.ident || 'adtug'+Ext.id();
    Ext.applyIf(config,{
        title: _('user_group_user_add')
        ,id: this.ident
        ,height: 150
        ,width: 375
        ,url: MODx.config.connectors_url+'security/usergroup/user.php'
        ,action: 'create'
        ,fields: [{
            fieldLabel: _('name')
            ,name: 'user'
            ,hiddenName: 'user'
            ,xtype: 'modx-combo-user'
            ,editable: true
            ,typeAhead: true
            ,id: 'modx-'+this.ident+'-user'
            ,anchor: '90%'
        },{
            fieldLabel: _('role')
            ,name: 'role'
            ,hiddenName: 'role'
            ,xtype: 'modx-combo-role'
            ,id: 'modx-'+this.ident+'-role'
            ,allowBlank: false
            ,anchor: '90%'
        },{
            name: 'usergroup'
            ,xtype: 'hidden'
            ,id: 'modx-'+this.ident+'-user-group'
        }]
    });
    MODx.window.AddUserToUserGroup.superclass.constructor.call(this,config);
};
Ext.extend(MODx.window.AddUserToUserGroup,MODx.Window);
Ext.reg('modx-window-usergroup-adduser',MODx.window.AddUserToUserGroup);