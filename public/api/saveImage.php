<?php
// saveImage.php

// Allow CORS for local development
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['image']) && isset($data['filename'])) {
        $imageData = $data['image'];
        $filename = basename($data['filename']);

        // Decode the base64 image
        $decodedImage = base64_decode($imageData);

        if ($decodedImage !== false) {
            $filePath = '../data/img/' . $filename;

            // Ensure the uploads directory exists
            if (!is_dir('../data/img/')) {
                mkdir('../data/img/', 0777, true);
            }

            // Save the image to the file
            if (file_put_contents($filePath, $decodedImage)) {
                echo json_encode(['success' => true, 'message' => 'Image saved successfully.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to save the image.']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid image data.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid input.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}