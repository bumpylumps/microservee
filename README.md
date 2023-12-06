![Microservee screenshot](<Pasted image 20231206123559.png>)
## Installing and running:
### Requirements:
- Access to a  **MongoDB** database
- **Local installs of:**

		- RabbitMQ 
		- Docker
		- Node
		- Postman

### Steps to install:
	1) pull repo from github @ https://github.com/bumpylumps/microservee
	2) install dependencies:
		- navigate to the root directory of products services in the terminal and run "npm install"
		- navigate to the root directory of order services in the terminal and run "npm install"
	3) create .env file in the root directory of order service:
		- provide MongoDB url string as "DB_URL = {Mongo DB string}"
		- repeat for the product service
	4) create RabbitMQ instance:
		- Go to the project terminal and run "docker run -p 5672:5672 rabbitmq"
	5) open Postman


## Steps to run + Features:
	1) Open a terminal in your IDE and navigate to the product services root directory
	2) Run "node index.js" to spin up the product services server 
	3) Open a seperate terminal and navigate to the order services root directory
	4) Run "node index.js" in that seperate terminal
	5) Make sure your RabbitMQ instance is running in Docker
### Adding a product to store inventory:
	1) in Postman, create a POST request to: http://localhost:3001/products
	2) set request body to raw JSON text, add fields for name, price, description
	3) Make request
	4) Check server response

### Ordering a product from inventory:
	1) Copy ID from added product (located in the server response window in Postman from adding a product, or
	 	alternatively in your MongoDB collection)
	2) Create a POST request to: http://localhost:3001/products/buy
	3) Set request body to raw JSON text, add field to body: 
		- "productIds" :  "{paste product ID from step 1}"
	4) Make request
	5) Check server response 



## How It's Made: 
### Tech Used: 
	Runtime: 
		- NodeJs
	
	Servers:
		- ExpressJS
	
	Message Broker: 
		- RabbitMQ
	
	Testing: 
		- Postman
	
	DB:
		- MongoDB
		- Mongoose (schema)

Using microservices for event driven architecture, this application is built with services in NodeJS and Express, and utilize RabbitMQ as a message broker to handle communication between them. 

The product service manages inventory by adding items to the store's DB, and handles orders by sending a message to the app's RabbitMQ instance which updates a message queue for service communication. 

Once the RabbitMQ instance has updated the app's message queue with a new order, the order service consumes product data passed from the message queue and uses that data to create a new order. After the order data is consumed and evaluated, the order service updates the message queue with it. The message queue is then validated by RabbitMQ and passed back to the product service. The product service then notifies the user via JSON that the order has been successfully placed, and provides a price for the order. 

The RabbitMQ instance is being run by Docker and handles message brokering on the app's message queue with minimal interference. Data for products and orders is serialized as a JSON object for lightweight communication between services. Product and order data structures are reinforced by Mongoose.

Since the order service contains one route, that route is not delegated to a separate directory from it's server (as opposed to the Routes directory in the product service). 

The application features (adding a product, ordering a product) are currently activated by calls in Postman with URL's where data is then returned and tested by the user. 



## Optimizations: 

- gRPC instead of RabbitMQ
	- messaging between services could be customized and optimized with gRPC

- inventory management
	- If a product is sold out, an order should not be made - could be added easily with time

- feature for returns
	- the order service could be updated to handle returns - finding a relevant order, refunding the money and updating inventory

- tax calculator on order for final prices
	- currently totals are passed as ints. Floats make more sense for prices, and tax could be added to order totals

- Front end for user interaction
	- having a client to manage server requests would be more user friendly
	- would also eliminate the need to copy and past product ID's, a potentially painful step

- MVC architecture for services / have order directories match products better
	- in order to scale up for production, service architecture could be seperated into Route and Controller directories

- Delivery management
	- an additional service for deliveries could be added to the application 



## Project Takeaways

This demo was built to demonstrate my ability to build microservices with NodeJS and get a conversation started for interviews. It was nice taking a little time to build these services and work with RabbitMQ, and reminded me how simple it can be to develop services without affecting an entire codebase. Running instances with Docker is always a plus, and it was nice exploring the docs for RabbitMQ and gRPC for possible optimizations. Going forward, it would be nice to build a client to make the application more user friendly. 

I was reminded how flexible express servers are and how comfortable with NodeJS I am, while also admiring the depth of its simplicity. Running multiple servers at once is always fun too.


