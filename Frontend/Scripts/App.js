var app = angular
    .module('app', ['ui.bootstrap', 'ngTagsInput', 'uiSwitch', 'ngAnimate', 'toastr'//, 'ui.bootstrap.datetimepicker'
    ])
    .filter('jsonDate', ['$filter', function () {
        return function (input) {
            
            return (input)
                   ? (new Date(parseInt(input.substr(6))))
                   : '';
        };
    }]).filter('numberFixedLen', function () {
        
        return function (n, len) {
            var num = parseInt(n, 10);
            len = parseInt(len, 10);
            if (isNaN(num) || isNaN(len)) {
                return n;
            }
            num = '' + num;
            while (num.length < len) {
                num = '0' + num;
            }
            return num;
        };
    });