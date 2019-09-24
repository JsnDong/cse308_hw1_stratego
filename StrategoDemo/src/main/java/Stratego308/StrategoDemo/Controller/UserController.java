package Stratego308.StrategoDemo.Controller;

import Stratego308.StrategoDemo.Entity.User;
import Stratego308.StrategoDemo.Repository.UsersRepository;
import Stratego308.StrategoDemo.Testing.UserTesting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
public class UserController {

    @Autowired
    UsersRepository userRepository;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index() {
        return "index";
    }

    //UserTesting userTesting = UserTesting.getInstance();

    @GetMapping (path = "/users")
    public List<User> allUsers() {
        return userRepository.findAll();
    }

    //@RequestMapping(value = "/post", method = RequestMethod.POST)
    @GetMapping (path = "/post")
    public User create() {
        String username = "TESTuser3";
        String password = "TESTpass3";
        return userRepository.save(new User(username, password));
    }

    @GetMapping (path = "/put")
    public User update() {
        User user = userRepository.findByUsername("TESTuser2");
        user.setPassword("changed");
        return userRepository.save(user);
    }

    @GetMapping (path = "/delete")
    public boolean delete() {
        User user = userRepository.findByUsername("TESTuser2");
        userRepository.delete(user);
        return true;
    }

}

//https://medium.com/better-programming/building-a-spring-boot-rest-api-part-iii-integrating-mysql-database-and-jpa-81391404046a
