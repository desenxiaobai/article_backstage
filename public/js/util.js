(function(window, undefined) {
    (function() {
        NProgress.configure({
            showSpinner: false
        });
        NProgress.set(.2);
        let interval = setInterval(function() {
            NProgress.inc(.03);
        }, 400);
        $(window).on('load', function() {
            clearInterval(interval);
            NProgress.done();
        });
    })();

    let util = {
        data_format(data, format = 'YYYY-MM-DD hh:mm:ss') {
            return moment(data).format(format);
        }
    }
    window.util = util;
})(window);