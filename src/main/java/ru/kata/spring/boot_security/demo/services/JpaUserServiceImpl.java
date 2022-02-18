package ru.kata.spring.boot_security.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.JpaRoleRepository;
import ru.kata.spring.boot_security.demo.repository.JpaUserRepository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.*;

@Service
public class JpaUserServiceImpl implements UserDetailsService {
    @PersistenceContext
    private EntityManager em;
    @Autowired
    JpaUserRepository userRepository;
    @Autowired
    JpaRoleRepository roleRepository;
    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return user;
    }

    @Transactional(readOnly = true)
    public User findUserById(Long userId) {
        Optional<User> userFromDb = userRepository.findById(userId);
        return userFromDb.orElse(new User());
    }

    public List<User> allUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public boolean saveUser(User user,Set<Role> roles) {
        User userFromDB = userRepository.findByEmail(user.getEmail());
        if (userFromDB != null) {
            return false;
        } else {
            user.setRoles(roles);
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            userRepository.save(user);
            return true;
        }
    }
    //переделать на стандартный jpa
    @Transactional
    public void saveUser(User user) {
//        User userFromDB = userRepository.findByEmail(user.getEmail());
//        if (userFromDB != null) {
//            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
//            userRepository.save(user);
//            System.out.println("User is create");
//        }
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            userRepository.save(user);
            System.out.println("User is create");

    }
    @Transactional
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }



    @Transactional
    public void deleteUser(Long userId) {
        if (userRepository.findById(userId).isPresent()) {
            userRepository.deleteById(userId);
        }
    }

    @Transactional
    public void updateUser(User user, Set<Role> roles) {
        user.setRoles(roles);
        em.merge(user);
    }

    @Transactional(readOnly = true)
    public Set<Role> findRoles(List<Long> roles) {
        TypedQuery<Role> q = em.createQuery("select r from Role r where r.id in :role", Role.class);
        q.setParameter("role", roles);
        return new HashSet<>(q.getResultList());
    }

    @Transactional(readOnly = true)
    public List<Role> getAllRoles() {
        return em.createQuery("select r from Role r").getResultList();
    }


}
