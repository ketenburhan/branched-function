let {Type} = require("type-security");

const default_rule = {
    description: `[no description]`,
    argument_types: "any",
    return_type: "any",
    condition() {
        return true;
    },
    execute() {},
};
const add_rule_interface = Type.interface({
    description: ["string", false],
    argument_types: "any",
    return_type: "any",
    condition: ["function", false],
    execute: "function",
});

class RuledBlock {
    no_match_function;
    rules = [];
    constructor(no_match_function=null) {
        if (!Type.check(no_match_function, ["function", "null"])) {
            console.error(new TypeError("invalid arguments"));
            return;
        }
        this.no_match_function = no_match_function;
    }
    add_rule(rule) {
        if (!Type.check(rule, add_rule_interface)) {
            // TODO better errors
            console.error(new TypeError("invalid arguments"));
            return;
        }
        rule = {...default_rule, ...rule};
        this.rules.push(rule);
        return this;
    }
    run(...args) {
        return this.run_debug(...args)[0];
    }
    run_debug(...args) {
        for (let rule of this.rules) {
            if (RuledBlock.test_rule(rule, ...args)) {
                let result = rule.execute(...args);
                if (!Type.check(result, rule.return_type)) {
                    console.warn(`Unexpected return type\nexpected: ${rule.return_type}\nfound: ${Type.whatis(result)}\nrule:\n${RuledBlock.debug_string_rule(rule)}`);
                }
                return [result, rule];
            }
        }
        if (this.no_match_function === null) {
            console.error(`invalid parameters: no matched rule for this arguments`);
            return [undefined, undefined];
        }
        return [this.no_match_function(...args), null];
    }
    static test_rule(rule, ...value) {
        if (!Type.check(rule, add_rule_interface)) {
            // TODO better errors
            console.error(new TypeError("invalid arguments"));
            return;
        }
        let {argument_types, condition} = rule;
        return  Type.check(value, argument_types) &&
                (condition === undefined ||
                    (Type.is_function(condition) && condition(...value))
                );
    }
    get debug_string() {
        // TODO better printing for array_of, not, interface etc.
        return JSON.stringify(this, (key, value) => {
            if (Type.is_function(value)) {
                return value.toString();
            }
            return value;
        }, '\t');
    }
    static debug_string_rule(rule) {
        if (!Type.check(rule, add_rule_interface)) {
            // TODO better errors
            console.error(new TypeError("invalid arguments"));
            return;
        }
        // TODO better printing for array_of, not, interface etc.
        return JSON.stringify(rule, (key, value) => {
           if (Type.is_function(value)) {
               return value.toString();
           }
           return value;
       }, '\t');
    }
}

module.exports = {
    RuledBlock
}