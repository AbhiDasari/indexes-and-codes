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

async function main(companyCRN, companyName, Location, organisationRole) {

	try {
		const pharmaContract = await helper.getContractInstance();

		
		console.log('.....Requesting to create a Company on the Network');
		const newCompanyBuffer = await pharmaContract.submitTransaction('requestNewUser', companyCRN, companyName, Location, organisationRole);

		// process response
		console.log('.....Processing Request New User Transaction Response \n\n');
		let newCompany = JSON.parse(newCompanyBuffer.toString());
		console.log(newCompany);
		console.log('\n\n.....Request New User Transaction Complete!');
		return newCompany;

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
