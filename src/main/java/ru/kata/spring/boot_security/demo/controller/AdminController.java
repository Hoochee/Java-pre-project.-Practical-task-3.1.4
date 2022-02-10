package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.services.JpaUserServiceImpl;

import javax.validation.Valid;
import java.util.ArrayList;

@Controller
public class AdminController {

    @Autowired
    private JpaUserServiceImpl userService;

    @GetMapping("/admin")
    public String userList(Model model) {
        model.addAttribute("allUsers", userService.allUsers());
        return "admin";
    }

    @DeleteMapping("admin/delete/{id}")
    public String  deleteUser(@PathVariable("id") long id) {

            userService.deleteUser(id);

        return "redirect:/admin";
    }

    @GetMapping("/admin/edit/{id}")
    public String edit(@PathVariable("id") long id, Model model) {
        model.addAttribute("user", userService.findUserById(id));
        model.addAttribute("listRoles", userService.getAllRoles());
        return "/edit";
    }

    @PutMapping("admin/edit")
    public String pageEdit(@Valid User user, BindingResult bindingResult,
                           @RequestParam("listRoles") ArrayList<Long>roles) {
        if (bindingResult.hasErrors()) {
            return "edit";
        }
        userService.updateUser(user,userService.findRoles(roles));
        return "redirect:/admin";
    }

    @GetMapping("/admin/new")
    public String newUser(@ModelAttribute("user") User user) {
        return "/new";
    }

    @PostMapping("/admin/new")
    public String addUser(@ModelAttribute("user") User userForm, Model model) {

        if (!userService.saveUser(userForm)){
            model.addAttribute("usernameError", "Пользователь с таким именем уже существует");
            return "new";
        }
        return "redirect:/admin";
    }
}
