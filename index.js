const XLSX = require("xlsx");

function cleanString(str) {
    // Convert the string to lowercase
    str = str.toLowerCase();

    // Remove all whitespace and special characters using a regular expression
    str = str.replace(/\s+/g, '');
    str = str.replace(/[^a-z0-9]/g, '');
    str = str.replace(/\band\b/g, '+');

    return str;
}

function compositeHash(manufacturer, composition) {
    // Convert the manufacturer and composition strings to numerical values using a simple hash function
    if (!manufacturer || !composition) {
        return 0;
    }

    manufacturer = cleanString(manufacturer);
    composition = cleanString(composition);

    let manufacturerHash = 0;
    let compositionHash = 0;

    for (let i = 0; i < manufacturer.length; i++) {
        manufacturerHash = (manufacturerHash << 5) - manufacturerHash + manufacturer.charCodeAt(i);
        manufacturerHash |= 0; // Convert to 32-bit integer
    }

    for (let i = 0; i < composition.length; i++) {
        compositionHash = (compositionHash << 5) - compositionHash + composition.charCodeAt(i);
        compositionHash |= 0; // Convert to 32-bit integer
    }

    // Combine the two hash values using a bitwise XOR operator
    const combinedHash = manufacturerHash ^ compositionHash;

    return combinedHash;
}

function generateHashTable(products) {
    const hashTable = new Map();

    products.forEach((product) => {
        const { Manufacturer, Composition } = product;
        const hash = compositeHash(Manufacturer, Composition);

        hashTable.set(hash, product);
    });

    return hashTable;
}

(async () => {
    /* fetch JSON data and parse */
    const filePath = process.argv[2];

    if (!filePath) {
        return console.log("Please provide a file path");
    }

    var workbook = XLSX.readFile(filePath);

    const masterSheet = XLSX.utils.sheet_to_json(workbook.Sheets['Master']);
    const productsToSearch = XLSX.utils.sheet_to_json(workbook.Sheets['Test']);

    const hashTable = generateHashTable(masterSheet);
    const results = productsToSearch.map(product => {
        const { Manufacturer, Composition } = product;
        const hash = compositeHash(Manufacturer, Composition);

        const foundProduct = hashTable.get(hash);
        if (foundProduct) {
            return {
                ...product,
                "Product ID_Master": foundProduct["Product ID"],
            }
        }

        return product;
    });

    const resultSheet = XLSX.utils.json_to_sheet(results);

    XLSX.utils.book_append_sheet(workbook, resultSheet, "Results");

    XLSX.writeFile(workbook, "results.xlsx");
})();