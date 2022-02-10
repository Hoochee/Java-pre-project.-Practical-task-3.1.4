package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.services.JpaUserServiceImpl;

import java.security.Principal;

@Controller
public class UserController {
    private JpaUserServiceImpl userService;

    @Autowired
    public UserController(JpaUserServiceImpl userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    public String pageForUser(Model model, Principal principal) {
        model.addAttribute("user", userService.loadUserByUsername(principal.getName()));
        return "user";
    }

    @GetMapping("user/{id}")
    public String show(@PathVariable("id") long id, Model model) {
        model.addAttribute("user", userService.findUserById(id));
        return "/user";
    }
}
