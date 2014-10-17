<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace belkod\jqext;

use yii\web\AssetBundle;

/**
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class AutoCompleteAsset extends AssetBundle
{
	public $sourcePath = '@belkod/jqext/assets';
    public $js = [
//        'jquery.autocomplete.min.js',
		'jquery.autocomplete.js',
    ];
	public $css = [
    	'theme/jq-autocomplete.css',
	];
	public $depends = [
    	'yii\web\JqueryAsset',
	];
}
