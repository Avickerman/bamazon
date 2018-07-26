DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
	item_id INTEGER(20) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30) NOT NULL,
	department_name VARCHAR(20) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stock_quantity INTEGER(11) NOT NULL,
	PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Minnesota Wild Jersey", "Jersey", 170, 600),
		("Washington Capitals Jersey", "Jersey", 180, 1000),
        ("Vegas Knights Jersey", "Jersey", 170, 700),
        ("New York Rangers Jersey", "Jersey", 170, 500),
        ("Minnesota North Stars Jersey", "Jersey", 200, 300),
        ("Minnesota NS Hat", "Hats", 50, 45),
        ("Bauer Hat", "Hat", 25, 100),
        ("CCM Hat", "Hat", 25, 100),
        ("Maple Leafs Hat", "Hat", 30, 60),
        ("Toronto Maple Leafs Jersey", "Jersey", 170, 700);






