package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.services.JpaUserServiceImpl;

import java.security.Principal;

@Controller
@RequestMapping("/")
public class UserController {
    private JpaUserServiceImpl userService;

    @Autowired
    public UserController(JpaUserServiceImpl userService) {
        this.userService = userService;
    }

    @GetMapping(value = "login")
    public String loginPage() {
        return "/login";
    }

//    @GetMapping("user")
//    public String showUserInfo(@AuthenticationPrincipal User user, Model model) {
//        model.addAttribute("user", user);
//        System.out.println(user.getRoles());
//        return "/user";
//    }

//        @GetMapping("/user")
//    public ResponseEntity<User> getUserByUsername (Principal principal) {
//        User user = userService.findByEmail(principal.getName());
//        return new ResponseEntity<>(user, HttpStatus.OK);
//    }
}
