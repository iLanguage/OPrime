console.log("Loading the LocaleServices.");

'use strict';
define([ "angular", "locale/en/messages.json", "locale/fr/messages.json" ],
    function(angular, Locale_en, Locale_fr) {
      var LocaleService = angular.module('Locale.services', [ 'ngResource' ])

      /**
       * Initialize locales for the app
       */
      .factory("Locale", function(iso_code) {

        /*
         * Load user's locale for the user interface.
         */
        var locale_en_strings = {};
        var locale_zh_cn_strings = {};
        var availableLocales = [ "en", "fr" ];
        Locale_en = JSON.parse(Locale_en);
        Locale_fr = JSON.parse(Locale_fr);
        for ( var item in Locale_en) {
          locale_en_strings[item] = Locale_en[item].message;
          try {
            locale_fr_strings[item] = Locale_fr[item].message;
          } catch (e) {
            locale_fr_strings[item] = "Translate " + Locale_en[item].message;
          }
        }
        if (!iso_code) {
          iso_code = navigator.language;
        }
        if (iso_code.indexOf("fr") == 0) {
          window.locale = locale_fr_strings;
        } else {
          window.locale = locale_en_strings;
        }
        window.localeCode = iso_code;
        window.locale_en_strings = locale_en_strings;
        window.locale_fr_strings = locale_fr_strings;
        return {
          /**
           * If the User currently has English, switch to simplified Chinese,
           * else switch it to English. Note: if we have more than 2
           * localizations we should refactor this method to take in an ISO
           * language code.
           * 
           * @param iso_code
           * @returns a language object which can be stored in the scope
           */
          'changeLanguage' : function(iso_code) {
            /* If there is only one locale, don't bother with the logic */
            if (availableLocales.length < 2) {
              return window.localeCode;
            }
            /*
             * If the user didn't say which language they want, go to the next
             * available language
             */
            if (!iso_code) {
              var currentLocale = availableLocales.indexOf(window.localeCode);
              nextLocale = (currentLocale + 1) % availableLocales.length;
              iso_code = availableLocales[nextLocale];
            }
            /* If the language isn't different, don't bother changing it */
            if (iso_code == window.localeCode) {
              return iso_code;
            }
            if (iso_code.indexOf("fr") == 0) {
              window.locale = locale_fr_strings;
            } else {
              window.locale = locale_en_strings;
            }
          },
        };
      });
      return LocaleService;
    });