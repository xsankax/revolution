<?php
/**
 * @package modx
 * @subpackage registry.db.mysql
 */
require_once (strtr(realpath(dirname(dirname(__FILE__))), '\\', '/') . '/moddbregistertopic.class.php');
class modDbRegisterTopic_mysql extends modDbRegisterTopic {
    function modDbRegisterTopic_mysql(& $xpdo) {
        $this->__construct($xpdo);
    }
    function __construct(& $xpdo) {
        parent :: __construct($xpdo);
    }
}
?>