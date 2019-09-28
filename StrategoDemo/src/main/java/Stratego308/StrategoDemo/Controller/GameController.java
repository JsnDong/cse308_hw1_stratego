package Stratego308.StrategoDemo.Controller;

import Stratego308.StrategoDemo.Entity.Game;
import Stratego308.StrategoDemo.Repository.GameRespository;
import org.apache.commons.lang3.SerializationUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class GameController {

    @Autowired
    GameRespository gameRespository;

    @GetMapping(path = "/game")
    public List<Game> index() {
        return gameRespository.findAll();
    }

    @PostMapping(path = "/createGame")
    @CrossOrigin(origins = "*")
    public ResponseEntity createGame(@RequestBody String game) throws JSONException {

        JSONObject jsonObject = new JSONObject(game);
        Game dbGame = new Game();
        dbGame.setUsername(jsonObject.getString("username"));
        dbGame.setTime(jsonObject.getString("time"));
        dbGame.setWinLose(jsonObject.getInt("winLose"));

        String moveList = jsonObject.getString("moveList");
        byte[] moveListByte = SerializationUtils.serialize(moveList);
        String startList = jsonObject.getString("startList");
        byte[] startListByte = SerializationUtils.serialize(startList);

        dbGame.setMoveList(moveListByte);
        dbGame.setStartList(startListByte);

        System.out.println(startListByte);

        gameRespository.save(dbGame);
        return ResponseEntity.ok(null);
    }

    //@GetMapping(path = "/getInfo/{username}")
    @RequestMapping(path = "/getInfo/{username}", method = RequestMethod.GET, produces="application/json")
    @CrossOrigin(origins = "*")
    public ResponseEntity getInfo(@PathVariable String username) throws JSONException {
        Long totalLose = gameRespository.countByUsernameAndWinLose(username, 0);
        Long totalWin = gameRespository.countByUsernameAndWinLose(username, 1);
        Long totalTie = gameRespository.countByUsernameAndWinLose(username, 2);
        int minutes = 0;
        double seconds = 0;

        List<Game> gameList = gameRespository.findByUsername(username);
        for (int i = 0; i < gameList.size(); i ++) {
            Game g = gameList.get(i);
            String time = g.getTime();
            String[] timeList = time.split(":");

            minutes = Integer.parseInt(timeList[0]) + minutes;
            seconds = Integer.parseInt(timeList[1]) + seconds;
        }

        seconds = (seconds + (minutes * 60)) / gameList.size();
        minutes = (int) (seconds / 60);
        seconds = seconds % 60;

        String avgTime = "";
        if (seconds < 10) {
            avgTime = minutes + ":0" + (int)seconds;
        } else {
            avgTime = minutes + ":" + seconds;
        }

        String res = "{\"totalWin\":" + totalWin + ",\"totalLose\":" + totalLose + ",\"totalTie\":" + totalTie + ",\"averageTime\":" + avgTime + "}";
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("totalWin", totalWin);
        jsonObject.put("totalLose", totalLose);
        jsonObject.put("totalTie", totalTie);
        jsonObject.put("averageTime", avgTime);

        return new ResponseEntity<String>(jsonObject.toString(), HttpStatus.OK);
    }

    @GetMapping(path = "/getHistory/{username}")
    @CrossOrigin(origins = "*")
    public List<Game> getHistory(@PathVariable String username) {
        List<Game> res = gameRespository.findByUsername(username);
        for (int i = 0; i < res.size(); i ++) {
            Game g = res.get(i);
            g.setMoveListDe(SerializationUtils.deserialize(g.getMoveList()));
            g.setStartListDe(SerializationUtils.deserialize(g.getStartList()));
            res.set(i, g);
        }
        return  res;
    }

    @RequestMapping(path = "/getGame/{id}", method = RequestMethod.GET, produces="application/json")
    @CrossOrigin(origins = "*")
    public Game getGame(@PathVariable int id) throws JSONException {
        Game res = gameRespository.findBygameNumber(id);
        res.setMoveListDe(SerializationUtils.deserialize(res.getMoveList()));
        res.setStartListDe(SerializationUtils.deserialize(res.getStartList()));

        return res;
    }
}
