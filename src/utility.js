const ipaddr = require('ipaddr.js');

export function withLeadingZeros(string, desiredDigits) {
	while (string.length < desiredDigits) string = "0" + string;
	return string;
}

export function getNumberOfSubnets(startBit, endBit) {
	const totalBits = endBit - startBit;
	return Math.pow(2, totalBits);
}

export function getExpandedAddress(address) {
	let output = "";
	for (let index = 0; index < address.parts.length; index++) {
		if (index !== 0) {
			output += ":";
		}
		let element = Number(address.parts[index]).toString(16);
		while (element.length < 4) element = "0" + element;
		output += element;
	}
	return output;
}

export function splitAtBit(address, cidr = [128]) {
	if (typeof cidr !== "object") {
		cidr = [cidr];
	}

	for (let index = 1; index < cidr.length; index++) {
		if (cidr[index] <= cidr[index - 1]) {
			cidr.splice(index - 1, 1);
		}
	}

	const output = [];

	let current = "", count = 0;
	if (cidr[0] === 0) {
		output.push("");
		cidr.splice(0, 1);
	}
	for (let index = 0; index < address.length; index++) {
		const element = address[index];
		if (element !== ":") {
			count += 4; // 4 bits to each hex character
		}
		current += element;
		if (count >= cidr[0]) {
			output.push(`${current}`);
			current = "";
			cidr.splice(0, 1);
		}
	}
	if (current.length > 0) {
		output.push(current);
	}
	return output;//[first, address.substr(first.length)];
}

export function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// converts IPv6 address to a binary string
export function getBinaryString(address) {
	// working with a string because JavaScript's Number.MAX_SAFE_INTEGER is too small
	// decompressing the IPv6 address into a binary string
	let binaryString = "";
	for (let index = 0; index < address.length; index++) {
		const char = address[index];
		if (char !== ":") {
			binaryString += withLeadingZeros(parseInt(char, 16).toString(2), 4);
		}
	}
	return binaryString;
}

//converts a 128 bit binary string to an IPv6 address
export function getIPv6AddressFromBinary(binaryString) {
	let address = "";
	for (let index = 0; index < binaryString.length; index += 16) {
		const chunk = binaryString.substr(index, 16);
		address += parseInt(chunk, 2).toString(16) + ":";
	}
	return address;
}

// takes in an IPv6 address and a CIDR, converts the IPv6 address to a binary string
// sets all digits of the binary string after the CIDR to 0, converts the binary string back to an IPv6 address
export function zeroAfterBit(address, cidr) {
	const binaryString = getBinaryString(address);
	let binaryStringZeroed = binaryString.substr(0, cidr);
	while (binaryStringZeroed.length < 128) {
		binaryStringZeroed += "0";
	}
	return getIPv6AddressFromBinary(binaryStringZeroed);
}

export function allPossibleAddresses(address, parent_cidr, child_cidr) {
	if (parent_cidr > child_cidr) {
		throw (new Error(`Parent CIDR (${parent_cidr}) cannot be greater than the child CIDR (${child_cidr})`));
	}

	address = getExpandedAddress(address);
	// how many bits we'll be working with
	const bits = child_cidr - parent_cidr;
	const total_number = Math.pow(2, child_cidr - parent_cidr);

	// working with a string because JavaScript's Number.MAX_SAFE_INTEGER is too small
	// decompressing the IPv6 address into a binary string
	let binaryString = getBinaryString(address);

	const output = new Array(total_number);
	for (let index = 0; index < total_number; index++) {

		// get the binary version of our address to output
		let binaryOutput = binaryString.substr(0, parent_cidr) + withLeadingZeros(index.toString(2), bits) + binaryString.substr(child_cidr);

		//convert the binary string address into an IPv6 address
		let expandedOutput = "";
		for (let o = 0; o < binaryOutput.length / 4; o++) {
			if (o % 4 === 0 && o !== 0) expandedOutput += ":";
			expandedOutput += parseInt(binaryOutput.substr(o * 4, 4), 2).toString(16);
		}

		output[index] = expandedOutput;
	}

	return output;
}

export function download(text, filename) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

export function exportAndDownload() {
	let address = this.address;
	let start = this.start;
	let end = this.end;

	const fileName = `${ipaddr.parse(address).toString().replace(/:/g, '-')}_${start}-${end}.csv`;
	let array = [address];
	if (start !== end) {
		array = allPossibleAddresses(ipaddr.parse(address), start, end);
	}
	let outputString = "";
	for (let index = 0; index < array.length; index++) {
		let outputAddress = ipaddr.parse(array[index]).toString();
		outputString += outputAddress + ("/" + this.end) + (index < array.length - 1 ? ",\n" : "");
	}
	download(outputString, fileName);
}