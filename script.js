
        var init = function  () {
            if(!window.localStorage){
              jQuery('body').prepend('Desculpe, seu navegador não suporta armazenamento local');
              return false;
            }
            var sel = jQuery('.daltonismo');
            
            var clearSelected = function  () {
                sel.find(':selected').prop('selected', false);
            }
            var setPreference = function (pref) {
                if (typeof(pref) !== 'string') pref = undefined;
                //remember the ID of the option the user selected
                localStorage.setItem('pref', pref || sel.find(':selected').attr('id'));
                let link = $("#dynamicCSS");
                link.attr("href", sel.find(':selected').attr('value'));
            };
        
            if(localStorage.getItem('pref')){
                var pref = localStorage.getItem('pref');
                clearSelected();
                //set the selected state to true on the option localStorage remembers
                sel.find('#' + pref).prop('selected', true);
                setPreference(pref);
            }

            var reset = function  () {
                clearSelected();
                localStorage.setItem('pref', undefined);
            }
        
            sel.on('change', setPreference);
        };

        jQuery(document).ready(init);
    


            new window.VLibras.Widget('https://vlibras.gov.br/app');
        


// {"prefetch":[{"source":"document","where":{"and":[{"href_matches":"\/*"},{"not":{"href_matches":["\/wp-*.php","\/wp-admin\/*","\/wp-content\/uploads\/sites\/143\/*","\/wp-content\/*","\/wp-content\/plugins\/*","\/wp-content\/themes\/tema-cps\/*","\/*\\?(.+)"]}},{"not":{"selector_matches":"a[rel~=\"nofollow\"]"}},{"not":{"selector_matches":".no-prefetch, .no-prefetch a"}}]},"eagerness":"conservative"}]}



/* <![CDATA[ */
var Getwid = {"settings":[],"ajax_url":"https:\/\/etecjuliodemesquita.cps.sp.gov.br\/wp-admin\/admin-ajax.php","isRTL":"","nonces":{"contact_form":"2fc1120557"}};
/* ]]> */


/* <![CDATA[ */if ( !!window.jQuery ) {(function($){$(document).ready(function(){if ( !!window.SLB ) { {$.extend(SLB, {"context":["public","user_guest"]});} }})})(jQuery);}/* ]]> */


            jQuery(document).ready(function(){
                jQuery('a.icon-box').attr('target', '_blank');
            });
        


            jQuery(window).scroll(function() {    
                var scroll = jQuery(window).scrollTop();
                if (scroll >= 200) {
                    jQuery(".back-to-top").removeClass("hidden");
                } else {
                    jQuery(".back-to-top").addClass("hidden");
                }
            });
            jQuery(document).ready(function(){
                jQuery('.back-to-top').click(function(){
                    jQuery('html, body').animate({scrollTop : 0},800);
                    return false;
                });
            });
        


            if(jQuery(window).width() < 768){
                jQuery('#feed-instagram').remove();
                jQuery('#feed-youtube').remove();
            }  
        