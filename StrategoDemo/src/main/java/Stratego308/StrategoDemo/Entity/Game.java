package Stratego308.StrategoDemo.Entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int gameNumber;
    private int winLose;                //0 = Lose, 1 = Win
    private String time;
    private String username;
    private byte[] moveList;
    private byte[] startList;
    private String moveListDe;
    private String startListDe;

    public Game() {

    }

    public Game(int winLose, String time, String username, byte[] moveList, byte[] startList, String moveListDe, String startListDe) {
        this.setWinLose(winLose);
        this.setTime(time);
        this.setUsername(username);
        this.setMoveList(moveList);
        this.setStartList(startList);
        this.setMoveListDe(moveListDe);
        this.setStartListDe(startListDe);
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

    public void setMoveList (byte[] moveList) { this.moveList = moveList; }

    public void setStartList (byte[] startList) { this.startList = startList; }

    public void setMoveListDe (String moveListDe) { this.moveListDe = moveListDe; }

    public void setStartListDe (String startListDe) { this.startListDe = startListDe; }

    public String getUsername() {
        return username;
    }

    public int getwinLose() {
        return winLose;
    }

    public String getTime() {
        return time;
    }

    public String getMoveListDe() { return moveListDe; }

    public String getStartListDe() { return startListDe; }

    public int getGameNumber() { return gameNumber; }

    public byte[] getMoveList() { return moveList; }

    public byte[] getStartList() { return startList; }
}
