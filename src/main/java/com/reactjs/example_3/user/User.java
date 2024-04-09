package com.reactjs.example_3.user;

public class User {
    private String username;
    private String password;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return "*".repeat(password.length());
    }

    public String getPasswordHint() {
        if (password.equals("123456")) {
            return "The best password.";
        }
        return "Not 123456.";
    }
}
