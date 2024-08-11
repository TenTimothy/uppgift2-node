export default class Transaction {
    constructor({sender, recipient, amount}) {
        this.id = 1;
        this.outputMap = {}
        this.inputMap = {}
    }
}

