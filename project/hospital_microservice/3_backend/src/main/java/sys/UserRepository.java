package sys;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<UserEntity,Integer> {

    public UserEntity findByUserId(int userid);

    public List<UserEntity> findAll();

    public UserEntity findByUserName(String userName);

    public List<UserEntity> findByRole(Enum role);

    public List<UserEntity> findByRole(Enum role, Pageable pageable);

    public UserEntity create(UserEntity userEntity);

    public UserEntity update(UserEntity userEntity);

    public void delete(Integer id);
}
