package Stratego308.StrategoDemo.Testing;

import Stratego308.StrategoDemo.Entity.User;

import java.util.ArrayList;
import java.util.List;

public class UserTesting {

    private List<User> users;

    private static UserTesting instance = null;

    public static UserTesting getInstance() {
        if (instance == null) {
            instance = new UserTesting();
        }

        return  instance;
    }

    public UserTesting() {
        users = new ArrayList<User>();

        users.add(new User("wow123", "admin123"));
        users.add(new User("user1", "pass1"));
    }

    public List<User> fetchUsers() {
        return users;
    }

    public User getUserbyUsername(String username) {
        for (User u: users) {
            if (u.getUsername() == username) {
                return u;
            }
        }

        return null;
    }

    public User createUser(String username, String password) {
        User user = new User(username, password);
        users.add(user);
        return user;
    }


    public User updatePassword(String username, String password) {
        for (User u: users) {
            if (u.getUsername() == username) {
                u.setPassword(password);
                return u;
            }
        }

        return null;
    }

    public boolean deleteUser(String username) {
        User user = null;
        for (User u: users) {
            if (u.getUsername() == username) {
                user = u;
            }
        }

        if (user != null) {
            users.remove(user);
        }

        return true;
    }


}
