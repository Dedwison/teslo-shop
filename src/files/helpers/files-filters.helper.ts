export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  //   console.log(file);
  if (!file) return callback(new Error('File is empty'), false);
  const fileExtension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  // const validCompressedExtensions = ['vnd.rar', 'x-7z-compressed', 'zip'];

  if (validExtensions.includes(fileExtension)) {
    return callback(null, true);
  }

  callback(null, false);
};
