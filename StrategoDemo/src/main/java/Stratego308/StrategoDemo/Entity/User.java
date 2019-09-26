package Stratego308.StrategoDemo.Entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Table(name = "Users")
@Entity
public class User {

    @Id
    private String username;
    private byte[] password;

    public User() {

    }

    public User(String username, byte[] password) {
        this.setUsername(username);
        this.setPassword(password);
    }

    public String getUsername() {
        return username;
    }
/*
    public String getPassword() {
        return password;
    }
*/
    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(byte[] password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "User {" +
                "username = " + username +
                ", password = " + password + "}";
    }
}
