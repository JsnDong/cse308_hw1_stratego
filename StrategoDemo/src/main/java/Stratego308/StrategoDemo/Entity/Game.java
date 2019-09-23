package Stratego308.StrategoDemo.Entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer gameNumber;
    private Integer winLose;                //0 = Lose, 1 = Win
    private String time;
    private String username;

    public Game() {

    }

    public Game(Integer winLose, String time, String username) {
        this.setWinLose(winLose);
        this.setTime(time);
        this.setUsername(username);
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setWinLose(Integer winLose) {
        this.winLose = winLose;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getUsername() {
        return username;
    }

    public int getwinLose() {
        return winLose;
    }

    public String getTime() {
        return time;
    }
}
