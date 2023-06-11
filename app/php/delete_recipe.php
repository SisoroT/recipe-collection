<?php

session_start();
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
require_once("db_connect.php");

try {
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $input = json_decode(file_get_contents('php://input'), true);

        $user_id = $input["user_id"];
        $recipe_id = $input["recipe_id"];

        $sql = "DELETE FROM saved_recipes WHERE user_id = ? AND id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $user_id, $recipe_id);

        if ($stmt->execute()) {
            // If the recipe was deleted successfully:
            echo json_encode(['success' => true, 'message' => 'Recipe deleted.']);
        } else {
            // If there was an error while deleting the recipe:
            echo json_encode(['success' => false, 'message' => 'Failed to delete the recipe.']);
        }
    } else {
        // If the request method is not POST:
        echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    }
} catch (Exception $e) {
    $response = array(
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    );
    echo json_encode($response);
}
