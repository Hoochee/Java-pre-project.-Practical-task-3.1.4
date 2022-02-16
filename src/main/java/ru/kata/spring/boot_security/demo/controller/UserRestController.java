package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.services.JpaUserServiceImpl;

import java.security.Principal;

@RestController
@RequestMapping("/api")
public class UserRestController {
    private JpaUserServiceImpl userService;

    @Autowired
    public UserRestController(JpaUserServiceImpl userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    public ResponseEntity<User> getUserByUsername (Principal principal) {
        User user = (User) userService.loadUserByUsername(principal.getName());
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}
