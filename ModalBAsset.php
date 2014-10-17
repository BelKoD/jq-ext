<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace belkod\jqext;

use Yii;
use yii\web\AssetBundle;

/**
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class ModalBAsset extends AssetBundle
{
    public $sourcePath = '@belkod/jqext/assets';
    public $js = [
        'jq-modal.js'
    ];
    public $css = [
        'theme/jq-modal.css',
    ];
	public $depends = [
    	'yii\web\JqueryAsset',
	];
}
