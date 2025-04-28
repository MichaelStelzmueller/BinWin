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
    // $data = [
    //     "url" => "data/img/3bhitm_image_0.png"
    // ];
    

    if (isset($data['imageData']) && isset($data['url'])) {
        $imageData = $data['imageData'];
        $filename = basename($data['url']);

        // Decode the base64 image
        $decodedImage = base64_decode($imageData);

        if ($decodedImage !== false) {
            $filePath = '../' . $filename;

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