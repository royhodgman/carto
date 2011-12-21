(function(tree) {

//
// A function call node.
//
tree.Call = function Call(name, args, index) {
    this.name = name;
    this.args = args;
    this.index = index;
};
tree.Call.prototype = {
    //
    // When evaluating a function call,
    // we either find the function in `tree.functions` [1],
    // in which case we call it, passing the  evaluated arguments,
    // or we simply print it out as it appeared originally [2].
    //
    // The *functions.js* file contains the built-in functions.
    //
    // The reason why we evaluate the arguments, is in the case where
    // we try to pass a variable to a function, like: `saturate(@color)`.
    // The function should receive the value, not the variable.
    //
    eval: function(env) {
        var args = this.args.map(function(a) { return a.eval(env); });

        for (var i = 0; i < args.length; i++) {
            if (args[i].is === 'undefined') {
                return {
                    is: 'undefined',
                    value: 'undefined'
                };
            }
        }

        if (this.name in tree.functions) { // 1.
            if (tree.functions[this.name].length === args.length) {
                return tree.functions[this.name].apply(tree.functions, args);
            } else {
                env.error({
                    message: 'incorrect number of arguments for ' + this.name +
                        '(). ' + tree.functions[this.name].length + ' expected.',
                    index: this.index,
                    type: 'runtime',
                    filename: this.filename
                });
                return {
                    is: 'undefined',
                    value: 'undefined'
                };
            }
        } else { // 2.
            return new tree.Anonymous(this.name +
                   '(' + args.map(function(a) { return a.toString(); }).join(', ') + ')');
        }
    },

    toString: function(env) {
        return this.eval(env).toString();
    }
};

})(require('../tree'));
