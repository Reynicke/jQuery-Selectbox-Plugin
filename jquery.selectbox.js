/**
 * jquery.selectbox.js
 *
 * jQuery 1.4.4 (jquery.com)
 *
 * Takes a select input field and mirrors it with a stylable div construct.
 * The original select element gets hidden but stays in place and is still
 * used to select options and track the value. So the field value can still
 * be submitted in a form.
 * 
 * Take a look at the settings for defining element class names.
 *
 * @usage:
 * $('select').selectbox();
 *
 *
 *
 *
 * The MIT License
 *
 * Copyright (c) 2006-2009 Taku Sano (Mikage Sawatari)
 * Copyright (c) 2010 Takayuki Miwa
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */


// Closure so the public namespace stays clean
(function($) {

$.fn.selectbox = function(options) {

    // Define default settings
    var settings =
        {
            selectClass     : 'jSelectbox',
            selectionClass  : 'selected',
            optionClass     : 'jOption',
            oContainerClass : 'optionContainer',
            animation       : true
        }

    if (options) {
        settings = $.extend(settings, options);
    }

    this.each(function(i, e) {
        var $e = $(e);

        // Mirror the original select element and get the HTML
        var $html = getHTML($e, settings);

        // Add click event listeners and init the box
        initSelect($html, $e);

        // Hide the original select and add our html to the DOM
        $e.after($html).hide();
    })


    /**
     * Generates HTML containing the same information as the given select element
     *
     * @param $e jQuery         A select element
     * @return String           HTML code of a selectbox
     */
    function getHTML($e) {
        var $select   = $('<div></div>').addClass(settings.selectClass).data('elem', $e);
        var $selected = $('<div><div></div></div>').addClass(settings.selectionClass);
        var $optionCn = $('<ul></ul>')
            .addClass(settings.oContainerClass)
            .css( {'position': 'absolute',
                   'z-index' : 9999}
            );

        $select.append($selected);
        $select.append($optionCn);

        var $eOptions = $e.find('option');
        var opLength  = $eOptions.length;
        for (var i = 0; i < opLength; i++) {
            var $option = $('<li></li>')
                .css('position', 'relative')
                .addClass(settings.optionClass)
                .text( $($eOptions[i]).text() )
                .data( 'value' , $($eOptions[i]).val() )

            $optionCn.append($option);
        }

        return $select;
    }


    /**
     * Adds click event handlers and does the initial selection of the selectbox
     *
     * @param $select jQuery    A selectbox construct
     * @param $e jQuery         The original select element
     */
    function initSelect($select, $e) {
        var $options   = $select.find('.' + settings.optionClass);
        var $selection = $select.find('.' + settings.selectionClass);

        $options.click(function() {
            var index = $(this).index();
            var myOption = $e.find('option:eq('+index+')');
            doSelection(myOption, $select);
        })

        $selection.click(function() {
            if ( $select.find('.' + settings.optionClass + ':visible').length ) {
                close($select);
            } else {
                open($select);
            }
        })

        var selectedOption = $e.find('option[selected]');
        var firstOption    = $e.find('option:eq(0)');
        var startOption    = selectedOption.length ? selectedOption : firstOption;

        doSelection(startOption, $select);
    }


    /**
     * Open given selectbox.
     *
     * @param $select jQuery   A selectbox construct
     */
    function open($select) {
        $select.find('.' + settings.oContainerClass).show();

        if (settings.animation) {
            $select.find('.' + settings.optionClass).each(function(i, e) {
                var $e = $(e);
                var pos = $e.position().top;
                $e
                    .css('top', -pos)
                    .animate( {'top': 0}, 50 )
            })
        }
    }


    /**
     * Close given selectbox.
     *
     * @param $select jQuery   A selectbox construct
     */
    function close($select) {
        $select.find('.' + settings.oContainerClass).hide();
    }


    /**
     * Select an option
     *
     * @param option DOM-Element    An option element of the original select
     * @param $select jQuery        A selectbox construct
     */
    function doSelection(option, $select) {
        var $o = $(option);
        var $selection = $select.find('.' + settings.selectionClass);

        $selection.find('>*').text( $o.text() );
        close($select);

        $o.siblings('option').removeAttr('selected');
        $o.attr('selected', 'selected');
    }
}

}(jQuery))