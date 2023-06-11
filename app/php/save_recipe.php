<?php

session_start();
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
require_once("db_connect.php");

try {
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $userId = $_SESSION["user_id"];
        $recipeId = $_POST["recipe_id"];
        $title = $_POST["title"];
        $image = $_POST["image"];
        $category = $_POST["category"];
        $cuisine = $_POST["cuisine"];
        $source = $_POST["source"];
        // file_put_contents('debug.log', "POST Data: " . print_r($_POST, true) . PHP_EOL, FILE_APPEND);
        // file_put_contents('debug.log', "Files Data: " . print_r($_FILES, true) . PHP_EOL, FILE_APPEND);

        // Check if the recipe already exists for the user
        $sql = "SELECT id FROM saved_recipes WHERE user_id = ? AND recipe_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $userId, $recipeId);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows == 0) {
            // Insert the recipe into the database
            $sql = "INSERT INTO saved_recipes (user_id, recipe_id, title, image, category, cuisine, source) VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("iisssss", $userId, $recipeId, $title, $image, $category, $cuisine, $source);

            if ($stmt->execute()) {
                $response = array(
                    "success" => true,
                    "message" => "Recipe saved successfully."
                );
                echo json_encode($response);
            } else {
                $response = array(
                    "success" => false,
                    "message" => "Error: " . $stmt->error
                );
                echo json_encode($response);
            }
        } else {
            $response = array(
                "success" => false,
                "message" => "You have already saved this recipe."
            );
            echo json_encode($response);
        }
    }
} catch (Exception $e) {
    $response = array(
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    );
    echo json_encode($response);
}
