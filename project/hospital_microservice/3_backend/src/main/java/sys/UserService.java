package sys;

import java.util.List;

public interface UserService {

    public UserEntity findByUserId(Integer userId);

    public List<UserEntity> findAll();

    public List<UserEntity> findByRole(Enum role);

    public List<UserEntity> findByRole(Enum role, Integer limit);

    public UserEntity findByUserName(String userName);

    public UserEntity create(UserEntity userEntity);

    public UserEntity update(UserEntity userEntity);

    public void delete(UserEntity userEntity);

}
