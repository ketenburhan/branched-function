let { RuledBlock } = require("../index.js");
let { test } = require("./test_util.js");

let my_rules = new RuledBlock( (_x, _y, param) => { // no match function [else]
    return null;
}).add_rule({
    condition(x, y, z) {
        return x == y || y == z;
    },
    execute(x, y, z) {
        return y;
    },
}).add_rule({
    condition: (x, y) => x * 2 == y,
    execute(x, y) {
        return y;
    }
});

test(my_rules.run(2, 3, 3), 3);
// expected log: `special middle 2 3 3`

test(my_rules.run(5, 10, null), 10);
// expected log: `5 * 2 = 10`

test(my_rules.run("unused", "string", 9), null);
// expected log: `nope 9`
