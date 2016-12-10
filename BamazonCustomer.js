var mysql = require("mysql");
var inquirer = require("inquirer");

// Mysql connection
//===========================================================================
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
})

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});
//===========================================================================

// Bamazon Object
//===========================================================================
var bamazon = {
	questions: [
		{	
		  	type: 'input',
    		name: 'id',
    		message: "Type the ID of the product you would like to buy:",
	
      	},

      	{	
		  	type: 'input',
    		name: 'quantity',
    		message: "Type the amount you would like to purchase:",
	
      	}

	],
	
	getInventory: function(){
		connection.query("SELECT * FROM products", function(error, results){
			
			if (error) throw err;
			
			for (var i = 0; i < results.length; i++) {
				console.log("===========================")
				console.log("ID: " + results[i].ItemID); 
				console.log("Name: " + results[i].ProductName);
				console.log("Department: " + results[i].DepartmentName);
				console.log("Price: " + results[i].Price);
				console.log("Items left: " + results[i].StockQuantity);
				console.log("===========================");
			};


			bamazon.sellProducts();
		});

	},

	sellProducts: function(){
		inquirer.prompt(bamazon.questions).then(function (answers) {
  			var id = answers.id;
  			var quantity = answers.quantity;
  			bamazon.buyProduct(id, quantity);
  			
		});
	},

	buyProduct: function(id, quantity){
		var stock;
		var totalPrice;

		connection.query("SELECT * FROM products WHERE ItemID = ?",[id], function(err, results){
			if(err) throw err; 
			stock = results[0].StockQuantity;
			item = results[0].ProductName;
			price = results[0].Price;
			
			if (quantity <= stock){
				stock -= quantity;
				price *= quantity;


				connection.query("UPDATE products SET ? WHERE ?", [
				{StockQuantity: stock}, 
				{ItemID: id}], 
				function(err, results){
					console.log(" ");
					console.log("Order was placed successfully!");
					console.log("=====Receipt=====")
					console.log("Product: " + item)
					console.log("Amount purchased: " + quantity)
					console.log("Total Price: " + "$" + price)
					console.log(" ");
					connection.end();
				});
			}

			else{
				console.log("Sorry, we do not have that amount in stock.")
				connection.end();
		}
		});

	},

	// verifyStock: function(quantity, stock){


	// }	
		// if (quanity > stock){
		// 	stock -= quantity;

		//}
			//Subtract quantity from StockQuantity
			//Multiply price and quantity

};
//===========================================================================

//Function calls
//===========================================================================

bamazon.getInventory();


//===========================================================================








// Mysql connection end
//===========================================================================
//connection.end();
//===========================================================================