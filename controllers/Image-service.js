
// const getProductImages = async (productId) => {
// 	try {
// 		console.log(`inside getProductImages service method -- ${productId}`);
// 		const images = await Image.findAll({ where: { ProductId: productId } });
// 		console.log(`after querying the Images -- ${JSON.stringify(images)}`);
// 		if (images === null) {
// 			return {
// 				imagesExists: false,
// 				message: "Couldn't find any images for the given product id",
// 				images: {},
// 			};
// 		} else {
// 			return {
// 				imagesExists: true,
// 				message: "Product found",
// 				images: images,
// 			};
// 		}
// 	} catch (e) {
// 		console.log(`exception while finding images---${e}`);
// 	}
// };

// const getProductImageById = async (productId, imageId) => {
// 	try {
// 		console.log(`inside getProductImage service method -- ${productId}, ${imageId}`);
// 		const image = await Image.findOne({ where: { image_id: imageId, product_id: productId } });
// 		console.log(`after querying the Images -- ${JSON.stringify(image)}`);
// 		if (image === null) {
// 			return {
// 				imageExists: false,
// 				message: "Couldn't find any image for the given product id",
// 				image: {},
// 			};
// 		} else {
// 			return {
// 				imageExists: true,
// 				message: "Image found",
// 				image: image.toJSON()
// 			};
// 		}
// 	} catch (e) {
// 		console.log(`exception while finding images---${e}`);
// 	}
// };

// const uploadImage = async (newImage) => {
// 	try {
// 		console.log(
// 			`inside uploadImage service method -- ${JSON.stringify(newImage)}`
// 		);
// 		const image = await Image.create(newImage);
// 		console.log(`image details saved -- ${image.toJSON()}`);
// 		return image.toJSON();
// 	} catch (e) {
// 		console.log(`error while saving image -- ${e}`);
// 		return false;
// 	}
// };


// const deleteImage = async (imageId) => {
// 	try {
// 		console.log(`inside deleteImage service method -- ${imageId}`);
// 		const deletedImage = await Image.destroy({
// 			returning: true,
// 			where: { image_id: imageId },
// 		});
// 		console.log(`Images deleted -- ${deletedImage}`);
// 		return deletedImage;
// 	} catch (e) {
// 		console.log(`error while trying to delete image -- ${e}`);
// 		return false;
// 	}
// };


// module.exports = {
// 	getProductImages,
// 	uploadImage,
// 	getProductImageById,
// 	deleteImage
// };
