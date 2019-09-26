package Stratego308.StrategoDemo.Controller;

import Stratego308.StrategoDemo.Entity.User;
import Stratego308.StrategoDemo.Repository.UsersRepository;
import Stratego308.StrategoDemo.Testing.UserTesting;
import com.fasterxml.jackson.databind.util.JSONPObject;
import com.fasterxml.jackson.databind.util.JSONWrappedObject;
import jdk.nashorn.internal.runtime.JSONFunctions;
import org.apache.commons.lang3.SerializationUtils;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import org.json.JSONObject;

import java.util.List;
import java.util.Map;

@RestController
public class UserController {

    @Autowired
    UsersRepository userRepository;

    @RequestMapping(value = "/pong", method = RequestMethod.GET)
    @CrossOrigin(origins = "*")
    public String index() {
        return "asdfasf";
    }

    //UserTesting userTesting = UserTesting.getInstance();

    @GetMapping (path = "/users")
    @CrossOrigin(origins = "*")
    public List<User> allUsers() {
        return userRepository.findAll();
    }

    //@RequestMapping(value = "/post", method = RequestMethod.POST)
    @PostMapping (path = "/userPost")
    @CrossOrigin(origins = "*")
    public User create(@RequestBody User user) {
        return userRepository.save(user);
    }

    @GetMapping (path = "/users/{username}")
    @CrossOrigin(origins = "*")
    public User getSingleUser(@PathVariable String username) {
        User user = userRepository.findByUsername(username);
        return user;
    }

    public static String removeTillWord(String input, String word) {
        return input.substring(input.indexOf(word));
    }


    @PostMapping (path = "/userList")
    @CrossOrigin(origins = "*")
    public String postWithList(@RequestBody String user) throws JSONException {
        String password = removeTillWord(user, "password");
        password = "{\"" + password;                                    //have the move be the last attribute
        String[] arrOfStr = user.split(",", 2);             // split character, how many split
        System.out.println(arrOfStr[0].split(":", 2)[1]);   //get desired index, split at colon and get value

        JSONObject jsonObject = new JSONObject(user);
        password = jsonObject.getString("password");
        byte[] data = SerializationUtils.serialize(password);
        String pog = SerializationUtils.deserialize(data);
        System.out.println(pog);

        User user1 = new User("testing",data);
        userRepository.save(user1);
        return password;
    }

}

//https://medium.com/better-programming/building-a-spring-boot-rest-api-part-iii-integrating-mysql-database-and-jpa-81391404046a
