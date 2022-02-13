package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.services.JpaUserServiceImpl;

import java.util.ArrayList;

@Controller
public class AdminController {

    @Autowired
    private JpaUserServiceImpl userService;

    @GetMapping("/admin")
    public String showAdminPage(@AuthenticationPrincipal User user, Model model) {
        model.addAttribute("users", userService.allUsers());
        model.addAttribute("user", user);
        model.addAttribute("roles", userService.getAllRoles());
        return "admin";
    }

    @DeleteMapping("admin/delete/{id}")
    public String deleteUser(@PathVariable("id") long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }

    @PutMapping("/admin/edit/")
    public String updateUser(@ModelAttribute("user") User user, Model model, @RequestParam("listRoles") ArrayList<Long> roles) {
        model.addAttribute("roles", userService.getAllRoles());
        System.out.println(user.getId());
        System.out.println(user.getEmail());
        userService.updateUser(user, userService.findRoles(roles));
        return "redirect:/admin";
    }

    @PostMapping("admin/new")
    public String addUser(@ModelAttribute("user") User userForm, Model model, @RequestParam("listRoles3") ArrayList<Long> roles) {
        userService.saveUser(userForm, userService.findRoles(roles));
        return "redirect:/admin";
    }
}
