<?php

session_start();
require_once("db_connect.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];
    $email = $_POST["email"];

    $sql = "SELECT id FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows == 0) {
        $sql = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $username, $password, $email);

        if ($stmt->execute()) {
            $_SESSION["loggedin"] = true;
            $_SESSION["user_id"] = $conn->insert_id;
            $_SESSION["username"] = $username;

            setcookie("login", 'logged_in', time() + 86400 * 30, "/");
            setcookie("user_id", $user_id, time() + 86400 * 30, "/");
            header("location: ../index.html");
        } else {
            echo "Error: " . $stmt->error;
        }
    } else {
        echo "Username already taken.";
    }
}
