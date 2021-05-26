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
        if (cidr[index] <= cidr[index-1]) {
            cidr.splice(index-1, 1);
        }
    }

    const output = [];

    let current = "", count = 0;
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