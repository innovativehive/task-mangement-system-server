# Task Image Upload API Setup Guide

## Overview
The task image upload API allows you to upload reference images for tasks and store them on Cloudinary.

## Installation

### Step 1: Install Multer
Multer is required for handling file uploads via multipart/form-data. Run the following command:

```bash
npm install multer
```

## API Endpoint

### Upload Task Image
**POST** `/api/task/upload-image/:id`

#### Parameters
- `id` (path parameter): The task ID

#### Request
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Field Name**: `image` (the file field)
- **Accepted File Types**: Image files (jpg, png, gif, webp, etc.)
- **Max File Size**: 10MB

#### Example Request (cURL)
```bash
curl -X POST http://localhost:PORT/api/task/upload-image/TASK_ID \
  -F "image=@/path/to/image.jpg"
```

#### Example Request (JavaScript/Fetch)
```javascript
const formData = new FormData();
const fileInput = document.querySelector('input[type="file"]');
formData.append('image', fileInput.files[0]);

const response = await fetch(`http://localhost:PORT/api/task/upload-image/TASK_ID`, {
    method: 'POST',
    body: formData
});

const data = await response.json();
console.log(data);
```

#### Example Request (Axios)
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const response = await axios.post(`http://localhost:PORT/api/task/upload-image/TASK_ID`, formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

console.log(response.data);
```

## Response

### Success Response (200)
```json
{
    "success": true,
    "message": "Image uploaded successfully",
    "imageUrl": "https://res.cloudinary.com/...",
    "task": {
        "_id": "task-id",
        "title": "Task Title",
        "referenceImage": "https://res.cloudinary.com/...",
        ...
    }
}
```

### Error Responses

#### Task Not Found (404)
```json
{
    "success": false,
    "message": "Task not found"
}
```

#### No File Uploaded (400)
```json
{
    "success": false,
    "message": "No file uploaded"
}
```

#### Invalid File Type (400)
```json
{
    "success": false,
    "message": "Only image files are allowed"
}
```

#### File Too Large (413)
```json
{
    "success": false,
    "message": "File size exceeds limit"
}
```

#### Cloudinary Upload Error (500)
```json
{
    "success": false,
    "message": "Failed to upload image",
    "error": "Error message from Cloudinary"
}
```

## Database Update

The Task model has been updated with a new field:
- **referenceImage** (String): URL of the uploaded image from Cloudinary

## Files Modified/Created

1. **models/Task.js** - Added `referenceImage` field
2. **services/task/index.js** - Added `uploadTaskImage` service function
3. **controllers/task/index.js** - Added `uploadImage` controller function
4. **Routes/task.js** - Added upload image route with multer middleware
5. **middleware/fileUpload.js** - Created multer configuration

## Environment Variables

Ensure these Cloudinary environment variables are set in your `.env` file:
```
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
```

## Features

- ✅ File size validation (max 10MB)
- ✅ Image type validation (only image files allowed)
- ✅ Automatic organization in Cloudinary (folder: `task-management/task-images`)
- ✅ Secure URL returned for uploaded images
- ✅ Automatic task database update with image URL
- ✅ Error handling and validation
- ✅ Memory storage for efficient processing
