const SHA256 = require('crypto-js/sha256')

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        console.log(this.hash);

        this._nonce = 0;
    }
    get() {
        return {
            previousHash: this.previousHash,
            timestamp: this.timestamp,
            transactions: this.transactions,
            hash: this.hash,
        }
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this._nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this._nonce++;
            this.hash = this.calculateHash();
        }
    }

}

module.exports = Block