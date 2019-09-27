package Stratego308.StrategoDemo.Controller;

import Stratego308.StrategoDemo.Entity.Game;
import Stratego308.StrategoDemo.Repository.GameRespository;
import org.apache.commons.lang3.SerializationUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
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

        gameRespository.save(dbGame);
        return ResponseEntity.ok(null);
    }

    @GetMapping(path = "/getInfo/{username}")
    @CrossOrigin(origins = "*")
    public String getInfo(@PathVariable String username) {
        Long totalLose = gameRespository.countByUsernameAndWinLose(username, 0);
        Long totalWin = gameRespository.countByUsernameAndWinLose(username, 1);
        String res = "{\"totalWin\":" + totalWin + ",\"totalLose\":" + totalLose + "}";
        return res;
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

    @GetMapping(path = "/getGame/{id}")
    @CrossOrigin(origins = "*")
    public Game getGame(@PathVariable int id) {
        Game res = gameRespository.findBygameNumber(id);
        res.setMoveListDe(SerializationUtils.deserialize(res.getMoveList()));
        res.setStartListDe(SerializationUtils.deserialize(res.getStartList()));
        return  res;
    }
}
