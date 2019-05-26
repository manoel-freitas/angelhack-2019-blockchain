const Block = require('./Block')
const dateTime = require('luxon').DateTime
const BlockModel = require('./block.model')
class Blockchain {
    constructor(wallet) {
        this.wallet = wallet
        this._chain = []
        this._difficulty = 4
        this._pendingTransactions = [];

    }

    createGenesisBlock(callback) {
        const block = new Block(dateTime.local(), "Genesis block", "0")
        const blockModel = new BlockModel({
            wallet: this.wallet,
            ...block
        });
        return blockModel.save(callback)
    }

    getLatestBlock(cb) {
        console.log(this.wallet);

        BlockModel.find({
            wallet: this.wallet,
        }, {}, {
            sort: {
                _id: 0
            },
            limit: 1
        }, cb)
    }

    createTransaction(transaction) {
        this._pendingTransactions.push(transaction);
    }

    commitTransaction(cb) {
        let block = new Block(Date.now(), this._pendingTransaction);
        block.mineBlock(this._difficulty);
        this.getLatestBlock((err, previousBlock) => {
            block.previousHash = previousBlock.hash

            const blockModel = new BlockModel({
                wallet: this.wallet,
                ...block
            })
            blockModel.save(cb)
        })

    }

    getTransactions(wallet, cb) {
        BlockModel.find({
            wallet: wallet,
        }, cb)
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {

                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid() {
        for (let i = 0; i < this._chain.length; i++) {
            const currentBlock = this._chain[i];
            const previousBlock = this._chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (!previousBlock) {
                continue;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

module.exports = Blockchain;