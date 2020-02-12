
const express = require('express');
const app = express();
const cors = require('cors');
const port = 4000;

// Import all function modules
const addToWallet = require('./1_addToWallet');
const registerCompany = require('./2_registerCompany');
const createPO = require('./3_createPO');
const createShipment = require('./4_createShipment');
const retailDrug = require('./5_retailDrug');
const viewHistory = require('./6_viewHistory');
const viewDrugCurrentState = require('./7_viewDrugCurrentState');


// Define Express app settings
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set('title', 'Pharma Network App');

app.get('/', (req, res) => res.send('Hello User'));

app.post('/registerCompany', (req, res) => {
    registerCompany.execute(req.body.companyCRN, req.body..companyName, req.body.Location, req.body.organisationRole).then (() => {
        console.log('Company Registered');
        const result = {
            status: 'success',
            message: 'Company Registered'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/createPO', (req, res) => {
    createPO.execute(req.body.buyerCRN, req.body.sellerCRN, req.body.drugName, req.body.quantity).then (() => {
        console.log('New Drug Added');
        const result = {
            status: 'success',
            message: 'New Drug Added'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});



app.post('/createShipment', (req, res) => {
    createShipment.execute(req.body.buyerCRN, req.body.drugName, req.body.listOfAssets, req.body.transporterCRN ).then (() => {
        console.log('New Shipment Created');
        const result = {
            status: 'success',
            message: 'New Shipment Created'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});


app.post('/retailDrug', (req, res) => {
    retailDrug.execute(req.body.drugName, req.body.serialNo, req.body.retailerCRN, req.body.customerAadhar).then (() => {
        console.log('Drug Retailed ');
        const result = {
            status: 'success',
            message: 'Drug Retailed'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});



app.post('/viewHistory', (req, res) => {
    viewHistory.execute(req.body.drugName, req.body.serialNo).then (() => {
        console.log('History Retrived ');
        const result = {
            status: 'success',
            message: 'History Retrived'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});


app.post('/viewDrugCurrentState', (req, res) => {
    viewDrugCurrentState.execute(req.body.drugName, req.body.serialNo).then (() => {
        console.log('Drug Current state retrived ');
        const result = {
            status: 'success',
            message: 'Drug Current state retrived'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});



app.listen(port, () => console.log(`Distributed Registrar App listening on port ${port}!`));
