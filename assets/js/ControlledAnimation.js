ControlledAnimation = function (element, animationName, opts) {
    this.element = $(element);
    this.animationName = animationName;
    this.options = $.extend(this.defaults, opts);

    if (this.options.runOnce && localStorage) {
        if (localStorage['animation--' + animationName] === "done") {
            $('body').addClass(animationName + '-off');
            return; // -------------------------------------------------------------- exiting
        }
    }
    this.init();
    this.start = new Date().getTime();
};

$.extend(ControlledAnimation.prototype, {
    current: 0,
    defaults: {
        initialDelay: 0,
        delay: 1, // seconds
        runOnce: false
    },

    init: function () {
        this.markAs('initiated');
        setTimeout($.proxy(this.step, this), this.options.initialDelay * 1000);
    },
    step: function () {
        this.current++;

        this.start = this.start || new Date().getTime();

        var target = this.element.find('.animation-step-' + this.current);
        if (target.length) {
            this.markAs('step-'+this.current);

            // console.log('Step ' + this.current + '. ' + (+((new Date().getTime() - this.start) / 1000).toFixed(2)) + 's');
            target
                .addClass(target.attr('data-animation'))
                .addClass('animated')
            ;
            setTimeout ($.proxy(this.step, this), this.options.delay * 1000);
        } else {
            // console.log('Step ' + this.current + ' Failed! — not found.');
            this.markAs('done');
        } 
    },
    markAs: function (status) {
        if (localStorage) {
            localStorage['animation--' + this.animationName] = status;
        }
    },
    reenable: function () {
    	$('body').removeClass(this.animationName + '-off');
    	this.init();
    }
});