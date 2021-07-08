class Branched {
    cond = null;
    func = null;
    else_block = null;
    constructor({ cond=null, func=()=>{}, else_block=()=>{} }) {
        this.cond = cond;
        this.func = func;
        this.else_block = else_block;
    }
    run() {
        // just run if `cond` is `null`
        if (this.cond === null) {
            return this.func(...arguments);
        }
        // run if `cond` function returns true with the arguments
        if (typeof this.cond === "function" && this.cond(...arguments)) {
            return this.func(...arguments);
        }
        // otherwise, run `sub_branch` if exist and it is a `Branched`
        if (this.else_block.constructor === Branched) {
            return this.else_block.run(...arguments);
        }
        // otherwise, run `sub_branch` if exist and it is a `Function`
        if (typeof this.else_block === "function") {
            return this.else_block(...arguments);
        }
    }
}

module.exports = {
    Branched
}