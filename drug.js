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

async function main(drugName, serialNo, mfgDate, expDate, companyCRN) {

	try {
		const pharmaContract = await helper.getContractInstance();

		
		console.log('.....Requesting to create a Drug on the Network');
		const newDrugBuffer = await pharmaContract.submitTransaction('addDrug',drugName, serialNo, mfgDate, expDate, companyCRN);

		// process response
		console.log('.....Processing Request New Drug Transaction Response \n\n');
		let newDrug = JSON.parse(newDrugBuffer.toString());
		console.log(newDrug);
		console.log('\n\n.....Request New Drug Transaction Complete!');
		return newDrug;

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
