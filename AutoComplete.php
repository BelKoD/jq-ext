<?php

namespace belkod\jqext;

use yii\helpers\Html;

/**
 * AutoComplete renders an autocomplete jQuery widget.
 *
 * For example:
 *
 * ```php
 * echo AutoComplete::widget([
 *     'model' => $model,
 *     'attribute' => 'country',
 *     'clientOptions' => [
 *         'lookup' => ['USA', 'RUS'],
 *     ],
 * ]);
 * ```
 *
 * The following example will use the name property instead:
 *
 * ```php
 * echo AutoComplete::widget([
 *     'name' => 'country',
 *     'clientOptions' => [
 *         'lookup' => ['USA', 'RUS'],
 *     ],
 * ]);
 * ```
 *
 * @since 2.0
 */
class AutoComplete extends InputWidget
{
    /**
     * Renders the widget.
     */
    public function run()
    {
        echo $this->renderWidget();
        $this->registerWidget('autocomplete', AutoCompleteAsset::className());
    }

    /**
     * Renders the AutoComplete widget.
     * @return string the rendering result.
     */
    public function renderWidget()
    {
        if ($this->hasModel()) {
            return Html::activeTextInput($this->model, $this->attribute, $this->options);
        } else {
            return Html::textInput($this->name, $this->value, $this->options);
        }
    }
}
