package Stratego308.StrategoDemo.Controller;

import Stratego308.StrategoDemo.Entity.User;
import Stratego308.StrategoDemo.Repository.UsersRepository;
import Stratego308.StrategoDemo.Testing.UserTesting;
import com.fasterxml.jackson.databind.util.JSONPObject;
import com.fasterxml.jackson.databind.util.JSONWrappedObject;
import io.jsonwebtoken.*;
import jdk.nashorn.internal.runtime.JSONFunctions;
import org.apache.commons.lang3.SerializationUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import org.json.JSONObject;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
public class UserController {

    Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    @Autowired
    UsersRepository userRepository;

    @RequestMapping(value = "/pong", method = RequestMethod.GET)
    @CrossOrigin(origins = "*")
    public String index() {
        return "asdfasf";
    }

    //UserTesting userTesting = UserTesting.getInstance();

    @GetMapping (path = "/allUsers")
    @CrossOrigin(origins = "*")
    public List<User> allUsers() {
        return userRepository.findAll();
    }

    //@RequestMapping(value = "/post", method = RequestMethod.POST)
    @PostMapping (path = "/userPost")
    @CrossOrigin(origins = "*")
    public ResponseEntity create(@RequestBody User user) {
        User dbUser = userRepository.findByUsername(user.getUsername());
        if (dbUser != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        userRepository.save(user);
        return ResponseEntity.ok(null);
    }

    @PostMapping (path = "/users")
    @CrossOrigin(origins = "*")
    public ResponseEntity getSingleUser(@RequestBody User user) {
        User dbUser = userRepository.findByUsername(user.getUsername());
        if (dbUser == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        if (dbUser.getPassword().equals(user.getPassword())) {
            String jwt = Jwts.builder()
                    .setSubject(user.getUsername())
                    .setExpiration(getExpirationDate())
                    .setIssuedAt(new Date())
                    .signWith(key)
                    .compact();
            return ResponseEntity.ok(jwt);
        }
        else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }


    @PostMapping (path = "/userList")
    @CrossOrigin(origins = "*")
    public String postWithList(@RequestBody String user) throws JSONException {
        /*String password = removeTillWord(user, "password");
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
        return password; */
        return "";
    }

    @PostMapping (path = "/token-auth")
    @CrossOrigin(origins = "*")
    public ResponseEntity verifyToken(@RequestBody String token) throws JSONException {
        Jws<Claims> jws;
        try {
            jws = Jwts.parser()
                    .setSigningKey(key)
                    .parseClaimsJws(token);
            Date expirationDate = jws.getBody().getExpiration();
            boolean isExpired = new Date().after(expirationDate);
            if (isExpired) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
            else {
                return ResponseEntity.ok(jws.getBody().getSubject());
            }
        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

    }

    private static Date getExpirationDate() {
        Date currentDate = new Date();
        Date expirationDate = DateUtils.addDays(currentDate, 1);
        return expirationDate;
    }

}