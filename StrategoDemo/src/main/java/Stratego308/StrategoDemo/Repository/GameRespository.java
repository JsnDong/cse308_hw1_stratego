package Stratego308.StrategoDemo.Repository;

import Stratego308.StrategoDemo.Entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRespository extends JpaRepository<Game, Integer> {

    Game findByUsername(String username);
    List<Game> findByUsernameContaining(String username);
}
