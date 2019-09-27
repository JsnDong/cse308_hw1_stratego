package Stratego308.StrategoDemo.Repository;

import Stratego308.StrategoDemo.Entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Repository
public interface GameRespository extends JpaRepository<Game, Integer> {

    List<Game> findByUsername(@PathVariable String username);
    Game findBygameNumber(@PathVariable int id);
    List<Game> findByUsernameContaining(String username);
    Long countByUsername(String username);
    Long countByUsernameAndWinLose(@PathVariable String username, int winLose);
}
