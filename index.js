const express = require('express')
const bodyParser = require('body-parser')
const SHA256 = require('crypto-js/sha256')
const Blockchain = require('./BlockChain')
const Transaction = require('./Transaction')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose');
const uri = "mongodb+srv://admin:admin@rapaduracluster-ny5t7.mongodb.net/test?retryWrites=true";



const router = express.Router()

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors())


router.post('/wallet', (req, res) => {
    const {
        password
    } = req.body;
    const hashPassword = SHA256(password, 'rapadura')
    const chain = new Blockchain(hashPassword)
    chain.createGenesisBlock((err, block) => {
        res.status(201).json({
            data: {
                hash: block.wallet
            }
        })
    })
})

router.get('/transactions', (req, res) => {
    const wallet = req.query.wallet
    const chain = new Blockchain(wallet)

    chain.getTransactions(wallet, (err, blocks) => {
        console.log(err, blocks);


        res.status(302).json({
            data: {
                blocks
            }
        })
    })
})

router.post('/transaction', (req, res) => {
    const {
        wallet,
        toWallet,
        data
    } = req.body
    const chain = new Blockchain(wallet)
    chain.createTransaction(
        new Transaction(
            wallet,
            toWallet,
            data
        )
    )
    chain.commitTransaction((err, block) => {
        res.status(201).json({
            data: {
                address: block.hash
            }
        })
    })
})

app.use(router)
mongoose.connect(uri, {
    useNewUrlParser: true
}, () => {
    app.listen(3002, () => {
        console.log(`Address: 3002`);
    })
});