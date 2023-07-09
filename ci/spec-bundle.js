var testContext = require.context("../src", true, /\.spec\.ts$/);

function requireAll(context) {
    return context.keys().map(context);
}

var modules = requireAll(testContext);
