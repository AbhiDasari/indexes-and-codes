'use strict';

/**
 * This is a Node.JS application to request to create a New User on the Network
 */

const helper = require('./contractHelper');

/*var args = process.argv.slice(2);
let name = args[0].toString();
let email = args[1].toString();
let phone = args[2].toString();
let aadharNo = args[3].toString();*/

async function main(buyerCRN, drugName, listOfAssets, transporterCRN) {

	try {
		const pharmaContract = await helper.getContractInstance();

		
		console.log('.....Requesting to create a Shipment on the Network');
		const newShipmentBuffer = await pharmaContract.submitTransaction('createShipment', buyerCRN, drugName, listOfAssets, transporterCRN);

		// process response
		console.log('.....Processing Request New Shipment Transaction Response \n\n');
		let newShipment = JSON.parse(newShipmentBuffer.toString());
		console.log(newShipment);
		console.log('\n\n.....Request New Shipment Transaction Complete!');
		return newShipment;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}

/*main(name, email, phone, aadharNo).then(() => {
	console.log('New User Request Submitted on the Network');
});*/

module.exports.execute = main;
