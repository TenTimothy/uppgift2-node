import {v4 as uuidv4} from 'uuid';

export default class Transaction {
    constructor({sender, recipient, amount}) {
        this.id = uuidv4().replaceAll('-', '');
        this.outputMap = this.createOutputMap({sender, recipient, amount});
        this.inputMap = this.createInputMap({sender, outputMap: this.outputMap});
    }

    createOutputMap({sender, recipient, amount}) { 
        const outputMap = {};

        outputMap[recipient] = amount;
        outputMap[sender.publicKey] = sender.balance - amount;

        return outputMap;
    }

    createInputMap({sender, outputMap}) { 
        // Implementera logiken för inputMap här eller ta bort metoden om den inte behövs.
    }
}
