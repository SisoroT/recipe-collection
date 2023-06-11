<?php

session_start();
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
require_once("db_connect.php");

try {
    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        $userId = $_SESSION["user_id"];

        $sql = "SELECT * FROM saved_recipes WHERE user_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        $savedRecipes = array();
        while ($row = $result->fetch_assoc()) {
            array_push($savedRecipes, $row);
        }
        echo json_encode($savedRecipes);
    }
} catch (Exception $e) {
    $response = array(
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    );
    echo json_encode($response);
}
