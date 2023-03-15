// require("dotenv").config();
// const aws = require("aws-sdk");
// const multer = require("multer");
// const multerS3 = require("multer-s3");

// const uuid = require("uuid").v4;
// const path = require("path");

// aws.config.update({
// 	accessKeyId: process.env.ACCESS_KEY,
// 	secretAccessKey: process.env.ACCESS_SECRET_KEY,
// 	region: process.env.REGION,
// });

// const s3 = new aws.S3({});
// const authenticateUser = async (request, response, next) => {
// 	try {
// 		const authHeader = request.headers.authorization;
// 		const [type, token] = authHeader.split(" ");
// 		const decodedToken = Buffer.from(token, "base64").toString("utf8");
// 		const [username, password] = decodedToken.split(":");
// 		//get the user details with the given username
// 		const result = await getUser(username);
// 		console.log(`logged in user details -- ${JSON.stringify(result)}`);

// 		//check for user authentication,
// 		if (!result.userExists) {
// 			//401
// 			setUnAuthorizedResponse(
// 				`No user account found with this username --- ${username}`,
// 				response
// 			);
// 			return response.end();
// 		}
// 		//is the password right?
// 		const passwordCheck = await comparePasswords(
// 			password,
// 			result.user.password
// 		);
// 		if (!passwordCheck) {
// 			//401
// 			setUnAuthorizedResponse("Username and password mismatch", response);
// 			return response.end();
// 		}

// 		const productId = request.params.productId;
// 		console.log(`productId ----- ${productId}`);
// 		console.log(`is a number ---- ${isNaN(productId)}`);
// 		//check for product existance,
// 		if (isNaN(productId)) {
// 			setBadRequestResponse("Bad request", response);
// 			return response.end();
// 		}

// 		const productDetails = await getProduct(productId);

// 		if (!productDetails.productExists) {
// 			//if no, no product found - 404
// 			setResourceNotFoundResponse(`Product Not Found`, response);
// 			return response.end();
// 		}

// 		//check for user authorization
// 		if (!(productDetails.product.owner_user_id === result.user.id)) {
// 			setUnAuthorizedResponse(
// 				`Sorry, you are not authorized to add images to this product`,
// 				response
// 			);
// 			return response.end();
// 		}
// 		next();
// 	} catch (error) {
// 		setBadRequestResponse(error, response);
// 		return response.end();
// 	}
// };

// const upload = multer({
// 	storage: multerS3({
// 		s3: s3,
// 		bucket: process.env.BUCKET_NAME,
// 		metadata: (req, file, cb) => {
// 			cb(null, { fieldName: file.fieldname });
// 		},
// 		key: (req, file, cb) => {
// 			const ext = path.extname(file.originalname);
// 			cb(null, `${uuid()}${ext}`);
// 		},
// 	}),
// });

// const imageRouter = express.Router();

// imageRouter
// 	.route("/:productId/image")
// 	.get(authenticateUser, get)
// 	.post(authenticateUser, upload.single("avatar"), post)
// 	.all(reject);

// imageRouter
// 	.route("/:productId/image/:imageId")
// 	.get(authenticateUser, getImage)
// 	.delete(authenticateUser, remove)
// 	.all(reject);

// module.exports = { imageRouter, s3, aws, authenticateUser };
