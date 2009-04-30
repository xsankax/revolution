<?php
/**
 * Create a content type
 *
 * @param string $name The new name
 * @param string $description (optional) A short description
 * @param string $mime_type The MIME type for the content type
 * @param string $file_extensions A list of file extensions associated with this
 * type
 * @param string $headers Any headers to be sent with resources with this type
 * @param boolean $binary If true, will be sent as binary data
 *
 * @package modx
 * @subpackage processors.system.contenttype
 */
$modx->lexicon->load('content_type');

if (!$modx->hasPermission('content_types')) return $modx->error->failure($modx->lexicon('permission_denied'));

if (!isset($_POST['name']) || $_POST['name'] == '') {
    return $modx->error->failure($modx->lexicon('content_type_err_ns_name'));
}

$ct = $modx->newObject('modContentType');
$ct->fromArray($_POST);

if ($ct->save() == false) {
    $modx->error->checkValidation($ct);
    return $modx->error->failure($modx->lexicon('content_type_err_create'));
}


/* log manager action */
$modx->logManagerAction('content_type_create','modContentType',$ct->get('id'));

return $modx->error->success('',$ct);