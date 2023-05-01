# Product Lookup

This is a JavaScript program that looks up products in a master list based on their manufacturer and composition, and generates a new Excel file with the product IDs.

## Installation

To use this program, you will need to install the `xlsx` library by running `npm install xlsx` in your project directory.

## Usage

1. Prepare your data in an Excel file with two sheets: "Master" and "Test". 
   * The "Master" sheet should contain a list of products with details such as name, manufacturer, composition, and product ID.
   * The "Test" sheet should contain a list of products to search, with details such as manufacturer and composition.

2. Save the Excel file and note its file path.

3. Download the `index.js` file and include it in your project.

4. In your terminal, navigate to the directory containing the `index.js` file.

5. Run the following command, replacing `[file path]` with the file path of your Excel file:

```
node index.js [file path]
```

6. The program will generate a new Excel file called `results.xlsx` in the same directory, containing the original test data and an additional column for the product ID from the master list, if found.

## Functionality

This program uses a composite hash function to generate a unique identifier for each product based on its manufacturer and composition. It then creates a hash table of the master list products using their hash values as keys, and searches the hash table for each test product. If a match is found, the program adds the corresponding product ID to the results sheet. 

Note that the hash function used here is simple and may not be suitable for all use cases. You may want to modify the `compositeHash()` function to use a different hashing algorithm depending on your needs.