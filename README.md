# Car Rental Management
Users can register and update their cars' information with image and search the available car in a specific date.

## Getting Started
This web-application is developed on Node.js. Also, I set up the Express.js as a web-framework. 
To deploy this program, I set web server with nginx on AWS EC2(amazon ami – free tier). 
If you want to check how this code is working on actual site. You can go to this link.
http://ec2-54-213-101-22.us-west-2.compute.amazonaws.com

### Prerequisites
-	Node.js
-	AWS account (user credential with the full permission to access AWS S3.)
-	MongoDB account (To manage data, I used MongoDB for a car information and used AWS S3 to upload and load the image file.)

Also, this web app uses a several npm packages.
-	aws-sdk
-	express
-	mongoose
-	multer: the middleware for handling file data for uploading image file.
-	Pug
-	dotenv
-	etc.

*you should do following command to install those packages.
```
npm install
```


### Front-end
This web-application is designed with pug to make easy to use jquery on list page.
Also, most components are based on Boostrap.

## Version
1.0.0

### Upcoming update
1.	user authentication system with Passport
2.	Set multiple company locations and give the nearest location to users with Google map api

## Authors
**MINHO CHOI** http://www.minhoproject.studio

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

