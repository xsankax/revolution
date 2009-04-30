<?php
/**
 * Removes a role.
 *
 * @param integer $id The ID of the role
 *
 * @package modx
 * @subpackage processors.security.role
 */
$modx->lexicon->load('user');

if (!$modx->hasPermission(array('access_permissions' => true, 'delete_role' => true))) {
    return $modx->error->failure($modx->lexicon('permission_denied'));
}

$role = $modx->getObject('modUserGroupRole',$_POST['id']);
if ($role == null) {
    return $modx->error->failure($modx->lexicon('role_err_nfs',array('role' => $_POST['id'])));
}

/* don't delete the Member or Super User roles */
/* TODO: when this is converted in build script, convert to i18n */
if ($role->get('name') == 'Member' || $role->get('name') == 'Super User') {
    return $modx->error->failure($modx->lexicon('role_err_remove_admin'));
}

/* don't delete if this role is assigned */
$cc = $modx->newQuery('modUserGroupMember');
$cc = $cc->where(array('role' => $role->get('id')));
if ($modx->getCount('modUserProfile',$cc) > 0) {
    return $modx->error->failure($modx->lexicon('role_err_has_users'));
}

if ($role->remove() == false) {
    return $modx->error->failure($modx->lexicon('role_err_save'));
}

/* log manager action */
$modx->logManagerAction('role_delete','modUserGroupRole',$role->get('id'));

return $modx->error->success();