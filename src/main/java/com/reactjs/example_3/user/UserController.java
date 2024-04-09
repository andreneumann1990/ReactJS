package com.reactjs.example_3.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

// this is supposed to be for requests or interactions between fron and back
// end;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class UserController {

    @PostMapping("/submit")
    public ResponseEntity<User> submitUser(@RequestBody User user) {
        return ResponseEntity.ok(user);
    }
}