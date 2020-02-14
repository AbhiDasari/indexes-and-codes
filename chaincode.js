'use strict';

const{Contract}=require('fabric-contract-api');

class pharmanet extends contract{
constructor(){

super('org.pharma-network.pharmanet');
  global.utils = new utilsclass();
  //These Global variables are used to store the organisation names of the organisations participating in the network.
	global.manufacturerOrg = 'manufacturer.pharma-network.com';
	global.retailerOrg = 'retailer.pharma-network.com';
	global.distributorOrg='distributor.pharma-network.com';
	global.consumerOrg='consumer.pharma-network.com';
	global.transporterOrg='transporter.pharma-network.com';

}

async instantiate(ctx){
	console.log('Phramanet Contract has been instantiated');
	}
	
//Entity Registration
async registerCompany (ctx,companyCRN, companyName, Location, organisationRole){
	const companyKey=ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company',[companyCRN]);
	const companyId=ctx.stub.createCompositeKey('org.pharma-network.pharmanet.id',[companyCRN,companyName]);
	let hierarchyKeyAssign;
	if(organisationRole=='Manufacturer')
	{
		hierarchyKeyAssign=1;
	}
	else if(organisationRole=='Distributor')
	{
		hierarchyKeyAssign=2;
	}
	else if( organisationRole=='Retailer')
	{
		hierarchyKeyAssign=3;
	}
	
	let newCompanyObject={
		companyId: companyId,
		companyName: companyName,
		companyLocation: Location,
		organisationRole: organisationRole,
		hierarchyKey=hierarchyKeyAssign,
	
	};
	// writing the new objects to the ledger
	let companyBuffer =Buffer.from(JSON.stringify(newCompanyObject));
	await ctx.stub.putState(companyKey,companyBuffer);
	return newCompanyObject;
}

//Drug Registration
async addDrug (ctx,drugName, serialNo, mfgDate, expDate, companyCRN){
	const drugKey=ctx.stub.createCompositeKey('org.pharma-network.pharmanet.drug',[drugName,serialNo]);
	//add DrugManufacturer,DrugOwner, Drugshipment
	const companyKey=ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company',[companyCRN]);
	
	utils.validateInitiator(ctx,manufacturerOrg);
	
	let newDrugObject={
		productID: DrugKey,
		drugName: drugName,
		drugManufacturer: companyKey,// key of the manufacturer
		drugManufacturingDate: mfgDate,
		drugExpiryDate: expDate,
		drugOwner:companyKey,//key of the owner
		drugShipment:,
		
	
	};
	// writing the new objects to the ledger
	let drugBuffer =Buffer.from(JSON.stringify(newDrugObject));
	await ctx.stub.putState(drugKey,drugBuffer);
	return newCompanyObject;
	
}

//Transfer Drug
async createPO (ctx,buyerCRN, sellerCRN, drugName, quantity){
	
	const poKey=ctx.stub.createCompositeKey('org.pharma-network.pharmanet.po',[buyerCRN,drugName]);
	const buyerKey=ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company',[buyerCRN]);
	const sellerKey=ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company',[sellerCRN]);
	//getting buyer details
	let buyerBuffer= await ctx.stub.getState(buyerKey).catch(err => console.log(err));
	//getting seller details
	let sellerBuffer= await ctx.stub.getState(sellerKey).catch(err => console.log(err));
	
	const buyer= JSON.parse(buyerBuffer.toString());
	const seller= JSON.parse(sellerBuffer.toString());
	//making sure that retailers buy only from distributor and distributors buy only from manufacturer
	if(buyer.hierarchyKey+1==seller.hierarchyKey){
	let newPoObject={
		drugName: drugName,
		quantity: quantity,
		buyer: buyerKey,
		seller=: sellerKey,
  }
	let poBuffer =Buffer.from(JSON.stringify(newPoObject));
	await ctx.stub.putState(poKey,poBuffer);
	return newPoObject;
	}
}

async createShipment (ctx,buyerCRN, drugName, listOfAssets, transporterCRN ){
	
	
	
	const poKey=ctx.stub.createCompositeKey('org.pharma-network.pharmanet.po',[buyerCRN,drugName]);
	let poBuffer= await ctx.stub.getState(poKey).catch(err => console.log(err));
	const po= JSON.parse(poBuffer.toString());
	
	let AssetArr= listOfAssets.split(',');
	
	
	
	if(AssetArr.length==po.quantity){
		
	//validate the ids  
	  let flag=0
	  for(i=0;i<AssetArr.length;i++){
		let name=AssetArr[i].split(':')[0]; // taking the name of the drug
		let version=AssetArr[i].split(':')[1]; // taking the serial number
		
		
		const drugKey=ctx.stub.createCompositeKey('org.pharma-network.pharmanet.drug',[name,version]);// generating the composite key 
		let drugBuffer= await ctx.stub.getState(drugKey).catch(err=>console.log(err));
		const drug= JSON.parse(drugBuffer.toString());
		
		
		let creatorKey= drug.drugOwner;
	
		const drug= JSON.parse(drugBuffer.toString());
		//checking whether all the drugs are registered
		if(drug== undefined){
			console.log("The Drug Asset is not registered");
			throw new Error('Invalid Asset, The Drug Asset is not registered');
		}
		else{
			flag=flag+1;
		}
	      }
		  
		
	  if(flag==AssetArr.length){
	
	     const shipmentKey=ctx.stub.createCompositeKey('org.pharma-network.pharmanet.shipment',[buyerCRN,drugName]);
		 
		 const transporterKey=ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company',[transporterCRN]);
		 let transporterBuffer= await ctx.stub.getState(transporterKey).catch(err => console.log(err));
	     const transporter= JSON.parse(drugBuffer.toString());
		 
	     let statusAssign='in-transit';
	     let newShipmentObject={
		  creator: creatorKey ,
		  assets: listOfAssets,
		  transporter: transporter.companyId,
		  shipmentStatus: statusAssign,
	     }
	     }
	 else{
	 	console.log("Found  Drug Asset which is not registered");
         }
	}
}

async updateShipment(ctx,buyerCRN, drugName, transporterCRN){
}

async retailDrug (ctx,drugName, serialNo, retailerCRN, customerAadhar){
	const drugKey=ctx.stub.createCompositeKey('org.pharma-network.pharmanet.drug',[drugName,serialNo]);
	
	//change the ownership to aadhar of the buyer
	utils.validateInitiator(ctx,retailerOrg);
	let drugBuffer= await ctx.stub.getState(drugKey).catch(err => console.log(err));
	const drug= JSON.parse(drugBuffer.toString());
	let newDrugObject={
		productID: drug.DrugKey,
		drugName: drug.drugName,
		drugManufacturer: drug.companyKey,// key of the manufacturer
		drugManufacturingDate: drug.mfgDate,
		drugExpiryDate: drug.expDate,
		drugOwner:customerAadhar,//key of the owner
		drugShipment:drug.drugShipment,
		
	
	};
	let drugBuffer =Buffer.from(JSON.stringify(newDrugObject));
	await ctx.stub.putState(drugKey,drugBuffer);
	return newCompanyObject;
}

//View Lifecycle
async viewHistory (ctx,drugName, serialNo){
}

async viewDrugCurrentState (ctx,drugName, serialNo){
	const drugKey=ctx.stub.createCompositeKey('org.pharma-network.pharmanet.drug',[drugName,serialNo]);
	let drugBuffer = await ctx.stub.getState(drugKey).catch(err=>console.log(err));
	return JSON.parse(drugBuffer.toString());
}

}
