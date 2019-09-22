package Stratego308.StrategoDemo.Repository;

import Stratego308.StrategoDemo.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsersRepository extends JpaRepository<User, String>{

    User findByUsername(String username);
    //List<User> findByTitleContainingOrContentContaining(String text, String textAgain);

}
