// Error classes for the extension
export class UnsupportedFileTypeError extends Error {
  constructor(message = 'Unsupported file type. Please use PNG, JPEG, WebP, or GIF.') {
    super(message);
    this.name = 'UnsupportedFileTypeError';
  }
}

export class ImageTooLargeError extends Error {
  constructor(message = 'Image is too large. Maximum size is 20 MB.') {
    super(message);
    this.name = 'ImageTooLargeError';
  }
}

export class ImageFetchFailedError extends Error {
  constructor(message = 'Could not fetch the image. The URL may be blocked or the image no longer exists.') {
    super(message);
    this.name = 'ImageFetchFailedError';
  }
}

export class ThumbnailGenerationError extends Error {
  constructor(message = 'Failed to generate thumbnail for this image.') {
    super(message);
    this.name = 'ThumbnailGenerationError';
  }
}

export class ClipboardWriteFailedError extends Error {
  constructor(message = 'Failed to copy image to clipboard.') {
    super(message);
    this.name = 'ClipboardWriteFailedError';
  }
}

export class DatabaseWriteFailedError extends Error {
  constructor(message = 'Failed to save the meme to the database.') {
    super(message);
    this.name = 'DatabaseWriteFailedError';
  }
}