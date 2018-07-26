var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",


    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});



function promptManagerAction() {

    inquirer.prompt([
        {
            type: "list",
            name: "option",
            message: "Select an option:",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            filter: function (val) {
                if (val === "View Products for Sale") {
                    return "sale";
                } else if (val === "View Low Inventory") {
                    return "lowInventory";
                } else if (val === "Add to Inventory") {
                    return "addInventory";
                } else if (val === "Add New Product") {
                    return "newProduct";
                } else {

                    console.log("ERROR: Unsupported operation!");
                    exit(1);
                }
            }
        }
    ]).then(function (input) {

        if (input.option === "sale") {
            displayInventory();
        } else if (input.option === "lowInventory") {
            displayLowInventory();
        } else if (input.option === "addInventory") {
            addInventory();
        } else if (input.option === "newProduct") {
            createNewProduct();
        } else {

            console.log("ERROR: Unsupported operation!");
            exit(1);
        }
    })
}

function displayInventory() {

    queryStr = "SELECT * FROM products";

    connection.query(queryStr, function (err, data) {
        if (err) throw err;

        console.log("Existing Inventory: ");

        var strOut = "";
        for (var i = 0; i < data.length; i++) {
            strOut = "";
            strOut += "Item ID: " + data[i].item_id + "  //  ";
            strOut += "Product Name: " + data[i].product_name + "  //  ";
            strOut += "Department: " + data[i].department_name + "  //  ";
            strOut += "Price: $" + data[i].price + "  //  ";
            strOut += "Quantity: " + data[i].stock_quantity + "\n";

            console.log(strOut);
        }

        connection.end();
    })
}

function displayLowInventory() {

    queryStr = "SELECT * FROM products WHERE stock_quantity < 10";

    connection.query(queryStr, function (err, data) {
        if (err) throw err;

        console.log("Low Inventory Items (below 10): ");

        var strOut = "";
        for (var i = 0; i < data.length; i++) {
            strOut = "";
            strOut += "Item ID: " + data[i].item_id + "  //  ";
            strOut += "Product Name: " + data[i].product_name + "  //  ";
            strOut += "Department: " + data[i].department_name + "  //  ";
            strOut += "Price: $" + data[i].price + "  //  ";
            strOut += "Quantity: " + data[i].stock_quantity + "\n";

            console.log(strOut);
        }
        connection.end();
    })
}

function validateInteger(value) {
    var integer = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);

    if (integer && (sign === 1)) {
        return true;
    } else {
        return "Enter a whole non-zero number.";
    }
}

function validateNumeric(value) {

    var number = (typeof parseFloat(value)) === "number";
    var positive = parseFloat(value) > 0;

    if (number && positive) {
        return true;
    } else {
        return "Enter a positive number for the unit price."
    }
}

function addInventory() {

    inquirer.prompt([
        {
            type: "input",
            name: "item_id",
            message: "Please enter the Item ID for stock_count update.",
            validate: validateInteger,
            filter: Number
        },
        {
            type: "input",
            name: "quantity",
            message: "How many would you like to add?",
            validate: validateInteger,
            filter: Number
        }
    ]).then(function (input) {


        var item = input.item_id;
        var addQuantity = input.quantity;

        var queryStr = "SELECT * FROM products WHERE ?";

        connection.query(queryStr, { item_id: item }, function (err, data) {
            if (err) throw err;

            if (data.length === 0) {
                console.log("ERROR: Invalid Item ID.");
                addInventory();

            } else {
                var productData = data[0];

                console.log("Updating Inventory...");

                var updateQueryStr = "UPDATE products SET stock_quantity = " + (productData.stock_quantity + addQuantity) + " WHERE item_id = " + item;

                connection.query(updateQueryStr, function (err, data) {
                    if (err) throw err;

                    console.log("Stock count for Item ID " + item + " has been updated to " + (productData.stock_quantity + addQuantity) + ".");

                    connection.end();
                })
            }
        })
    })
}

function createNewProduct() {

    inquirer.prompt([
        {
            type: "input",
            name: "product_name",
            message: "Enter the new product name.",
        },
        {
            type: "input",
            name: "department_name",
            message: "What Department?",
        },
        {
            type: "input",
            name: "price",
            message: "Price per unit?",
            validate: validateNumeric
        },
        {
            type: "input",
            name: "stock_quantity",
            message: "How many items in stock?",
            validate: validateInteger
        }
    ]).then(function (input) {

        console.log("Adding New Item: \n    product_name = " + input.product_name + "\n" +
            "    department_name = " + input.department_name + "\n" +
            "    price = " + input.price + "\n" +
            "    stock_quantity = " + input.stock_quantity);

        var queryStr = "INSERT INTO products SET ?";


        connection.query(queryStr, input, function (error, results, fields) {
            if (error) throw error;

            console.log("New product added, nventory Item ID " + results.insertId + ".");



            connection.end();
        });
    })
}


function runbamazon() {

    promptManagerAction();
}

runbamazon();

