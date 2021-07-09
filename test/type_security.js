let { RuledBlock } = require("../index.js");
let { Type } = require("type-security");
let { test } = require("./test_util.js");

let my_rules = new RuledBlock()
.add_rule({
    argument_types: Type.interface(["number", "string"]),
    return_type: "number",
    condition(n/*, s*/) {
        return n === 8
    },
    execute() {
        return 8;
    }
}).add_rule({
    argument_types: Type.interface(["number", "number"]),
    return_type: "string",
    condition(x, y) {
        return x == y && x == 6;
    },
    execute() {
        return "3"
    }
}).add_rule({
    argument_types: Type.interface(["number", "string", "number"]),
    return_type: ["number", "string"],
    execute(index, ...arr) {
        return arr[index];
    }
});

test(my_rules.run(8, "unused string"), 8);
test(my_rules.run(6, 6), "3");

let just_run = my_rules.run.bind(my_rules);
test(just_run(0, "Quick brown fox", 128), "Quick brown fox");
test(just_run(1, "Quick brown fox", 128), 128);
test(just_run(":(") == undefined);

