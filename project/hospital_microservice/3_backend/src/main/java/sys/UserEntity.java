package sys;

import javax.persistence.*;

@Entity
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    private String userName;

    private String password;

    private String fullName;

    private String email;

    private String phoneNumber;

    private String address;

    private Enum role;
}
