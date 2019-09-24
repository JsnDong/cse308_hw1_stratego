package Stratego308.StrategoDemo.Controller;

import Stratego308.StrategoDemo.Entity.Game;
import Stratego308.StrategoDemo.Repository.GameRespository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public Game createGame() {
        int winLose = 1;
        String time = "1:00";
        String username = "tester1";
        return gameRespository.save(new Game(winLose, time, username));
    }

    @GetMapping(path = "/getGame")
    public List<Game> getGame() {
        return gameRespository.findByUsernameContaining("tester1");
    }
}
