<?php

session_start();
require_once("db_connect.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];

    $sql = "SELECT id, password FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($user_id, $pass);
        $stmt->fetch();

        if ($password == $pass) {
            $_SESSION["loggedin"] = true;
            $_SESSION["user_id"] = $user_id;
            $_SESSION["username"] = $username;

            setcookie("login", 'logged_in', time() + 86400 * 30, "/");
            setcookie("user_id", $user_id, time() + 86400 * 30, "/");
            header("location: ../index.html");
        } else {
            $_SESSION['error'] = "The password you entered was not valid.";
            header("Location: ../login_signup.html");
        }
    } else {
        $_SESSION['error'] = "No account found with that username.";
        header("Location: ../login_signup.html");
    }
}
