const fs = require("fs");
const path = require("path");

function deleteImageFile(imageUrl) {
  const normalizedUrl = imageUrl.startsWith("/")
    ? imageUrl.slice(1)
    : imageUrl;

  const filePath = path.join(__dirname, "../../", normalizedUrl);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

function deleteImageFiles(images) {
  for (const image of images) {
    deleteImageFile(image.url);
  }
}

module.exports = {
  deleteImageFile,
  deleteImageFiles,
};