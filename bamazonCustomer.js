var inquirer = require("inquirer");
var mysql = require("mysql");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",


    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

// connection.connect(function (err) {
//     if (err) throw err;
//     // run the start function after the connection is made to prompt the user
//     start();
// });


function promptCustomerAction() {
    // Prompt the user to select an item
    inquirer.prompt([
        {
            type: "list",
            name: "option",
            message: "Select an option:",
            choices: ["View Products for Sale", "Make a Purchase"],
            filter: function (val) {
                if (val === "View Products for Sale") {
                    return "sale";
                } else if (val === "Make a Purchase") {
                    return "purchase";
                } else {

                    console.log("ERROR: Unsupported operation!");
                    exit(1);
                }
            }
        }
    ]).then(function (input) {

        if (input.option === "sale") {
            displayInventory();
        } else if (input.option === "purchase") {
            promptUserPurchase();
        } else {

            console.log("ERROR: Unsupported operation!");
            exit(1);
        }
    })
}
function promptCustomerPurchase() {
    inquirer.prompt([
            {
            type: "input",
            name: "item_id",
            message: "Please enter the Item ID which you would like to purchase.",
            filter: Number
        },
        {
            type: "input",
            name: "quantity",
            message: "How many do you need?",
            filter: Number
        }
        
    ]).then(function (input) {


        var item = input.item_id;
        var quantity = input.quantity;

        var queryStr = "SELECT * FROM products WHERE ?";

        connection.query(queryStr, { item_id: item }, function (err, data) {
            if (err) throw err;

            if (data.length === 0) {
                console.log("ERROR: Invalid Item ID.");
                displayInventory();

            } else {
                var productData = data[0];

                if (quantity <= productData.stock_quantity) {
                    console.log("The product you requested is in stock! Placing your order....");

                    // Construct the updating query string
                    var updateQueryStr = "UPDATE products SET stock_quantity = " + (productData.stock_quantity - quantity) + " WHERE item_id = " + item;

                    // Update the inventory
                    connection.query(updateQueryStr, function (err, data) {
                        if (err) throw err;
                        // console log total price
                        console.log("Your oder has been placed! Your total is $" + productData.price * quantity);

                        connection.end();
                    })
                } else {
                    console.log("Product amount not in stock, order not placed!");
                    console.log("You need to modify your order.");


                    displayInventory();
                }
            }
        })
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
            strOut += "Price: $" + data[i].price + "\n";

            console.log(strOut);
        }



        //Prompt to purchase
        promptUserPurchase();
    })
}

function runbamazon() {

    promptCustomerAction();
}
// promptCustomerPurchase();

runbamazon();

