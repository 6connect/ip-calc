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

export function splitAtBit(address, cidr = 128) {
    let first = "", count = 0;
    for (let index = 0; index < address.length; index++) {
        const element = address[index];
        if (element !== ":") {
            count += 4; // 4 bits to each hex character
        }
        first += element;
        if (count >= cidr) {
            break;
        }
    }
    return [first, address.substr(first.length)];
}

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}